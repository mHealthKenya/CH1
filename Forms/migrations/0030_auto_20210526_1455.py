# Generated by Django 3.2 on 2021-05-26 11:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Forms', '0029_auto_20210526_1206'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='leaveapplication',
            options={'ordering': ['-approved', '-id']},
        ),
        migrations.AlterModelOptions(
            name='leaveapplicationsupervisor',
            options={'ordering': ['approved', '-id']},
        ),
        migrations.AlterField(
            model_name='leaveapplicationsupervisor',
            name='application',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Forms.leaveapplication'),
        ),
        migrations.CreateModel(
            name='LeaveApplicationCOO',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approved', models.BooleanField(default=False)),
                ('comments', models.TextField(blank=True, null=True)),
                ('application', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Forms.leaveapplicationsupervisor')),
            ],
        ),
    ]
