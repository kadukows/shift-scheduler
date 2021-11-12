from django.urls import path, include
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    UserViewSet, WorkplaceViewSet, EmployeeViewSet, ScheduleViewSet, ShiftViewSet, RoleViewSet)

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'manager/workplace', WorkplaceViewSet)
router.register(r'manager/employee', EmployeeViewSet)
router.register(r'manager/schedule', ScheduleViewSet)
router.register(r'manager/shift', ShiftViewSet)
router.register(r'manager/role', RoleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('get_token/', obtain_auth_token)
]
