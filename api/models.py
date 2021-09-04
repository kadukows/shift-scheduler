from django.db import models
from django.contrib.auth.models import User


class Workplace(models.Model):
    name = models.CharField(max_length=255, null=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_workplaces', null=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    def __str__(self):
        return f'{self.name} (owner: {self.owner})'


class Employee(models.Model):
    workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name='employees', null=False)
    bound_to = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='employments', null=True, blank=True)
    bounding_key = models.CharField(max_length=16, null=True, blank=True)
    last_name = models.CharField(max_length=128, null=True)
    first_name = models.CharField(max_length=128, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Schedule(models.Model):
    workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name='schedules', null=False)
    month_year = models.DateField(null=False)  # we only need a month and a year
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    def __str__(self):
        return f'{self.workplace} - {self.month_year.strftime("%m.%y")}'


class Shift(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='shifts', null=False)
    time_from = models.DateTimeField(null=False)
    time_to = models.DateTimeField(null=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='shifts', null=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
