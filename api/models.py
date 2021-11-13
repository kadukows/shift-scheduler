from typing import Iterable
from datetime import date, datetime

from django.db import models
from django.contrib.auth.models import User

from .helpers import LastModifiedBaseModel



class Workplace(LastModifiedBaseModel):
    name: str = models.CharField(max_length=255, null=False)
    owner: User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_workplaces', null=False)

    def __str__(self):
        return f'({self.id}) {self.str_wo_id()}'

    def str_wo_id(self):
        return f'{self.name} (owner: {self.owner})'


class Employee(LastModifiedBaseModel):
    workplace: Workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name='employees', null=False)
    bound_to: User = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='employments', null=True, blank=True)
    bounding_key: str = models.CharField(max_length=16, null=True, blank=True)
    last_name: str = models.CharField(max_length=128, null=True)
    first_name: str = models.CharField(max_length=128, null=True)

    def __str__(self):
        return f'({self.id}) {self.str_wo_id()}'

    def str_wo_id(self):
        return f'{self.first_name} {self.last_name}'


class Schedule(LastModifiedBaseModel):
    workplace: Workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name='schedules', null=False)
    month_year: date = models.DateField(null=False)  # we only need a month and a year
    published: bool = models.BooleanField(null=False, default=False)

    def __str__(self):
        return f'({self.id}) {self.str_wo_id()}'

    def str_wo_id(self):
        return f'{self.workplace.str_wo_id()} -- {self.month_year.strftime("%m.%Y")} -- PUBLISHED: {self.published}'


class Role(LastModifiedBaseModel):
    name: str = models.CharField(max_length=128, null=False)
    workplace: Workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name='roles', null=False)

    def __str__(self):
        return f'({self.id}) {self.str_wo_id()}'

    def str_wo_id(self):
        return f'{self.name} -- {self.workplace.str_wo_id()}'


class Shift(LastModifiedBaseModel):
    schedule: Schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='shifts', null=False)
    time_from: datetime = models.DateTimeField(null=False)
    time_to: datetime = models.DateTimeField(null=False)
    employee: Employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='shifts', null=False)
    role: Role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='shifts', null=False)

    def __str__(self):
        return f'({self.id}) {self.str_wo_id()}'

    def str_wo_id(self):
        return f'{self.employee.str_wo_id()} -- {self.role.name} -- {self.schedule.str_wo_id()}'
