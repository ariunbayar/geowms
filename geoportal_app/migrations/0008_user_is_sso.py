# Generated by Django 3.0.6 on 2020-07-08 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0007_auto_20200627_1806'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_sso',
            field=models.BooleanField(default=False),
        ),
    ]
