from django.db import migrations, models


def _geo_id_null_to_au_496(apps, schema_editor):
    Org = apps.get_model('backend_org', 'Org')
    orgs = Org.objects.filter(geo_id__isnull=True).update(geo_id='au_496')



class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0012_fix_perm_emp_perm'),
    ]

    operations = [
        migrations.RunPython(_geo_id_null_to_au_496),
    ]
