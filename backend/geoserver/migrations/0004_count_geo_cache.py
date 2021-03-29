from django.db import migrations, models
from django.core import serializers
from django.db import connections


def update_bundles(apps, schema_editor):
    cache_configs = apps.get_model('backend_geoserver', 'WmtsCacheConfig')
    m_geo_datas = apps.get_model('backend_inspire', 'MGeoDatas')

    for cache_config in cache_configs.objects.all():
        if cache_config.feature_id:
            count_of_feature = m_geo_datas.objects.filter(feature_id=cache_config.feature_id).count()
            cache_config.feature_count = count_of_feature
            cache_config.save()


class Migration(migrations.Migration):

    dependencies = [
        ('backend_geoserver', '0003_wmtscacheconfig_feature_count'),
        ('backend_inspire', '0012_auto_20210121_1219'),
    ]

    operations = [
        migrations.RunPython(update_bundles),
    ]
