# Generated by Django 2.2 on 2019-06-04 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0028_auto_20190604_1517'),
    ]

    operations = [
        migrations.AddField(
            model_name='profileinfocombination',
            name='zip_code',
            field=models.CharField(blank=True, max_length=10),
        ),
    ]
