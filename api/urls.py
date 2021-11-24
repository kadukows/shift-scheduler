from django.urls import path, include
from django.views.generic import base
from rest_framework.routers import DefaultRouter, BaseRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    common as common_views,
    manager as manager_views,
    employee as employee_views,
)

router = DefaultRouter()
router.register(r"user", common_views.UserViewSet)

#
#   Manager API endpoints
#
router.register(
    r"manager/workplace", manager_views.WorkplaceViewSet, basename="manager/workplace"
)
router.register(
    r"manager/employee", manager_views.EmployeeViewSet, basename="manager/employee"
)
router.register(
    r"manager/schedule", manager_views.ScheduleViewSet, basename="manager/schedule"
)
router.register(r"manager/shift", manager_views.ShiftViewSet, basename="manager/shift")
router.register(r"manager/role", manager_views.RoleViewSet, basename="manager/role")
router.register(
    r"manager/shift_template",
    manager_views.ShiftTemplateViewSet,
    basename="manager/shift_template",
)

#
#   Employee API endpoints
#
router.register(
    r"employee/workplace",
    employee_views.WorkplaceViewSet,
    basename="employee/workplace",
)
router.register(
    r"employee/employee", employee_views.EmployeeViewSet, basename="employee/employee"
)
router.register(
    r"employee/schedule", employee_views.ScheduleViewSet, basename="employee/schedule"
)
router.register(r"employee/role", employee_views.RoleViewSet, basename="employee/role")
router.register(
    r"employee/shift", employee_views.ShiftViewSet, basename="employee/shift"
)

#
#
#
#
#

urlpatterns = [path("", include(router.urls)), path("get_token/", obtain_auth_token)]
