from django.db import migrations, models
from django.contrib.auth.hashers import make_password

def delete_role(apps, schema_editor):
    BundleLayer = apps.get_model('backend_bundle', 'BundleLayer')
    Role = apps.get_model('geoportal_app', 'Role')

    bundleLayer = BundleLayer.objects.filter(role_id__in=[3,4])
    if bundleLayer:
        bundleLayer.delete()
    roles = Role.objects.filter(id__in=[3,4])
    if roles:
        roles.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0012_auto_20201104_1002'),
    ]

    operations = [
        migrations.RunPython(delete_role),
    ]
