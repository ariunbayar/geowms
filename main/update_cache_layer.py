from django.db.models import Count

from backend.inspire.models import MGeoDatas, LFeatures, LPackages, LThemes
from backend.geoserver.models import WmtsCacheConfig
from main import geoserver
from main import utils


def update_web_cache():

    feature_ids = list()

    wmts_configs = WmtsCacheConfig.objects.all()
    get_features = (MGeoDatas.objects
        .values('feature_id')
        .annotate(f_count=Count('feature_id'))
    )

    for feature in get_features:
        feature_ids.append(feature['feature_id'])

    for cache_config in wmts_configs:
        if cache_config.feature_id:
            feature_id = cache_config.feature_id
            if feature_id in feature_ids:
                m_datas = list(get_features.filter(feature_id=feature_id))
                m_data = m_datas[0]
                f_count = m_data['f_count']
            if f_count != cache_config.feature_count or cache_config.is_modified:
                l_feature = LFeatures.objects.filter(feature_id=feature_id).first()
                l_package = LPackages.objects.filter(package_id=l_feature.package_id).first()
                l_theme = LThemes.objects.filter(theme_id=l_package.theme_id).first().theme_code
                view_name = utils.make_view_name(l_feature)

                ws_name = 'gp_' + l_theme
                layer_name = 'gp_layer_' + view_name
                srs = '4326'
                wmts_config = geoserver.create_tilelayers_cache(
                    ws_name,
                    layer_name,
                    srs,
                    cache_config.img_format,
                    cache_config.zoom_start,
                    cache_config.zoom_stop,
                    'reseed',
                    cache_config.number_of_tasks_to_use
                )

                has_view_name = utils.check_view_name(view_name)

                if has_view_name:
                    utils.refreshMaterializedView(feature_id)

                if wmts_config.status_code == 200:
                    cache_config.feature_count = f_count
                    cache_config.is_modified = False
                    cache_config.save()
