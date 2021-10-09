from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import WorkplaceSerializer
from ..models import Workplace

from .helpers import RequestMock


class WorkplaceSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('foo', 'email@domain.com', 'foo')
        self.context = {
            'request': RequestMock(self.user)
        }

    def makeSut(self, *args, **kwargs):
        return WorkplaceSerializer(*args, **kwargs, context=self.context)

    def test_workplace_serializer_serializes(self):
        NAME = 'WORKPLACE_NAME'

        workplace = Workplace.objects.create(name=NAME, owner=self.user)
        sut = self.makeSut(workplace)

        serialized = sut.data
        self.assertIsInstance(serialized['id'], int)
        self.assertEqual(serialized['name'], NAME)
        self.assertIsInstance(serialized['last_modified'], str)

    def test_workplace_serializer_deserializes(self):
        NAME = 'WORKPLACE_NAME'

        sut = self.makeSut(data={'name': NAME})

        self.assertTrue(sut.is_valid())

    def test_workplace_serializer_validates_name(self):
        NAME = 'foobar_workplace'

        sut = self.makeSut(data={'name': NAME})

        self.assertFalse(sut.is_valid())
        self.assertTrue("name" in sut.errors)
    
    def test_workplace_serializer_creates_object(self):
        NAME = 'WORKPLACE_NAME'

        sut = self.makeSut(data={'name': NAME})

        self.assertTrue(sut.is_valid())
        created = sut.save()
        self.assertEqual(created.name, NAME)
        self.assertIsInstance(created.id, int)
        self.assertEqual(created.owner, self.user)
