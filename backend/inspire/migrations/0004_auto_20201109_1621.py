# Generated by Django 3.0.7 on 2020-11-09 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inspire', '0003_auto_20201106_1627'),
    ]

    operations = [
        migrations.AlterField(
            model_name='empperminspire',
            name='property_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='emproleinspire',
            name='property_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='govperminspire',
            name='property_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='govroleinspire',
            name='property_id',
            field=models.IntegerField(null=True),
        ),
    ]
