from datetime import date

from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import ScheduleSerializer
from ..models import Schedule, Workplace

from .helpers import RequestMock, ViewMock



class ScheduleSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('foo', 'email@domain.com', 'foo')
        self.other_user = User.objects.create_user('bar', 'bar@email.com' 'bar')        
        self.workplace = Workplace.objects.create(name="Test work location", owner=self.user)

    def makeSut(self, *args, other_user=False, **kwargs):
        context = {
            'request': RequestMock(self.user if not other_user else self.other_user)
        }        

        return ScheduleSerializer(*args, context=context, **kwargs)

    def test_schedule_serializer_serializes(self):
        schedule = Schedule.objects.create(workplace=self.workplace, month_year=date(1990, 1, 1))
        sut = self.makeSut(schedule)

        serialized = sut.data
        self.assertDictEqual(serialized, {
            'id': serialized['id'],
            'workplace': self.workplace.id,
            'month_year': '01.1990',
            'last_modified': serialized['last_modified']
        })

    def test_schedule_serializer_deserializes(self):
        sut = self.makeSut(data={
            'workplace': self.workplace.id,
            'month_year': '06.2000',
        })

        self.assertTrue(sut.is_valid())
        created = sut.save()
        self.assertEqual(created.workplace, self.workplace)
        self.assertEqual(created.month_year, date(2000, 6, 1))

    def test_schedule_serializer_validates_ownership_of_a_workplace(self):
        sut = self.makeSut(data={
            'workplace': self.workplace.id,
            'month_year': '09.2021'
        }, other_user=True)

        self.assertFalse(sut.is_valid())
        self.assertDictEqual(sut.errors, {
            'workplace': [
                'Workplace not found'
            ]
        })
    
    def test_schedule_serializer_validates_month_year_format(self):
        sut = self.makeSut(data={
            'workplace': self.workplace.id,
            'month_year': '09/2021'
        })

        self.assertFalse(sut.is_valid())
        self.assertDictEqual(sut.errors, {
            'month_year': [
                'Date has wrong format. Use one of these formats instead: MM.YYYY.'
            ]
        })
     