from typing import List

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Employee, Workplace, Schedule, Shift, Role
from .helpers import ReadOnlyUponActionSerializerMixin


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
        fields = ['id', 'name', 'last_modified']
        read_only_fields = ['id', 'last_modified']

    def validate_name(self, value):
        if value == 'foobar_workplace':
            raise serializers.ValidationError("Can't be equal to 'foobar_workplace'")

        return value

    def create(self, validated_data):
        return Workplace.objects.create(owner=self.context['request'].user, **validated_data)


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'last_name', 'workplace', 'first_name', 'last_modified']
        read_only_fields = ['id', 'last_modified']

    def validate_workplace(self, value):
        user: User = self.context['request'].user
        if value.owner != user:
            raise serializers.ValidationError("Workplace not found")

        return value


class ScheduleSerializer(ReadOnlyUponActionSerializerMixin, serializers.ModelSerializer):
    month_year = serializers.DateField(format='%m.%Y', input_formats=['%m.%Y'])
    class Meta:
        model = Schedule
        fields = ['id', 'workplace', 'month_year', 'last_modified']
        read_only_fields = ['id', 'last_modified']

    def validate_workplace(self, value: Workplace):
        user: User = self.context['request'].user
        if value.owner != user:
            raise serializers.ValidationError("Workplace not found")

        return value


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['id', 'schedule', 'employee', 'time_from', 'time_to', 'last_modified', 'role']
        read_only_fields = ['id']

    def validate_schedule(self, value: Schedule):
        '''check if schedule belongs to owned workplace'''
        if value.workplace.owner != self.context['request'].user:
            raise serializers.ValidationError("Schedule not found")

        return value

    def validate_employee(self, value: Employee):
        '''check if employee belongs to owned workplace'''
        if value.workplace.owner != self.context['request'].user:
            raise serializers.ValidationError("Employee not found")

        return value


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'workplace', 'name']
        read_only_fields = ['id']

    def validate_workplace(self, value: Role):
        if value.workplace.owner != self.context['request'].user:
            raise serializers.ValidationError("Workplace not found")

        return value
