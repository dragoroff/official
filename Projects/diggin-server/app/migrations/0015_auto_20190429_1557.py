# Generated by Django 2.2 on 2019-04-29 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_auto_20190429_1552'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='job_type',
            field=models.CharField(choices=[('PWD', 'Password Checker'), ('PC', 'Profile Crawler'), ('B', 'Builder'), ('F', 'Filler'), ('S', 'Searcher'), ('CC', 'Campaign Crawler'), ('CM', 'Campaign Messenger')], db_index=True, max_length=32),
        ),
    ]
