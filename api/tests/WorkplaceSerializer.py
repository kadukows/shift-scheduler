from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import WorkplaceSerializer
from ..models import Workplace



class WorkplaceSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('foo', 'email@domain.com', 'foo')

    def test_workplace_serializer_serializes(self):
        NAME = 'WORKPLACE_NAME'

        workplace = Workplace.objects.create(name=NAME, owner=self.user)
        sut = WorkplaceSerializer(workplace)

        serialized = sut.data
        self.assertIsInstance(serialized['id'], int)
        self.assertEqual(serialized['name'], NAME)
        self.assertIsInstance(serialized['last_modified'], str)

    def test_workplace_serializer_deserializes(self):
        NAME = 'WORKPLACE_NAME'

        sut = WorkplaceSerializer(data={'name': NAME})

        self.assertTrue(sut.is_valid())

    def test_workplace_serializer_validates_name(self):
        NAME = 'foobar_workplace'

        sut = WorkplaceSerializer(data={'name': NAME})

        self.assertFalse(sut.is_valid())
