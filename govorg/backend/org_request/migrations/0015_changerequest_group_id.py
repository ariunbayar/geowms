# Generated by Django 3.0.7 on 2021-01-21 03:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0014_g_changereq_update_geom_and_form'),
    ]

    operations = [
        migrations.AddField(
            model_name='changerequest',
            name='group_id',
            field=models.TextField(max_length=100, null=True),
        ),
    ]
