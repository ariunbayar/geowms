# Generated by Django 3.0.6 on 2020-07-08 10:33

from django.db import migrations, models
from django.core import serializers

def create_users(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0008_user_is_sso'),
    ]

    operations = [
        migrations.RunPython(create_users),
    ]
