from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Employee, Workplace, Schedule


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


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'workplace', 'last_name', 'first_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class WorkplaceSerializer(serializers.ModelSerializer):
    #employees = EmployeeSerializer(many=True)

    class Meta:
        model = Workplace
        fields = ['id', 'name', 'created_at', 'employees']
        read_only_fields = ['id', 'created_at']






# class ScheduleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Schedule
#         fields = ['id', 'name', ]
