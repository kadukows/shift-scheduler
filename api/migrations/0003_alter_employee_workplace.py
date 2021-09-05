# Generated by Django 3.2.7 on 2021-09-05 01:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210904_2358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='workplace',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employees', to='api.workplace'),
        ),
    ]