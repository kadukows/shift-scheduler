# Generated by Django 3.2.7 on 2021-11-25 19:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20211124_1917'),
    ]

    operations = [
        migrations.AlterField(
            model_name='limitedavailabilitydescriptor',
            name='la_type',
            field=models.CharField(choices=[('FREE', 'Free day'), ('PREF', 'Preference for free shift')], max_length=4),
        ),
        migrations.AlterField(
            model_name='limitedavailabilitydescriptor',
            name='shift_templates',
            field=models.ManyToManyField(blank=True, to='api.ShiftTemplate'),
        ),
        migrations.AlterUniqueTogether(
            name='limitedavailabilitydescriptor',
            unique_together={('date', 'employee')},
        ),
    ]