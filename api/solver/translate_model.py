import collections
import datetime
from functools import cached_property
from typing import List, Mapping, Tuple

from ortools.linear_solver import pywraplp
from ortools.init import pywrapinit
from ortools.sat.python import cp_model


from ..models import Workplace, FreeDays, Shift, Employee, Role, ShiftTemplate, Schedule


class TranslatedModel:
    def __init__(self, workplace: Workplace, employees: List[Employee], roles: List[Role], days: List[datetime.date]):
        self.workplace = workplace
        self.employees = employees
        self.roles = roles
        self.days = days

        shift_templates: List[ShiftTemplate] = workplace.shift_templates.all()

        self.model = cp_model.CpModel()
        self.shifts: Mapping[Tuple[Employee, datetime.date,
                                   Role, ShiftTemplate], cp_model.IntVar] = {}

        for employee in employees:
            for day in days:
                for role in roles:
                    for shift_template in shift_templates:
                        shift_template: ShiftTemplate
                        self.shifts[(employee, day, role, shift_template)] = self.model.NewBoolVar(
                            f'shift_e{employee.id}d{day.isoformat()}r{role.id}st{shift_template.id}')

        #
        # Each role__shift_template can be assigned to single employee
        # but it can also be vacant
        #
        for day in days:
            for role in roles:
                for shift_template in shift_templates:
                    shift_template: ShiftTemplate
                    self.model.Add(
                        sum(self.shifts[(e, day, role, shift_template)] for e in employees) <= 1)

        #
        # Each employee works at most one role__shift_template per day
        #
        #
        for employee in employees:
            for day in days:

                self.model.Add(
                    sum(self.shifts[(employee, day, role, st)]
                        for role, st in shiftGenerator(roles, workplace.shift_templates.all())) <= 1)

        #
        # Maximize assignments to roles with higher priority
        #
        #
        self.model.Maximize(
            sum(
                (self.shifts[(e, d, r, st)] * r.priority) for e in employees for d in days for r in roles for st in shift_templates
            )
        )

        self.solver = cp_model.CpSolver()

    @cached_property
    def status(self):
        return self.solver.Solve(self.model)

    def get_shifts(self, schedule: Schedule) -> List[Shift]:
        if self.status != cp_model.OPTIMAL:
            raise RuntimeError(
                "TranslatedModel.get_shifts(): non optimal solution found")

        result: List[Shift] = []

        for e in self.employees:
            for d in self.days:
                for r in self.roles:
                    for st in self.workplace.shift_templates.all():
                        st: ShiftTemplate
                        if self.solver.Value(self.shifts[e, d, r, st]) == 1:
                            result.append(Shift(
                                schedule=schedule,
                                time_from=datetime.datetime.combine(
                                    d, st.time_from),
                                time_to=datetime.datetime.combine(
                                    d, st.time_to),
                                employee=e,
                                role=r))

        return result


def shiftGenerator(roles: List[Role], shift_templates: List[ShiftTemplate]):
    for role in roles:
        for shift_template in shift_templates:
            shift_template: ShiftTemplate
            yield (role, shift_template)
