# Generated by Django 2.2 on 2019-11-25 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0047_campaign_company_options'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='campaign',
            name='company_options',
        ),
        migrations.AddField(
            model_name='campaign',
            name='white_list',
            field=models.CharField(max_length=1028, null=True),
        ),
    ]