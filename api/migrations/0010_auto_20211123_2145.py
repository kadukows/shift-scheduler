# Generated by Django 3.2.7 on 2021-11-23 21:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20211123_2139'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='time_job',
            field=models.IntegerField(null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(8)]),
        ),
        migrations.AddField(
            model_name='workplace',
            name='time_closes',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='workplace',
            name='time_opens',
            field=models.TimeField(null=True),
        ),
    ]