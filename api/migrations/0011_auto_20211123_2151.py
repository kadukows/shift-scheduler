# Generated by Django 3.2.7 on 2021-11-23 21:51

import datetime
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20211123_2145'),
    ]

    operations = [
        migrations.AddField(
            model_name='role',
            name='priority',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='employee',
            name='time_job',
            field=models.IntegerField(default=8, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(8)]),
        ),
        migrations.AlterField(
            model_name='workplace',
            name='time_closes',
            field=models.TimeField(default=datetime.time(17, 0)),
        ),
        migrations.AlterField(
            model_name='workplace',
            name='time_opens',
            field=models.TimeField(default=datetime.time(9, 0)),
        ),
    ]
