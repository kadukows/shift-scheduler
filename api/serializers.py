import datetime
import calendar
from dateutil.relativedelta import relativedelta
from typing import List

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import (
    Employee,
    LimitedAvailabilityDescriptor,
    ShiftTemplate,
    Workplace,
    Schedule,
    Shift,
    Role,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "first_name", "last_name"]
        read_only_fields = ["id"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user: User = User.objects.create(username=validated_data["username"])

        user.set_password(validated_data["password"])
        user.save()

        return user


class WorkplaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workplace
        fields = ["id", "name", "last_modified"]
        read_only_fields = ["id", "last_modified"]

    def validate_name(self, value):
        if value == "foobar_workplace":
            raise serializers.ValidationError("Can't be equal to 'foobar_workplace'")

        return value

    def create(self, validated_data):
        return Workplace.objects.create(
            owner=self.context["request"].user, **validated_data
        )


class EmployeeSerializerBase(serializers.ModelSerializer):
    def validate_workplace(self, value):
        user: User = self.context["request"].user
        if value.owner != user:
            raise serializers.ValidationError("Workplace not found")

        return value


class EmployeeSerializerManager(EmployeeSerializerBase):
    bound_to = serializers.BooleanField(source="get_is_bound_to", read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "last_name",
            "workplace",
            "first_name",
            "last_modified",
            "bound_to",
            "bounding_key",
        ]
        read_only_fields = ["id", "last_modified", "bound_to", "bounding_key"]


class EmployeeSerializerEmployee(EmployeeSerializerBase):
    class Meta:
        model = Employee
        fields = ["id", "last_name", "workplace", "first_name", "last_modified"]
        read_only_fields = ["id", "last_modified"]


class ScheduleSerializer(serializers.ModelSerializer):
    month_year = serializers.DateField(format="%m.%Y", input_formats=["%m.%Y"])

    class Meta:
        model = Schedule
        fields = ["id", "workplace", "month_year", "published", "last_modified"]
        read_only_fields = ["id", "last_modified"]

    def validate_workplace(self, value: Workplace):
        user: User = self.context["request"].user
        if value.owner != user:
            raise serializers.ValidationError("Workplace not found")

        return value


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = [
            "id",
            "schedule",
            "employee",
            "time_from",
            "time_to",
            "last_modified",
            "role",
        ]
        read_only_fields = ["id"]

    def validate_schedule(self, value: Schedule):
        """check if schedule belongs to owned workplace"""
        if value.workplace.owner != self.context["request"].user:
            raise serializers.ValidationError("Schedule not found")

        return value

    def validate_employee(self, value: Employee):
        """check if employee belongs to owned workplace"""
        if value.workplace.owner != self.context["request"].user:
            raise serializers.ValidationError("Employee not found")

        return value

    def validate_role(self, value: Role):
        """check if role belongs to owned workplace"""
        if value.workplace.owner != self.context["request"].user:
            raise serializers.ValidationError("Role not found")

        return value

    def validate(self, data):
        workplace = data["schedule"].workplace

        if (
            workplace != data["employee"].workplace
            or workplace != data["role"].workplace
        ):
            raise serializers.ValidationError(
                "Mixing of schedule and/or employee and/or role from different workplaces is not permitted"
            )

        if data["time_from"] > data["time_to"]:
            raise serializers.ValidationError(
                "'Time from' field is greater than 'time to'"
            )

        schedule: Schedule = data["schedule"]
        first_of_next_month = schedule.month_year + relativedelta(months=1)

        if (
            data["time_from"].date() < schedule.month_year
            or data["time_from"].date() > first_of_next_month
        ):
            raise serializers.ValidationError(f"Shift must be in schedule months")

        # from time import sleep
        # sleep(5.5)

        return data


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "workplace", "name", "last_modified"]
        read_only_fields = ["id", "last_modified"]

    def validate_workplace(self, value: Workplace):
        if value.owner != self.context["request"].user:
            raise serializers.ValidationError("Workplace not found")

        return value


class ShiftBatchCopySerializer(serializers.Serializer):
    date = serializers.DateField()


class EmptySerializerHelper(serializers.Serializer):
    pass


class EmployeeBindSerializer(serializers.Serializer):
    bind_key = serializers.CharField()

    def validate_bind_key(self, value):
        employee = Employee.objects.filter(bounding_key=value).first()

        if employee is None:
            raise serializers.ValidationError("Binding key not found")

        return value


class SolverModelInputSerializer(serializers.Serializer):
    employees = serializers.ListField(
        child=serializers.ModelField(model_field=Employee()._meta.get_field("id")),
        allow_empty=False,
    )
    roles = serializers.ListField(
        child=serializers.ModelField(model_field=Role()._meta.get_field("id")),
        allow_empty=False,
    )
    days = serializers.ListField(child=serializers.DateField(), allow_empty=False)

    def validate_employees(self, value: List[int]):
        employees: List[Employee] = [Employee.objects.get(pk=id) for id in value]

        if any(e is None for e in employees):
            raise serializers.ValidationError("Employee(s) not found")

        return employees

    def validate_roles(self, value: List[int]):
        roles: List[Role] = [Role.objects.get(pk=id) for id in value]

        if any(r is None for r in roles):
            raise serializers.ValidationError("Role(s) not found")

        return roles

    def validate(self, data):
        employees: List[Employee] = data["employees"]
        roles: List[Role] = data["roles"]

        if len(employees) == 0 and len(roles == 0):
            return data

        workplace = len(employees) != 0 and employees[0].workplace or roles[0].workplace

        if any(e.workplace != workplace for e in employees):
            raise serializers.ValidationError("Employee(s) not found")

        if any(r.workplace != workplace for r in roles):
            raise serializers.ValidationError("Role(s) not found")

        return data


class ShiftTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftTemplate
        fields = ["id", "workplace", "time_from", "time_to", "last_modified"]
        read_only_fields = ["id", "last_modified"]

    def validate_workplace(self, value: Workplace):
        if value.owner != self.context["request"].user:
            raise serializers.ValidationError("Workplace not found")

        return value


class LimitedAvailabilityDescriptorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LimitedAvailabilityDescriptor
        fields = ["id", "date", "employee", "la_type", "shift_templates"]
        read_only_fields = ["id"]

    def validate_employee(self, value: Employee):
        if value.workplace.owner != self.context["request"].user:
            raise serializers.ValidationError("Employee not found")

        return value

    def validate_shift_templates(self, value: List[ShiftTemplate]):
        if any(st.workplace.owner != self.context["request"].user for st in value):
            raise serializers.ValidationError("Shift template not found")

        return value
