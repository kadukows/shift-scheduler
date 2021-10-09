import datetime
from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import RoleSerializer
from ..models import Role, Workplace

from .helpers import RequestMock


class RoleSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('foo', 'a@a.com', 'foo')
        self.other_user = User.objects.create_user('bar', 'b@b.com', 'bar')
        self.workplace = Workplace.objects.create(name='TEST_WORKPLACE', owner=self.user)

    def makeSut(self, *args, other_user=False, **kwargs):
        context = {
            'request': RequestMock(self.user if not other_user else self.other_user)
        }

        return RoleSerializer(*args, context=context, **kwargs)

    def test_role_serializer_serializes(self):
        NAME = 'BASIC_ROLE'
        role = Role.objects.create(name=NAME, workplace=self.workplace)
        sut = self.makeSut(role)

        serialized = sut.data
        self.assertDictEqual(serialized, {
            'id': serialized['id'],
            'name': NAME,
            'workplace': self.workplace.id,
            'last_modified': serialized['last_modified']
        })

    def test_role_serializer_serializes(self):
        NAME = 'BASIC_ROLE'
        sut = self.makeSut(data={
            'name': NAME,
            'workplace': self.workplace.id,
        })

        self.assertTrue(sut.is_valid())
        created: Role = sut.save()
        self.assertIsInstance(created.id, int)
        self.assertIsInstance(created.last_modified, datetime.datetime)
        self.assertEqual(created.name, NAME)
        self.assertEqual(created.workplace, self.workplace)

    def test_role_serializer_validates_workplace_owner(self):
        NAME = 'BASIC_ROLE'
        sut = self.makeSut(data={
            'name': NAME,
            'workplace': self.workplace.id,
        }, other_user=True)

        self.assertFalse(sut.is_valid())
        self.assertDictEqual(sut.errors, {
            'workplace': [
                'Workplace not found'
            ]
        })
