# Generated by Django 3.0.7 on 2020-11-25 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0009_move_datas'),
    ]

    operations = [
        migrations.AddField(
            model_name='org',
            name='geo_id',
            field=models.CharField(max_length=100, null=True),
        ),
    ]