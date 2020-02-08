# Generated by Django 2.2 on 2019-11-27 09:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('app', '0050_campaigncompany_campaignpeople'),
    ]

    operations = [
        # migrations.CreateModel(
        #     name='Job',
        #     fields=[
        #         ('id', models.UUIDField(primary_key=True, serialize=False)),
        #         ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
        #         ('job_type', models.CharField(choices=[('PWD', 'Password Checker'), ('PC', 'Profile Crawler'), ('B', 'Builder'), ('F', 'Filler'), ('S', 'Searcher'), ('CC', 'Campaign Crawler'), ('CM', 'Campaign Messenger')], db_index=True, max_length=32)),
        #         ('status', models.CharField(choices=[('NEW', 'NEW'), ('QUEUED', 'QUEUED'), ('STARTED', 'STARTED'), ('ENDED', 'ENDED')], db_index=True, max_length=32)),
        #         ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
        #         ('account', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='jobs', to='app.Account')),
        #         ('campaign', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='jobs', to='app.Campaign')),
        #         ('plan', models.ForeignKey(null=True, blank=True, related_name="jobs", on_delete=django.db.models.deletion.PROTECT, to="app.Plan", ))
        #     ],
        #     options={
        #         'db_table': 'job',
        #     },
        # ),
        migrations.AddField(
            model_name='job',
            name='content_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='contenttypes.ContentType'),
        ),
        migrations.AddField(
            model_name='job',
            name='object_id',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]