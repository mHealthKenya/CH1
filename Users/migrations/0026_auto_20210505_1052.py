# Generated by Django 3.2 on 2021-05-05 07:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0025_businessexpensereport_date_approved'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='businessadvancerequest',
            options={'ordering': ['finance_reviewed', 'approved', '-id']},
        ),
        migrations.AlterModelOptions(
            name='purchaserequisition',
            options={'ordering': ['ceo_approved', 'finance_approved', 'supervisor_approved', '-id'], 'verbose_name_plural': 'Purchase Requisition'},
        ),
        migrations.AlterModelOptions(
            name='taxilogistics',
            options={'ordering': ['supervisor_approved', '-id'], 'verbose_name_plural': 'TaxiLogistics'},
        ),
    ]
