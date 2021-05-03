# Generated by Django 3.0.7 on 2021-05-03 04:17

from django.db import migrations


def set_link(apps, schema_editor):
    print('\nУншиж байна ...')
    WMS = apps.get_model('backend_wms', 'WMS')
    qs = WMS.objects.all()
    for wms in qs:
        if 'http://192.168.10.15:8080/geoserver/' in wms.url:
            url = wms.url
            splited_url = url.split('http://192.168.10.15:8080/geoserver')
            if 1 < len(splited_url):
               use_url = 'http://192.168.10.15:8080' + splited_url[1]
               wms.url = use_url
               wms.save()


class Migration(migrations.Migration):

    dependencies = [
        ('backend_wms', '0007_make_id_index'),
    ]

    operations = [
        migrations.RunPython(set_link),
    ]