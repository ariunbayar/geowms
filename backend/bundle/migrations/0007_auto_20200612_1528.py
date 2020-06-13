# Generated by Django 3.0.6 on 2020-06-12 07:28

from django.db import migrations, models

def update_sort_order(apps, schema_editor):

    Bundle = apps.get_model('backend_bundle', 'Bundle')
    counter = 1
    for bundle in Bundle.objects.all():
        bundle.sort_order = counter
        bundle.save()
        counter += 1


class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0006_auto_20200611_1944'),
    ]

    operations = [
        migrations.RunPython(update_sort_order),
    ]
