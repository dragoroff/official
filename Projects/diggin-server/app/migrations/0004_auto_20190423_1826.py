# Generated by Django 2.2 on 2019-04-23 18:26

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20190422_1643'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfileInfo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
            ],
            options={
                'db_table': 'profile_info',
            },
        ),
        migrations.AlterModelOptions(
            name='account',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='accountevent',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='job',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='jobevent',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterField(
            model_name='gmail',
            name='status',
            field=models.CharField(choices=[('NEW', 'NEW'), ('PASSCHANGED', 'PASSCHANGED'), ('INUSE', 'INUSE'), ('BLOCKED', 'BLOCKED'), ('DEAD', 'DEAD')], max_length=32),
        ),
    ]
