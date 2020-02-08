# Generated by Django 2.2 on 2019-06-06 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0035_auto_20190606_1226'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='status',
            field=models.CharField(choices=[('NEW', 'NEW'), ('QUEUED', 'QUEUED'), ('STARTED', 'STARTED'), ('ENDED', 'ENDED')], db_index=True, default='NEW', max_length=32),
        ),
    ]