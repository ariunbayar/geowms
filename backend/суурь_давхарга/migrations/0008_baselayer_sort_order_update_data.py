# Generated by Django 3.0.7 on 2020-06-29 16:42

from django.db import migrations, models

from backend.суурь_давхарга.models import BaseLayer


def baselayer_update(apps, schema_editor):

    BaseLayer.objects.filter(pk=2).update(sort_order=2)
    BaseLayer.objects.filter(pk=3).update(sort_order=3)
    BaseLayer.objects.filter(pk=4).update(sort_order=4)
    

class Migration(migrations.Migration):

    dependencies = [
        ('backend_суурь_давхарга', '0008_baselayer_sort_order'),
    ]

    operations = [
        migrations.RunPython(baselayer_update),
    ]