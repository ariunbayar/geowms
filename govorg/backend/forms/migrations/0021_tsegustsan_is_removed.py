# Generated by Django 3.0.7 on 2021-03-22 01:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0020_auto_20210321_2151'),
    ]

    operations = [
        migrations.AddField(
            model_name='tsegustsan',
            name='is_removed',
            field=models.BooleanField(default=False),
        ),
    ]
