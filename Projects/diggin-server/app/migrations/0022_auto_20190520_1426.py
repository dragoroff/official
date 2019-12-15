# Generated by Django 2.2 on 2019-05-20 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0021_campaign_campaign_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='campaign',
            name='campaign_id',
        ),
        migrations.RemoveField(
            model_name='campaign',
            name='limit',
        ),
        migrations.RemoveField(
            model_name='campaign',
            name='target_page',
        ),
        migrations.RemoveField(
            model_name='campaign',
            name='targets',
        ),
        migrations.AddField(
            model_name='campaign',
            name='get_companies',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='campaign',
            name='get_groups',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='campaign',
            name='get_people',
            field=models.BooleanField(default=False),
        ),
    ]
