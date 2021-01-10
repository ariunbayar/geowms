from django.db import connections
from django.db import migrations


def create_feature_id_idx(apps, schema_editor):

    cursor = connections['default'].cursor()
    sql = """
        CREATE INDEX
            idx_feature_id
        ON
            m_geo_datas(feature_id);
    """
    cursor.execute(sql)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0010__remove_top_theme_id'),
    ]

    operations = [
        migrations.RunPython(create_feature_id_idx),
    ]
