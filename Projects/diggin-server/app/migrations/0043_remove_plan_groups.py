# Generated by Django 2.2 on 2019-06-25 15:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0042_auto_20190624_1111'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='plan',
            name='groups',
        ),
    ]
