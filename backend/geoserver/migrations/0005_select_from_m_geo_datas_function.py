from django.db import migrations, models
from django.core import serializers
from django.db import connections


def create_design_function(apps, schema_editor):
    cursor = connections['default'].cursor()
    sql = '''
        CREATE OR REPLACE FUNCTION get_datas_of_m_geo_datas(n_feature_id int)
        RETURNS setof geometry
        AS $$
        SELECT geo_data  FROM m_geo_datas where feature_id=n_feature_id limit 1000;
        $$ LANGUAGE sql;
    '''
    cursor.execute(sql)

class Migration(migrations.Migration):

    dependencies = [
        ('backend_geoserver', '0004_count_geo_cache'),
    ]

    operations = [
        migrations.RunPython(create_design_function),
    ]
