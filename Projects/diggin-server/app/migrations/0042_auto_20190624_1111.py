# Generated by Django 2.2 on 2019-06-24 11:11

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0041_auto_20190624_1035'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='searcherlocation',
            name='groups',
        ),
        migrations.RemoveField(
            model_name='searcherlocation',
            name='iter_num',
        ),
        migrations.AddField(
            model_name='plan',
            name='groups',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='plan',
            name='iter_num',
            field=models.IntegerField(default=5),
        ),
    ]
