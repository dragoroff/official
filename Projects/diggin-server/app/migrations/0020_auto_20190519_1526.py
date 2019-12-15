# Generated by Django 2.2 on 2019-05-19 15:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0019_campaigndata'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='last_job_start',
            field=models.DateTimeField(db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='job_type',
            field=models.CharField(choices=[('PWD', 'Password Changer'), ('PC', 'Profile Crawler'), ('B', 'Builder'), ('F', 'Filler'), ('S', 'Searcher'), ('CCM', 'Campaign Crawler (Master)'), ('CCW', 'Campaign Crawler (Worker)'), ('CM', 'Campaign Messenger')], db_index=True, max_length=32),
        ),
    ]
