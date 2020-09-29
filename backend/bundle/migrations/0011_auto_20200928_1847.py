# Generated by Django 3.0.7 on 2020-09-28 10:47

from django.db import migrations

def bundle_module(apps, schema_editor):

    Bundle = apps.get_model('backend_bundle', 'Bundle')

    bundle_values = [
        ('Түүх, соёлын өв', 1),
        ('Геодезийн тулгуур сүлжээ', 2),
        ('Тээврийн сүлжээ', 3),
        ('Дэд бүтэц', 4),
        ('Байр зүйн зураг', 5),
        ('Барилга, суурин газар', 6),
      ]

    for name, bundle_module in bundle_values:

        bundle = Bundle.objects.filter(name__iexact=name).first()

        bundle.module = bundle_module
        bundle.save()

class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0010_auto_20200928_1846'),
    ]

    operations = [
        migrations.RunPython(bundle_module)
    ]