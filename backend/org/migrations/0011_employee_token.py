# Generated by Django 3.0.7 on 2020-12-03 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0010_org_geo_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='token',
            field=models.CharField(db_index=True, max_length=250, null=True),
        ),
    ]
