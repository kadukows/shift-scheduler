from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, WorkplaceViewSet, EmployeeViewSet, ScheduleViewSet

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'workplace', WorkplaceViewSet)
router.register(r'employee', EmployeeViewSet)
router.register(r'schedule', ScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
