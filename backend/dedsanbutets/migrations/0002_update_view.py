from django.db import migrations
from django.db import connections


def _create_view(LProperties, ids, table_name, data_type_ids, feature_config_id):

    data = LProperties.objects.filter(property_id__in=ids)
    _remove_view(table_name)
    fields = [row.property_code for row in data]
    try:
        query = '''
            CREATE MATERIALIZED VIEW public.{table_name}
                AS
            SELECT d.geo_id, d.geo_data, d.geo_id as inspire_id, {columns}, d.feature_id, d.created_on, d.created_by, d.modified_on, d.modified_by
            FROM crosstab('select b.geo_id, b.property_id, b.value_text from public.m_datas b where property_id in ({properties}) and data_type_id in ({data_type_ids}) and feature_config_id in ({feature_config_id}) order by 1,2'::text)
            ct(geo_id character varying(100), {create_columns})
            JOIN m_geo_datas d ON ct.geo_id::text = d.geo_id::text
        '''.format(
                table_name = table_name,
                columns=', '.join(['ct.{}'.format(f) for f in fields]),
                properties=', '.join(['{}'.format(f) for f in ids]),
                data_type_ids=', '.join(['{}'.format(f) for f in data_type_ids]),
                feature_config_id=', '.join(['{}'.format(f) for f in feature_config_id]),
                create_columns=', '.join(['{} character varying(100)'.format(f) for f in fields]))
        query_index = ''' CREATE UNIQUE INDEX {table_name}_index ON {table_name}(geo_id) '''.format(table_name=table_name)

        with connections['default'].cursor() as cursor:
                cursor.execute(query)
                cursor.execute(query_index)
        return True
    except Exception:
        return False


def _remove_view(table_name):
    try:
        query = '''
            DROP MATERIALIZED VIEW IF EXISTS {table_name};
        '''.format(table_name = table_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(query)
        return True
    except Exception:
        return False


def _update_view(apps, schema_editor):
    ViewNames = apps.get_model('dedsanbutets', 'ViewNames')
    ViewProperties = apps.get_model('dedsanbutets', 'ViewProperties')
    LFeatureConfigs = apps.get_model('backend_inspire', 'LFeatureConfigs')
    LProperties = apps.get_model('backend_inspire', 'LProperties')

    view_names = ViewNames.objects.all()

    for view_name in view_names:
        property_ids = [i['property_id'] for i in ViewProperties.objects.filter(view=view_name).values("property_id")]
        data_type_ids = [i['data_type_id'] for i in LFeatureConfigs.objects.filter(feature_id=view_name.feature_id).values("data_type_id") if i['data_type_id']]
        feature_config_id = [i['feature_config_id'] for i in LFeatureConfigs.objects.filter(feature_id=view_name.feature_id).values("feature_config_id") if i['feature_config_id']]
        print('{} ийг засварлаж байна'.format(view_name.view_name))
        _create_view(LProperties, property_ids, view_name.view_name, data_type_ids, feature_config_id)


class Migration(migrations.Migration):

    dependencies = [
        ('dedsanbutets', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(_update_view),
    ]
