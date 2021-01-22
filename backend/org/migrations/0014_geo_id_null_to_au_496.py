from django.db import migrations
from main import utils


def _geo_id_null_to_au_496(apps, schema_editor):
    Org = apps.get_model('backend_org', 'Org')
    firstOrder_geo_id = utils.get_1stOrder_geo_id()
    Org.objects.filter(geo_id__isnull=True).update(geo_id=firstOrder_geo_id)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0012_fix_perm_emp_perm'),
    ]

    operations = [
        migrations.RunPython(_geo_id_null_to_au_496),
    ]
