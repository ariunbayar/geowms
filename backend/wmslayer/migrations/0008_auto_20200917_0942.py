# Generated by Django 3.0.7 on 2020-09-17 01:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_wmslayer', '0007_auto_20200914_1230'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wmslayer',
            name='legend_url',
            field=models.ImageField(max_length=400, upload_to='legentUrlImage/'),
        ),
    ]
