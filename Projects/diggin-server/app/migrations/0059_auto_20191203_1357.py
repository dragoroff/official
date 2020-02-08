# Generated by Django 2.2 on 2019-12-03 13:57

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0058_auto_20191128_1532'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaigncompanydata',
            name='events',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='campaignpeopledata',
            name='events',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
        migrations.CreateModel(
            name='CampaignPeopleDataEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='campaign_events', to='app.CampaignPeopleData')),
            ],
            options={
                'db_table': 'campaign_people_data_event',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CampaignCompanyDataEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='campaign_events', to='app.CampaignCompanyData')),
            ],
            options={
                'db_table': 'campaign_company_data_event',
                'ordering': ['-created_at'],
            },
        ),
    ]