# Generated by Django 3.0.7 on 2020-11-19 06:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0006_auto_20201116_0208'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='changerequest',
            name='created_on',
        ),
    ]
