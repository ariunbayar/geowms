# Generated by Django 3.0.7 on 2021-01-25 07:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0017_remove_bundle_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bundle',
            name='module',
        ),
    ]
