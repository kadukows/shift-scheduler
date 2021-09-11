from django.urls import path, include
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    UserViewSet, WorkplaceViewSet, EmployeeViewSet, ScheduleViewSet, ShiftViewSet)

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'workplace', WorkplaceViewSet)
router.register(r'employee', EmployeeViewSet)
router.register(r'schedule', ScheduleViewSet)
router.register(r'shift', ShiftViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('get_token/', obtain_auth_token)
]
