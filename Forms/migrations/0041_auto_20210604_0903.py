# Generated by Django 3.2 on 2021-06-04 06:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Forms', '0040_nonprojecttimesheet'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='monthlytimesheet',
            options={'ordering': ['-id']},
        ),
        migrations.AlterModelOptions(
            name='nonprojecttimesheet',
            options={'ordering': ['-id']},
        ),
        migrations.AlterModelOptions(
            name='offdutytimesheet',
            options={'ordering': ['-id']},
        ),
    ]
