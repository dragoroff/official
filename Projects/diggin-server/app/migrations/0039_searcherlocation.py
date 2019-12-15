# Generated by Django 2.2 on 2019-06-20 17:13

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0038_plan_events'),
    ]

    operations = [
        migrations.CreateModel(
            name='SearcherLocation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('location', models.CharField(max_length=256, unique=True)),
                ('first_names', django.contrib.postgres.fields.jsonb.JSONField(default=list)),
                ('groups', django.contrib.postgres.fields.jsonb.JSONField(default=list)),
                ('iter_num', models.IntegerField(default=5)),
            ],
            options={
                'db_table': 'searcher_location',
            },
        ),
    ]
