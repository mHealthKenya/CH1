# Generated by Django 3.2 on 2021-04-10 15:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0012_auto_20210410_1820'),
    ]

    operations = [
        migrations.AlterField(
            model_name='businessadvancerequest',
            name='finance_staff',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Users.financestaff'),
        ),
    ]
