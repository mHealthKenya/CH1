# Generated by Django 3.2 on 2021-04-12 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0019_alter_businessexpensereport_finance_staff'),
    ]

    operations = [
        migrations.AlterField(
            model_name='businessexpensereport',
            name='receipt',
            field=models.ImageField(blank=True, null=True, upload_to='receipts'),
        ),
    ]
