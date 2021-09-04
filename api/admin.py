from django.contrib import admin

from .models import Workplace, Schedule, Shift


admin.site.register(Workplace)
admin.site.register(Schedule)
admin.site.register(Shift)
