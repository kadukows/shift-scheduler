import collections
import datetime
from functools import cached_property
from typing import List, Mapping, Tuple

from ortools.linear_solver import pywraplp
from ortools.init import pywrapinit
from ortools.sat.python import cp_model


from ..models import (
    LimitedAvailabilityDescriptor,
    Workplace,
    Shift,
    Employee,
    Role,
    ShiftTemplate,
    Schedule,
)


class TranslatedModel:
    def __init__(
        self,
        workplace: Workplace,
        employees: List[Employee],
        roles: List[Role],
        days: List[datetime.date],
    ):
        self.workplace = workplace
        self.employees = employees
        self.roles = roles
        self.days = days

        shift_templates: List[ShiftTemplate] = workplace.shift_templates.all()

        self.model = cp_model.CpModel()
        self.shifts: Mapping[
            Tuple[Employee, datetime.date, Role, ShiftTemplate], cp_model.IntVar
        ] = {}

        for employee in employees:
            for day in days:
                for role in roles:
                    for shift_template in shift_templates:
                        shift_template: ShiftTemplate
                        self.shifts[
                            (employee, day, role, shift_template)
                        ] = self.model.NewBoolVar(
                            f"shift_e{employee.id}d{day.isoformat()}r{role.id}st{shift_template.id}"
                        )

        #
        # Each role__shift_template can be assigned to single employee
        # but it can also be vacant
        #
        for day in days:
            for role in roles:
                for shift_template in shift_templates:
                    shift_template: ShiftTemplate
                    self.model.Add(
                        sum(
                            self.shifts[(e, day, role, shift_template)]
                            for e in employees
                        )
                        <= 1
                    )

        #
        # Each employee works at most one role__shift_template per day
        #
        #
        for employee in employees:
            for day in days:

                self.model.Add(
                    sum(
                        self.shifts[(employee, day, role, st)]
                        for role, st in shiftGenerator(
                            roles, workplace.shift_templates.all()
                        )
                    )
                    <= 1
                )

        #
        # Account for limited availability per employee
        #
        #

        for e in employees:
            for la in e.limited_availabilities.all():
                la: LimitedAvailabilityDescriptor
                if la.la_type == LimitedAvailabilityDescriptor.LA_Type.FREEDAY:
                    for r in roles:
                        for st in shift_templates:
                            self.model.Add(self.shifts[(e, la.date, r, st)] == 0)
                elif la.la_type == LimitedAvailabilityDescriptor.LA_Type.PREFERENCE:
                    for r in roles:
                        for st in la.shift_templates.all():
                            self.model.Add(self.shifts[(e, la.date, r, st)] == 0)

        #
        # Employee should have stable shift_template in given week
        #
        #
        days_grouped_by_weeks: Mapping[int, List[datetime.date]] = {}
        for day in days:
            y, week, _ = day.isocalendar()
            if week not in days_grouped_by_weeks:
                days_grouped_by_weeks[week] = []

            days_grouped_by_weeks[week].append(day)

        weeks = [tuple(v) for v in days_grouped_by_weeks.values()]

        week_employee_st_exists = {}
        for week_idx, week in enumerate(weeks):
            for e in employees:
                for st in shift_templates:
                    week_employee_st_exists[(week, e, st)] = self.model.NewBoolVar(
                        f"week{week_idx}_employee{e.id}_st{st.id}_choice"
                    )

        for week in weeks:
            for e in employees:
                self.model.AddBoolXOr(
                    week_employee_st_exists[(week, e, st)] for st in shift_templates
                )

        for week in weeks:
            for d in week:
                for e in employees:
                    for r in roles:
                        for st in shift_templates:
                            self.model.Add(
                                self.shifts[(e, d, r, st)]
                                <= week_employee_st_exists[(week, e, st)]
                            )

        #
        # Maximize assignments to roles with higher priority
        # and minimize changes in role by week basis
        #
        week_employee_role_exists = {}
        for week_idx, week in enumerate(weeks):
            for e in employees:
                for r in roles:
                    week_employee_role_exists[week, e, r] = self.model.NewBoolVar(
                        f"week{week_idx}_employee{e.id}_role{role.id}_exists"
                    )

        for week in weeks:
            for e in employees:
                for r in roles:
                    self.model.AddMaxEquality(
                        week_employee_role_exists[week, e, r],
                        (
                            self.shifts[e, d, r, st]
                            for st in shift_templates
                            for d in week
                        ),
                    )

        self.model.Maximize(
            (
                sum(
                    (self.shifts[(e, d, r, st)] * r.priority)
                    for e in employees
                    for d in days
                    for r in roles
                    for st in shift_templates
                )
                * 1000
                - sum(
                    sum(
                        week_employee_role_exists[week, e, r]
                        for e in employees
                        for r in roles
                    )
                    for week in weeks
                )
            )
        )

        self.solver = cp_model.CpSolver()

    @cached_property
    def status(self):
        return self.solver.Solve(self.model)

    def get_shifts(self, schedule: Schedule) -> List[Shift]:
        if self.status != cp_model.OPTIMAL:
            raise RuntimeError(
                "TranslatedModel.get_shifts(): non optimal solution found"
            )

        result: List[Shift] = []

        for e in self.employees:
            for d in self.days:
                for r in self.roles:
                    for st in self.workplace.shift_templates.all():
                        st: ShiftTemplate
                        if self.solver.Value(self.shifts[e, d, r, st]) == 1:
                            result.append(
                                Shift(
                                    schedule=schedule,
                                    time_from=datetime.datetime.combine(
                                        d, st.time_from
                                    ),
                                    time_to=datetime.datetime.combine(d, st.time_to),
                                    employee=e,
                                    role=r,
                                )
                            )

        return result


def shiftGenerator(roles: List[Role], shift_templates: List[ShiftTemplate]):
    for role in roles:
        for shift_template in shift_templates:
            shift_template: ShiftTemplate
            yield (role, shift_template)
