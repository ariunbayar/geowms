# Generated by Django 3.0.7 on 2020-11-15 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0005_auto_20201030_1847'),
    ]

    operations = [
        migrations.AddField(
            model_name='changerequest',
            name='order_at',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='changerequest',
            name='order_no',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
