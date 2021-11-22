import os
from typing import List
from django.http import FileResponse
from django.db.models.query import QuerySet
from rest_framework import viewsets, permissions, status, renderers
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import permission_classes, action, renderer_classes
from rest_framework.response import Response
from icalendar import Calendar, Event
from ..serializers import (
    EmployeeBindSerializer,
    EmptySerializerHelper,
    RoleSerializer,
    ScheduleSerializer,
    ShiftSerializer,
    WorkplaceSerializer,
    EmployeeSerializerEmployee)
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
    serializer_class  = EmployeeSerializerEmployee
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Employee.objects.filter(bound_to=self.request.user).all()

    @action(detail=False, methods=['post'], serializer_class=EmployeeBindSerializer)
    def bind_new_employee(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            employee = Employee.objects.filter(bounding_key=serializer.validated_data["bind_key"]).first()
            employee.bound_to = self.request.user
            employee.save()
            return Response(EmployeeSerializerEmployee(employee).data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], serializer_class=EmptySerializerHelper)
    def delete_bound_employee(self, request, pk=None):
        employee: Employee = Employee.objects.get(pk=pk)

        if employee is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if employee.bound_to != request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        employee.bound_to = None
        employee.save()
        return Response(status=status.HTTP_200_OK)


class PassthroughRenderer(renderers.BaseRenderer):
    """
        Return data as-is. View should supply a Response.
    """
    media_type = ''
    format = ''
    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data


class ScheduleViewSet(LastModifiedHeaderMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        schedule_ids_from_shifts = get_bound_shifts(self.request.user).values('schedule')
        return Schedule.objects.filter(id__in=schedule_ids_from_shifts).filter(published=True).all()

    @action(detail=True, methods=["get"], renderer_classes=(PassthroughRenderer,))
    def get_ical(self, request, pk=None):
        schedule: Schedule = self.get_object()
        shifts: List[Shift] = Shift.objects.filter(schedule=schedule, employee__bound_to=request.user).all()

        cal = Calendar()
        for shift in shifts:
            event = Event()
            event.add('dtstart', shift.time_from)
            event.add('dtend', shift.time_to)
            event.add('summary', shift.role.name)
            event.add('location', shift.schedule.workplace.name)

            cal.add_component(event)

        ical_bytes = cal.to_ical().decode('utf-8')

        response = FileResponse(ical_bytes)
        response["Content-Length"] = len(ical_bytes)
        response["Content-Disposition"] = f'attachment; filename="schedule-{schedule.id}.ical"'

        return response


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
