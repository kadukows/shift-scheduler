from django.test import TestCase
from django.contrib.auth.models import User

from ..serializers import EmployeeSerializer
from ..models import Workplace, Employee

from .helpers import RequestMock
