# Generated by Django 3.2.7 on 2021-11-25 23:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20211125_1901'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='preffered_roles',
            field=models.ManyToManyField(blank=True, to='api.Role'),
        ),
    ]