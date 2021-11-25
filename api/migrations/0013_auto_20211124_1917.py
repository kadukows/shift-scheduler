# Generated by Django 3.2.7 on 2021-11-24 19:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20211123_2253'),
    ]

    operations = [
        migrations.CreateModel(
            name='LimitedAvailabilityDescriptor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('date', models.DateField()),
                ('la_type', models.CharField(choices=[('FREE', 'Free'), ('PREF', 'Preference')], max_length=4)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='limited_availabilities', to='api.employee')),
                ('shift_templates', models.ManyToManyField(to='api.ShiftTemplate')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='FreeDays',
        ),
    ]