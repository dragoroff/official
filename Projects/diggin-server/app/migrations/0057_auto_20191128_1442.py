# Generated by Django 2.2 on 2019-11-28 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0056_auto_20191128_1247'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaigncompany',
            name='positions_white_list',
            field=models.CharField(blank=True, help_text="Won't work w/o get_people True", max_length=1068, null=True),
        ),
        migrations.AlterField(
            model_name='campaignpeople',
            name='positions_white_list',
            field=models.CharField(blank=True, max_length=1068, null=True),
        ),
    ]
