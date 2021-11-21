from rest_framework import serializers, viewsets, permissions, status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from ..serializers import (
    RoleSerializer,
    ScheduleSerializer,
    ShiftSerializer,
    WorkplaceSerializer,
    EmployeeSerializer,
    ShiftBatchCopySerializer)
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

    @action(detail=True, methods=['post'], serializer_class=ShiftBatchCopySerializer)
    def batch_copy(self, request, pk=None):
        serializer = self.get_serializer(data=request.data, many=True)

        if (serializer.is_valid()):
            shift: Shift = self.get_object()
            new_shifts = []

            for shiftBatchCopy in serializer.validated_data:
                new_shift: Shift = Shift.objects.get(pk=shift.id)
                new_shift.id = None

                to_offset = new_shift.time_to - new_shift.time_from

                new_shift.time_from = new_shift.time_from.replace(day=shiftBatchCopy['date'].day)
                new_shift.time_to = new_shift.time_to.replace(day=shiftBatchCopy['date'].day + to_offset.days)

                possible_already_existing_shift: Shift = Shift.objects.filter(
                    time_from=new_shift.time_from,
                    time_to=new_shift.time_to,
                    schedule=new_shift.schedule,
                    employee=new_shift.employee,
                    role=new_shift.role
                ).first()

                if possible_already_existing_shift is None:
                    new_shift.save()
                    new_shifts.append(new_shift)

            return Response(ShiftSerializer(new_shifts, many=True).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
