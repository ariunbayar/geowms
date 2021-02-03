from django.db import connections
from django.db import migrations


def fix_sequence(apps, schema_editor):

    cursor = connections['default'].cursor()

    table_fields = [
        ('l_code_list_configs', 'code_list_config_id'),
        ('l_code_lists',        'code_list_id'),
        ('l_data_type_configs', 'data_type_config_id'),
        ('l_data_types',        'data_type_id'),
        ('l_feature_configs',   'feature_config_id'),
        ('l_features',          'feature_id'),
        ('l_packages',          'package_id'),
        ('l_properties',        'property_id'),
        ('l_themes',            'theme_id'),
    ]

    for table, field in table_fields:

        print('Fixing sequence for {table}.{field}'.format(
            table=table,
            field=field,
        ))

        sql = """
            SELECT setval(
                pg_get_serial_sequence('{table}', '{field}')::regclass,
                (
                    SELECT max({field}) FROM public.{table}
                )
            )
        """.format(
            table=table,
            field=field,
        )

        cursor.execute(sql)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0011_m_geo_datas_feature_id_idx'),
    ]

    operations = [
            migrations.RunPython(fix_sequence),
    ]
