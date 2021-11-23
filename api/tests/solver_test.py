from datetime import time, date

from dateutil.relativedelta import relativedelta

from django.test import TestCase
from django.contrib.auth.models import User

from ..solver import TranslatedModel
from ..models import Role, Schedule, Workplace, Employee, Shift, ShiftTemplate


class TranslatedModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('foo', 'a@a.com', 'foo')
        self.workplace = Workplace.objects.create(
            name="Workplace1", owner=self.user)
        self.schedule = Schedule.objects.create(
            workplace=self.workplace,
            month_year=date(year=2021, month=10, day=1)
        )

    def scenario1(self):
        self.roles = [
            Role.objects.create(
                name="Role1", workplace=self.workplace, priority=1),
            Role.objects.create(
                name="Role2", workplace=self.workplace, priority=2)]

        ShiftTemplate.objects.create(
            workplace=self.workplace, time_from=time(hour=6), time_to=time(hour=14))
        ShiftTemplate.objects.create(
            workplace=self.workplace, time_from=time(hour=13), time_to=time(hour=21))

        self.employees = [
            Employee.objects.create(
                first_name="Foo", workplace=self.workplace),
            Employee.objects.create(first_name="Bar", workplace=self.workplace)
        ]

    def test_scenario1_chooses_role2(self):
        self.scenario1()

        root_date = date(year=2021, month=10, day=1)
        #dates = [root_date, root_date +
        #         relativedelta(days=1), root_date + relativedelta(days=2)]
        dates = []
        for i in range(2):
            dates.append(root_date + relativedelta(days=i))

        model = TranslatedModel(
            self.workplace, self.employees, self.roles, dates)

        shifts = model.get_shifts(self.schedule)

        print(shifts)
