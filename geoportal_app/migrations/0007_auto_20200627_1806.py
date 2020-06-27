
from django.db import migrations

def create_role(apps, schema_editor):

    Role = apps.get_model('geoportal_app', 'Role')

    for i in range(5):
        Role.objects.create(id=i+1)


class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0006_auto_20200614_1338'),
    ]

    operations = [
        migrations.RunPython(create_role),
    ]