from datetime import date, datetime as DateTime, timezone, timedelta
from enum import Enum
from typing import Literal, Tuple

from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import EmployeeSerializer, ShiftSerializer, WorkplaceSerializer
from ..models import Role, Schedule, Workplace, Employee, Shift

from .helpers import RequestMock


class ShiftModelPart(Enum):
    SCHEDULE = 0
    EMPLOYEE = 1
    ROLE = 2


class ShiftSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('foo', 'a@a.com', 'foo')
        self.other_user = User.objects.create_user('bar', 'b@b.com', 'bar')
        self.workplace = Workplace.objects.create(name='WORKPLACE_NAME', owner=self.user)
        self.other_workplace = Workplace.objects.create(name='OTHER_WORKPLACE_NAME', owner=self.user)

    def createValidData(self) -> Tuple[Schedule, Employee, Role]:
        return (
            Schedule.objects.create(workplace=self.workplace, month_year=date(2000, 1, 1)),
            Employee.objects.create(first_name='F', last_name='B', workplace=self.workplace),
            Role.objects.create(workplace=self.workplace, name='BASIC_ROLE')
        )

    def createDataWithDifferentWorkplaces(self, invalidPart: Literal) -> Tuple[Schedule, Employee, Role]:
        schedule, employee, role = self.createValidData()

        if invalidPart == ShiftModelPart.SCHEDULE:
            schedule.workplace = self.other_workplace
            schedule.save()
        elif invalidPart == ShiftModelPart.EMPLOYEE:
            employee.workplace = self.other_workplace
            employee.save()
        elif invalidPart == ShiftModelPart.ROLE:
            role.workplace = self.other_workplace
            role.save()

        return (schedule, employee, role)

    def createValidShift(
        self,
        time_from: DateTime = DateTime(1999, 1, 1, 0, 0),
        time_to: DateTime = DateTime(1999, 1, 1, 8, 0)):
            schedule, employee, role = self.createValidData()
            return Shift.objects.create(
                schedule=schedule,
                employee=employee,
                role=role,
                time_from=time_from,
                time_to=time_to
            )

    def makeSut(self, *args, other_user=False, **kwargs):
        context = {
            'request': RequestMock(self.user if not other_user else self.other_user)
        }

        return ShiftSerializer(*args, context=context, **kwargs)

    def test_shift_serializer_serializes(self):
        schedule, employee, role = self.createValidData()
        time_from = DateTime(1999, 1, 1, 0, tzinfo=timezone(timedelta(hours=0)))
        time_to = DateTime(1999, 1, 1, 8, tzinfo=timezone(timedelta(hours=0)))
        shift = Shift.objects.create(
            schedule=schedule,
            employee=employee,
            role=role,
            time_from=time_from,
            time_to=time_to
        )
        sut = self.makeSut(shift)

        serialized = sut.data
        self.assertDictEqual(serialized, {
            'id': serialized['id'],
            'last_modified': serialized['last_modified'],
            'schedule': schedule.id,
            'employee': employee.id,
            'role': role.id,
            'time_from': '1999-01-01T00:00:00Z',
            'time_to': '1999-01-01T08:00:00Z'
        })

    def test_shift_serializer_deserializes(self):
        schedule, employee, role = self.createValidData()
        time_from = DateTime(1999, 1, 1, 0, tzinfo=timezone(timedelta(hours=0)))
        time_to = DateTime(1999, 1, 1, 8, tzinfo=timezone(timedelta(hours=0)))

        sut = self.makeSut(data={
            'schedule': schedule.id,
            'employee': employee.id,
            'role': role.id,
            'time_from': time_from.isoformat(),
            'time_to': time_to.isoformat()
        })

        self.assertTrue(sut.is_valid())
        shift: Shift = sut.save()
        self.assertIsInstance(shift.id, int)
        self.assertIsInstance(shift.last_modified, DateTime)
        self.assertEqual(shift.schedule, schedule)
        self.assertEqual(shift.employee, employee)
        self.assertEqual(shift.role, role)
        self.assertEqual(shift.time_from, time_from)
        self.assertEqual(shift.time_to, time_to)

    def test_shift_serializer_validates_workplaces_are_congruent(self):
        invalidParts = [ShiftModelPart.SCHEDULE, ShiftModelPart.EMPLOYEE, ShiftModelPart.ROLE]

        for invalidPart in invalidParts:
            with self.subTest():
                schedule, employee, role = self.createDataWithDifferentWorkplaces(invalidPart)
                time_from = DateTime(1999, 1, 1, 0, tzinfo=timezone(timedelta(hours=0)))
                time_to = DateTime(1999, 1, 1, 8, tzinfo=timezone(timedelta(hours=0)))

                sut = self.makeSut(data={
                    'schedule': schedule.id,
                    'employee': employee.id,
                    'role': role.id,
                    'time_from': time_from.isoformat(),
                    'time_to': time_to.isoformat()
                })

                self.assertFalse(sut.is_valid())
                self.assertDictEqual(sut.errors, {
                    'non_field_errors': [
                        'Mixing of schedule and/or employee and/or role from different workplaces is not permitted'
                    ]
                })

    def test_shift_serializer_validates_ownership_of_parts(self):
        schedule, employee, role = self.createValidData()
        time_from = DateTime(1999, 1, 1, 0, tzinfo=timezone(timedelta(hours=0)))
        time_to = DateTime(1999, 1, 1, 8, tzinfo=timezone(timedelta(hours=0)))

        sut = self.makeSut(data={
            'schedule': schedule.id,
            'employee': employee.id,
            'role': role.id,
            'time_from': time_from.isoformat(),
            'time_to': time_to.isoformat()
        }, other_user=True)

        self.assertFalse(sut.is_valid())
        self.assertDictEqual(sut.errors, {
            'schedule': [
                'Schedule not found'
            ],
            'employee': [
                'Employee not found'
            ],
            'role': [
                'Role not found'
            ]
        })
