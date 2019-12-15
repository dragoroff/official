# Generated by Django 2.2.3 on 2019-07-08 06:46

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('entityID', models.CharField(max_length=64)),
                ('event_type', models.CharField(max_length=256)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
            ],
            options={
                'db_table': 'events',
            },
        ),
    ]