# Generated by Django 3.0.7 on 2021-03-19 02:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend_covid', '0002_auto_20210318_1813'),
    ]

    operations = [
        migrations.RenameField(
            model_name='coviddashboardlog',
            old_name='created_at',
            new_name='updated_at',
        ),
        migrations.RenameField(
            model_name='coviddashboardlog',
            old_name='user',
            new_name='updated_by',
        ),
    ]