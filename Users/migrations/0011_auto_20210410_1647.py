# Generated by Django 3.2 on 2021-04-10 13:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0010_auto_20210410_1537'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='taxilogistics',
            options={'ordering': ['-id'], 'verbose_name_plural': 'TaxiLogistics'},
        ),
        migrations.AlterModelOptions(
            name='taxilogisticssupervisor',
            options={'ordering': ['-id']},
        ),
        migrations.CreateModel(
            name='BusinessAdvanceRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('amount', models.PositiveIntegerField()),
                ('description', models.TextField()),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.financeaccountcodes')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.projects')),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('supervisor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.supervisors')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
    ]
