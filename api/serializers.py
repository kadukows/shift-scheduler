from typing import List

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Employee, Workplace, Schedule
from .helpers import ReadOnlyUponActionSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name']
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        # debug
        if value == 'foobar':
            raise serializers.ValidationError("Can't be equal to 'foobar'")

        return value

    def create(self, validated_data):
        user: User = User.objects.create(
            username=validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

    def update(self, instance: User, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))

        return super(UserSerializer, self).update(instance, validated_data)


class WorkplaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workplace
        fields = ['id', 'name', 'created_at', 'employees']
        read_only_fields = ['id', 'created_at', 'employees']

    def create(self, validated_data):
        return Workplace.objects.create(owner=self.context['request'].user, **validated_data)


class EmployeeSerializer(ReadOnlyUponActionSerializer):
    action_to_ro_fields = {
        'update': ["workplace"]
    }

    class Meta:
        model = Employee
        fields = ['id', 'last_name', 'workplace', 'first_name', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_workplace(self, value):
        user: User = self.context['request'].user
        if value.owner != user:
            raise serializers.ValidationError("Workplace not found")


class ScheduleSerializer(ReadOnlyUponActionSerializer):
    action_to_ro_fields = {
        'update': ['workplace', 'month_year']
    }

    class Meta:
        model = Schedule
        fields = ['id', 'workplace', 'month_year', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_workplace(self, value):
        user: User = self.context['request'].user
        if value.owner != user:
            raise serializers.ValidationError("Workplace not found")
