# Generated by Django 3.0.7 on 2020-12-01 07:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0010_auto_20200915_0048'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paymentpolygon',
            name='amount',
        ),
        migrations.AddField(
            model_name='paymentlayer',
            name='amount',
            field=models.PositiveIntegerField(null=True),
        ),
    ]
