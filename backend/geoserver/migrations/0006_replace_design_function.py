from django.db import migrations, models
from django.core import serializers
from django.db import connections


def create_design_function(apps, schema_editor):
    cursor = connections['default'].cursor()
    sql = '''
        DROP MATERIALIZED VIEW if exists geoserver_desing_view
    '''
    sql1 = '''
        CREATE MATERIALIZED VIEW IF not EXISTS  geoserver_desing_view  as
        SELECT
            ST_GeometryType(get_datas_of_m_geo_datas(feature_id)) as field_type,
            get_datas_of_m_geo_datas(feature_id)  as geo_data, feature_id
        FROM
            m_geo_datas
        group by feature_id
    '''
    cursor.execute(sql)
    cursor.execute(sql1)

class Migration(migrations.Migration):

    dependencies = [
        ('backend_geoserver', '0005_select_from_m_geo_datas_function'),
    ]

    operations = [
        migrations.RunPython(create_design_function),
    ]
