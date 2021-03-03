# Generated by Django 3.0.7 on 2021-02-24 03:38

from django.db import migrations


def _clear_erguuls(erguuls, Model):
    for erguul in erguuls:
        if not erguul.is_over:
            erguul_qs = Model.objects
            erguul_qs = erguul_qs.filter(is_over=False)
            erguul_qs = erguul_qs.filter(address=erguul.address)
            if len(erguul_qs) > 1:
                erguul.delete()


def _set_is_over(apps, schema_editor):
    EmployeeErguul = apps.get_model('backend_org', 'EmployeeErguul')
    ErguulTailbar = apps.get_model('backend_org', 'ErguulTailbar')
    erguuls = EmployeeErguul.objects.all()
    for erguul in erguuls:
        tailbar = ErguulTailbar.objects
        tailbar = tailbar.filter(erguul=erguul)
        if tailbar:
            erguul.is_over = True
            erguul.save()

    _clear_erguuls(erguuls, EmployeeErguul)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0020_auto_20210224_1137'),
    ]

    operations = [
        migrations.RunPython(_set_is_over),
    ]