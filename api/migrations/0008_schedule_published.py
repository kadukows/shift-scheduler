# Generated by Django 3.2.7 on 2021-11-13 01:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_shift_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedule',
            name='published',
            field=models.BooleanField(default=False),
        ),
    ]