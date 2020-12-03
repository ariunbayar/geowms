# Generated by Django 3.0.7 on 2020-11-17 10:21

from django.db import migrations, models


def perm_create(apps, schema_editor):
    GovPerm = apps.get_model('backend_inspire', 'GovPerm')
    Org = apps.get_model('backend_org', 'Org')
    for org in Org.objects.all():
        if not GovPerm.objects.filter(org=org):
            gov_perm = GovPerm.objects.create(org=org)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0010_org_geo_id'),
    ]

    operations = [
        migrations.RunPython(perm_create),
    ]
