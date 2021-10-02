from datetime import date

from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import ScheduleSerializer
from ..models import Schedule, Workplace

from .helpers import RequestMock, ViewMock



class ScheduleSerializerTests(TestCase):
    def setUp(self):
        user = User.objects.create_user('foo', 'email@domain.com', 'foo')
        workplace = Workplace.objects.create(name="Test work location", owner=user)
        self.schedule = Schedule.objects.create(workplace=workplace, month_year=date(1990, 1, 1))

        self.context = {
            'request': RequestMock(user),
            'view': ViewMock('create')
        }

    def test_schedule_serializer_deserializers_and_saves(self):
        '''Assert that serialized object can be correctly deserialized'''
        serialized = ScheduleSerializer(self.schedule, context=self.context).data
        self.assertEqual(serialized['id'], self.schedule.id)
        self.assertEqual(serialized['workplace'], self.schedule.workplace.id)

        print(self.context)

        deserialized = ScheduleSerializer(context=self.context, data=serialized)
        deserialized.is_valid()
        new_schedule = deserialized.save()

        self.assertNotEqual(new_schedule, self.schedule)
