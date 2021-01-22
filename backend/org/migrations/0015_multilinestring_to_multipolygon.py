from django.db import migrations
from main import utils

def _multilinestring_to_multipolygon(apps, schema_editor):
    Org = apps.get_model('backend_org', 'Org')
    MGeoDatas = apps.get_model('backend_inspire', 'MGeoDatas')
    firstOrder_geo_id = utils.get_1stOrder_geo_id()

    org_geo_ids = Org.objects.all().values_list('geo_id', flat=True)
    geo_datas = MGeoDatas.objects.filter(geo_id__in=org_geo_ids)

    geo_ids = []
    for geo_data in geo_datas:
        geom_type = geo_data.geo_data.geom_type
        if geom_type not in ['MultiPolygon', 'Polygon']:
            geo_ids.append(geo_data.geo_id)

    Org.objects.filter(geo_id__in=geo_ids).update(geo_id=firstOrder_geo_id)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0014_geo_id_null_to_au_496'),
    ]

    operations = [
        migrations.RunPython(_multilinestring_to_multipolygon),
    ]
