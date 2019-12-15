# Generated by Django 2.2 on 2019-11-27 12:06

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0053_auto_20191127_1049'),
    ]

    operations = [
        migrations.CreateModel(
            name='CampaignPeopleEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='campaign', to='app.CampaignPeople')),
            ],
            options={
                'db_table': 'campaign_people_event',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CampaignPeopleData',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='campaigns', to='app.CampaignPeople')),
            ],
            options={
                'db_table': 'campaign_people_data',
            },
        ),
        migrations.CreateModel(
            name='CampaignCompanyEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='campaign', to='app.CampaignCompany')),
            ],
            options={
                'db_table': 'campaign_company_event',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CampaignCompanyData',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='campaigns', to='app.CampaignCompany')),
            ],
            options={
                'db_table': 'campaign_company_data',
            },
        ),
    ]
