
from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import EmployeeSerializer
from ..models import Workplace, Employee

from .helpers import RequestMock


class EmployeeSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('foo', 'a@a.com', 'foo')
        self.other_user = User.objects.create_user('bar', 'b@b.com', 'bar')
        self.workplace = Workplace.objects.create(name='TEST_WORKPLACE', owner=self.user)

    def makeSut(self, *args, other_user=False, **kwargs):
        context = {
            'request': RequestMock(self.user if not other_user else self.other_user)
        }

        return EmployeeSerializer(*args, context=context, **kwargs)

    def test_employee_serializer_serializes(self):
        FIRST_NAME = 'Foowski'
        LAST_NAME = 'Bazinski'

        employee = Employee.objects.create(
            first_name=FIRST_NAME,
            last_name=LAST_NAME,
            workplace=self.workplace)
        sut = self.makeSut(employee)

        serialized = sut.data
        self.assertDictEqual(serialized, {
            'id': serialized['id'],
            'last_name': LAST_NAME,
            'first_name': FIRST_NAME,
            'workplace': self.workplace.id,
            'last_modified': serialized['last_modified']
        })

    def test_employee_serializer_deserializes(self):
        FIRST_NAME = 'Foowski'
        LAST_NAME = 'Bazinski'

        sut = self.makeSut(data={
            'first_name': FIRST_NAME,
            'last_name': LAST_NAME,
            'workplace': self.workplace.id
        })

        self.assertTrue(sut.is_valid())
        created = sut.save()
        self.assertEqual(created.first_name, FIRST_NAME)
        self.assertEqual(created.last_name, LAST_NAME)
        self.assertEqual(created.workplace, self.workplace)

    def test_employee_serializer_validates_ownership_of_a_workplace(self):
        FIRST_NAME = 'Foowski'
        LAST_NAME = 'Bazinski'

        sut = self.makeSut(data={
            'first_name': FIRST_NAME,
            'last_name': LAST_NAME,
            'workplace': self.workplace.id
        }, other_user=True)

        self.assertFalse(sut.is_valid())
        self.assertDictEqual(sut.errors, {
            'workplace': [
                'Workplace not found'
            ]
        })
