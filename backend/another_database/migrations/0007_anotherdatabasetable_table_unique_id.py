# Generated by Django 3.0.7 on 2021-07-01 06:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_another_database', '0006_update_field_config'),
    ]

    operations = [
        migrations.AddField(
            model_name='anotherdatabasetable',
            name='table_unique_id',
            field=models.IntegerField(default=False),
        ),
    ]
