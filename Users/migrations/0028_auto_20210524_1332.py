# Generated by Django 3.2 on 2021-05-24 10:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0027_auto_20210524_1143'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='department',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='Users.departments'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='signature',
            field=models.ImageField(blank=True, null=True, upload_to='signatures'),
        ),
    ]
