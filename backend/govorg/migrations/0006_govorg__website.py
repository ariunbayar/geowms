# Generated by Django 3.0.7 on 2020-11-27 03:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_govorg', '0005_govorg_org'),
    ]

    operations = [
        migrations.AddField(
            model_name='govorg',
            name='website',
            field=models.CharField(max_length=250, null=True),
        ),
    ]
