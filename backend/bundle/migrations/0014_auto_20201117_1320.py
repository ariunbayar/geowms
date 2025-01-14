# Generated by Django 3.0.7 on 2020-11-17 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_wmslayer', '0009_auto_20201102_1657'),
        ('backend_bundle', '0013_remove_bundle_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bundle',
            name='layers',
            field=models.ManyToManyField(blank=True, through='backend_bundle.BundleLayer', to='backend_wmslayer.WMSLayer'),
        ),
    ]
