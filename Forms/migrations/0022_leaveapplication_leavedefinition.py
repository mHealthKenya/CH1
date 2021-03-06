# Generated by Django 3.2 on 2021-05-24 16:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0028_auto_20210524_1332'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Forms', '0021_alter_travelauthorization_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveDefinition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('leave', models.CharField(max_length=50)),
                ('duration', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='LeaveApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(max_length=50)),
                ('duration', models.PositiveIntegerField()),
                ('approved', models.BooleanField(default=False)),
                ('leave', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Forms.leavedefinition')),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('supervisor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.supervisors')),
            ],
        ),
    ]
