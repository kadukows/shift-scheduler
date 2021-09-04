from django.db import models
from django.contrib.auth.models import User



class Workplace(models.Model):
    name = models.CharField(max_length=255, null=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_workplaces', null=False)
    employees = models.ManyToManyField(User, related_name='workplaces')
    created_at = models.DateTimeField(auto_now_add=True, null=False)


class Schedule(models.Model):
    workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name='schedules', null=False)
    month_year = models.DateField(null=False)  # we only need a month and a year
    created_at = models.DateTimeField(auto_now_add=True, null=False)


class Shift(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='shifts', null=False)
    time_from = models.DateTimeField(null=False)
    time_to = models.DateTimeField(null=False)
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shifts', null=False)
