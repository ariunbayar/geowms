# Generated by Django 3.0.7 on 2020-11-27 03:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0007_remove_govperm_geo_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='empperminspire',
            name='data_type_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='emproleinspire',
            name='data_type_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='govperminspire',
            name='data_type_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='govroleinspire',
            name='data_type_id',
            field=models.IntegerField(null=True),
        ),
    ]
