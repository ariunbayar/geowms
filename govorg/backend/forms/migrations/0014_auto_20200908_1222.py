# Generated by Django 3.0.7 on 2020-09-08 04:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0013_tsegustsanlog'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tsegpersonal',
            name='utmx',
        ),
        migrations.RemoveField(
            model_name='tsegpersonal',
            name='utmy',
        ),
    ]
