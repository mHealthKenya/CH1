# Generated by Django 3.2 on 2021-05-26 07:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Forms', '0026_alter_leaveapplication_year'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='leaveapplication',
            options={'ordering': ['-id']},
        ),
        migrations.CreateModel(
            name='LeaveApplicationSupervisor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approved', models.BooleanField(default=False)),
                ('comments', models.TextField(blank=True, null=True)),
                ('application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Forms.leaveapplication')),
            ],
        ),
    ]
