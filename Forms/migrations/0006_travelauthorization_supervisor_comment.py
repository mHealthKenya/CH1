# Generated by Django 3.2 on 2021-04-14 06:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Forms', '0005_auto_20210414_0919'),
    ]

    operations = [
        migrations.AddField(
            model_name='travelauthorization',
            name='supervisor_comment',
            field=models.TextField(blank=True, null=True),
        ),
    ]
