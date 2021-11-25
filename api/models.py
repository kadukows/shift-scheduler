from typing import Iterable, List
from datetime import date, datetime, time

from django.db import models
from django.core import validators
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy

from .helpers import LastModifiedBaseModel


class Workplace(LastModifiedBaseModel):
    name: str = models.CharField(max_length=255, null=False)
    owner: User = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_workplaces", null=False
    )
    # time_opens: time = models.TimeField(null=False, default=time(hour=9))
    # time_closes: time = models.TimeField(null=False, default=time(hour=17))

    def __str__(self):
        return f"({self.id}) {self.str_wo_id()}"

    def str_wo_id(self):
        return f"{self.name} (owner: {self.owner})"


class Employee(LastModifiedBaseModel):
    workplace: Workplace = models.ForeignKey(
        Workplace, on_delete=models.CASCADE, related_name="employees", null=False
    )
    bound_to: User = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="employments",
        null=True,
        blank=True,
    )
    bounding_key: str = models.CharField(
        max_length=24, null=True, blank=True, unique=True
    )
    last_name: str = models.CharField(max_length=128, null=True)
    first_name: str = models.CharField(max_length=128, null=True)
    # time_job: int = models.IntegerField(null=False, default=8, validators=[validators.MinValueValidator(1), validators.MaxValueValidator(8)])

    def __str__(self):
        return f"({self.id}) {self.str_wo_id()}"

    def str_wo_id(self):
        return f"{self.first_name} {self.last_name}"

    def get_is_bound_to(self):
        return self.bound_to != None


class Schedule(LastModifiedBaseModel):
    workplace: Workplace = models.ForeignKey(
        Workplace, on_delete=models.CASCADE, related_name="schedules", null=False
    )
    # we only need a month and a year
    month_year: date = models.DateField(null=False)
    published: bool = models.BooleanField(null=False, default=False)

    def __str__(self):
        return f"({self.id}) {self.str_wo_id()}"

    def str_wo_id(self):
        return f'{self.workplace.str_wo_id()} -- {self.month_year.strftime("%m.%Y")} -- PUBLISHED: {self.published}'


class Role(LastModifiedBaseModel):
    name: str = models.CharField(max_length=128, null=False)
    workplace: Workplace = models.ForeignKey(
        Workplace, on_delete=models.CASCADE, related_name="roles", null=False
    )
    priority: int = models.IntegerField(
        null=False, default=1, validators=[validators.MinValueValidator(1)]
    )

    def __str__(self):
        return f"({self.id}) {self.str_wo_id()}"

    def str_wo_id(self):
        return f"{self.name} -- {self.workplace.str_wo_id()}"


class Shift(LastModifiedBaseModel):
    schedule: Schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name="shifts", null=False
    )
    time_from: datetime = models.DateTimeField(null=False)
    time_to: datetime = models.DateTimeField(null=False)
    employee: Employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="shifts", null=False
    )
    role: Role = models.ForeignKey(
        Role, on_delete=models.CASCADE, related_name="shifts", null=False
    )

    def __str__(self):
        return f"({self.id}) {self.str_wo_id()}"

    def str_wo_id(self):
        return f"{self.employee.str_wo_id()} -- {self.role.name} -- {self.schedule.str_wo_id()}"


class ShiftTemplate(LastModifiedBaseModel):
    workplace: Workplace = models.ForeignKey(
        Workplace, on_delete=models.CASCADE, related_name="shift_templates", null=False
    )
    time_from: time = models.TimeField(null=False)
    time_to: time = models.TimeField(null=False)


class LimitedAvailabilityDescriptor(LastModifiedBaseModel):
    class LA_Type(models.TextChoices):
        FREEDAY = "FREE", gettext_lazy("Free day")
        PREFERENCE = "PREF", gettext_lazy("Preference for free shift")

    class Meta:
        unique_together = [["date", "employee"]]

    date: date = models.DateField(null=False)
    employee: Employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="limited_availabilities",
        null=False,
    )

    #
    # 2 modes of this object working:
    # LA_Type.FREEDAY = whole day is free for given employee (shift_templates is ignored)
    # LA_Type.PREFERENCE = shift_templates mentioned here will be forbidden when selecting shifts
    #
    la_type: LA_Type = models.CharField(max_length=4, choices=LA_Type.choices)
    shift_templates: List[ShiftTemplate] = models.ManyToManyField(
        ShiftTemplate, blank=True
    )
