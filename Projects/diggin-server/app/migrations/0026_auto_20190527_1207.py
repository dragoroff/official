# Generated by Django 2.2 on 2019-05-27 12:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0025_account_li_default_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='li_default_avatar',
            field=models.CharField(default='http://gunshot.phanatic.io/static/assets/default/default.jpg', max_length=128),
        ),
    ]
