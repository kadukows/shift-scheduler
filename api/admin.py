from django.contrib import admin

from .models import Workplace, Schedule, Shift, Employee, Role


admin.site.register([Workplace, Schedule, Shift, Employee, Role])
