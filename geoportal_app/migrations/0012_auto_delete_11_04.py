from django.db import migrations, models
from django.contrib.auth.hashers import make_password

def delete_role(apps, schema_editor):

    Role = apps.get_model('geoportal_app', 'Role')
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
