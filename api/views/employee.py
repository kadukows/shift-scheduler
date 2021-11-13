from django.db.models.query import QuerySet
from rest_framework import serializers, viewsets, permissions
from rest_framework import authentication
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import permission_classes
from ..serializers import (
    RoleSerializer,
    ScheduleSerializer,
    ShiftSerializer,
    WorkplaceSerializer,
    EmployeeSerializer)
from ..models import Employee, Schedule, Workplace, Shift, Role
from ..helpers import LastModifiedHeaderMixin


class WorkplaceViewSet(LastModifiedHeaderMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = WorkplaceSerializer
    queryset = Workplace.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        bounded_employees = get_bound_employees(self.request.user).values('workplace')
        return Workplace.objects.filter(id__in=bounded_employees).all()


class EmployeeViewSet(LastModifiedHeaderMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class  = EmployeeSerializer
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Employee.objects.filter(bound_to=self.request.user).all()


class ScheduleViewSet(LastModifiedHeaderMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        schedule_ids_from_shifts = get_bound_shifts(self.request.user).values('schedule')
        return Schedule.objects.filter(id__in=schedule_ids_from_shifts).filter(published=True).all()


class RoleViewSet(LastModifiedHeaderMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = RoleSerializer
    queryset = Role.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        role_ids_from_bound_employees = get_bound_shifts(self.request.user).values('role')
        return Role.objects.filter(id__in=role_ids_from_bound_employees).all()


class ShiftViewSet(LastModifiedHeaderMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = ShiftSerializer
    queryset = Shift.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return get_bound_shifts(self.request.user).all()

#
#
#

def get_bound_employees(user) -> QuerySet[Employee]:
    return Employee.objects.filter(bound_to=user)

def get_bound_shifts(user) -> QuerySet[Shift]:
    bound_employees = get_bound_employees(user)
    return Shift.objects.filter(employee__in=bound_employees)
