# Generated by Django 3.2.7 on 2021-12-06 21:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_shift_api_shift_time_from_lte_time_to'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='bounding_key',
            field=models.CharField(blank=True, db_index=True, max_length=24, null=True, unique=True),
        ),
    ]