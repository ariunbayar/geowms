# Generated by Django 3.0.7 on 2021-06-25 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('llc_request', '0014_auto_20210624_1538'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='llcrequest',
            name='description',
        ),
        migrations.AddField(
            model_name='requestfilesshape',
            name='description',
            field=models.TextField(default='', null=True),
        ),
    ]