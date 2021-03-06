# Generated by Django 3.2.7 on 2021-12-03 18:52

from django.db import migrations, models
import django.db.models.expressions


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_employee_preffered_roles'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='shift',
            constraint=models.CheckConstraint(check=models.Q(('time_from__lte', django.db.models.expressions.F('time_to'))), name='api_shift_time_from_lte_time_to'),
        ),
    ]
