# Generated by Django 3.0.7 on 2020-12-08 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_govorg', '0007_auto_20201207_1924'),
    ]

    operations = [
        migrations.AlterField(
            model_name='govorg',
            name='deleted_at',
            field=models.DateTimeField(null=True),
        ),
    ]
