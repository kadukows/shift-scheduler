from django.contrib import admin

from .models import Workplace, Schedule, Shift, Employee, Role, ShiftTemplate


admin.site.register([Workplace, Schedule, Shift, Employee, Role, ShiftTemplate])
