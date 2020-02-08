# Generated by Django 2.2 on 2019-05-06 13:20

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_auto_20190429_1557'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='account',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='acc', to='app.Account'),
        ),
        migrations.AddField(
            model_name='campaign',
            name='campaign_id',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
        migrations.AddField(
            model_name='campaign',
            name='keyword',
            field=models.CharField(default=str, max_length=128),
        ),
        migrations.AddField(
            model_name='campaign',
            name='limit',
            field=models.IntegerField(default=5),
        ),
        migrations.AddField(
            model_name='campaign',
            name='status',
            field=models.CharField(choices=[('MANAGER_READY', 'Manager Ready'), ('MANAGER_IN_PROGRESS', 'Manager In Progress'), ('MANAGER_DONE', 'Manager Done'), ('WORKER_READY', 'Worker Ready'), ('WORKER_IN_PROGRESS', 'Worker In Progress'), ('WORKER_DONE', 'Worker Done')], default='MANAGER_READY', max_length=64),
        ),
        migrations.AddField(
            model_name='campaign',
            name='target_page',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='campaign',
            name='targets',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='job',
            name='job_type',
            field=models.CharField(choices=[('PWD', 'Password Changer'), ('PC', 'Profile Crawler'), ('B', 'Builder'), ('F', 'Filler'), ('S', 'Searcher'), ('CC', 'Campaign Crawler'), ('CM', 'Campaign Messenger')], db_index=True, max_length=32),
        ),
    ]