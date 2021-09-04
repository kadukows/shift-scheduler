from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, WorkplaceViewSet, EmployeeViewSet

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'workplace', WorkplaceViewSet)
router.register(r'employee', EmployeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
