# Generated by Django 3.0.7 on 2020-11-17 10:21

from django.db import migrations, models


def moveData(apps, schema_editor):

    InspirePerm = apps.get_model('backend_org', 'InspirePerm')
    GovPermInspire = apps.get_model('backend_inspire', 'GovPermInspire')
    GovPerm = apps.get_model('backend_inspire', 'GovPerm')
    objs = []
    for i in InspirePerm.objects.all().distinct('org'):
        gov_perm = GovPerm.objects.filter(org=i.org).first()
        if not gov_perm:
            gov_perm = GovPerm.objects.create(org=i.org)
        for insPerm in InspirePerm.objects.filter(org=i.org):
            if insPerm.module == 4:
                if insPerm.perm_view:
                    objs.append(GovPermInspire(
                        gov_perm=gov_perm,
                        perm_kind=1,
                        feature_id=insPerm.module_root_id,
                        property_id=insPerm.module_id,
                        geom=False
                    ))
                if insPerm.perm_create:
                    objs.append(GovPermInspire(
                        gov_perm=gov_perm,
                        perm_kind=2,
                        feature_id=insPerm.module_root_id,
                        property_id=insPerm.module_id,
                        geom=False
                    ))
                if insPerm.perm_remove:
                    objs.append(GovPermInspire(
                        gov_perm=gov_perm,
                        perm_kind=3,
                        feature_id=insPerm.module_root_id,
                        property_id=insPerm.module_id,
                        geom=False
                    ))
                if insPerm.perm_update:
                    objs.append(GovPermInspire(
                        gov_perm=gov_perm,
                        perm_kind=4,
                        feature_id=insPerm.module_root_id,
                        property_id=insPerm.module_id,
                        geom=False
                    ))
                if insPerm.perm_revoke:
                    objs.append(GovPermInspire(
                        gov_perm=gov_perm,
                        perm_kind=5,
                        feature_id=insPerm.module_root_id,
                        property_id=insPerm.module_id,
                        geom=False
                    ))
                if insPerm.perm_approve:
                    objs.append(GovPermInspire(
                        gov_perm=gov_perm,
                        perm_kind=6,
                        feature_id=insPerm.module_root_id,
                        property_id=insPerm.module_id,
                        geom=False
                    ))
    GovPermInspire.objects.bulk_create(objs)
    

class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0008_employee_is_admin'),
        ('backend_inspire', '0005_auto_20201117_1056')
    ]

    operations = [
        migrations.RunPython(moveData),
    ]