# Generated by Django 3.0.6 on 2020-07-05 11:32

from django.db import migrations


def update_sort_order(apps, schema_editor):

    WMSLayer = apps.get_model('backend_wmslayer', 'WMSLayer')
    WMS = apps.get_model('backend_wms', 'WMS')

    for wms in WMS.objects.all():
        sort_order = 1
        for layer in wms.wmslayer_set.order_by('pk'):
            layer.sort_order = sort_order
            layer.save()
            sort_order += 1


class Migration(migrations.Migration):

    dependencies = [
        ('backend_wmslayer', '0002_auto_20200630_1535'),
    ]

    operations = [
        migrations.RunPython(update_sort_order),
    ]
