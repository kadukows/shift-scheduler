from rest_framework import viewsets, permissions
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from ..serializers import (
    RoleSerializer,
    ScheduleSerializer,
    ShiftSerializer,
    WorkplaceSerializer,
    EmployeeSerializer)
from ..models import Employee, Schedule, Workplace, Shift, Role
from ..helpers import LastModifiedHeaderMixin


class WorkplaceViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class = WorkplaceSerializer
    queryset = Workplace.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Workplace.objects.filter(owner=self.request.user).all()


class EmployeeViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class  = EmployeeSerializer
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Employee.objects.filter(workplace__owner=self.request.user).all()


class ScheduleViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Schedule.objects.filter(workplace__owner=self.request.user).all()


class RoleViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    queryset = Role.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Role.objects.filter(workplace__owner=self.request.user).all()


class ShiftViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class = ShiftSerializer
    queryset = Shift.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Shift.objects.filter(schedule__workplace__owner=self.request.user).all()
