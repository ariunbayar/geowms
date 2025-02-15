from django.db.models import Count

from backend.inspire.models import LFeatures, LPackages, LThemes
from backend.geoserver.models import WmtsCacheConfig
from main import geoserver
from main import utils


def update_web_cache():

    wmts_configs = WmtsCacheConfig.objects.all()

    for cache_config in wmts_configs:
        feature_id = cache_config.feature_id
        if feature_id:
            if cache_config.is_modified:
                l_feature = LFeatures.objects.filter(feature_id=feature_id).first()
                l_package = LPackages.objects.filter(package_id=l_feature.package_id).first()
                l_theme = LThemes.objects.filter(theme_id=l_package.theme_id).first()
                if l_theme:
                    l_theme = l_theme.theme_code

                view_name = utils.make_view_name(l_feature)
                has_view_name = utils.check_view_name(view_name)

                if has_view_name and cache_config.zoom_stop and cache_config.type_of_operation:
                    ws_name = 'gp_' + l_theme
                    layer_name = 'gp_layer_' + view_name
                    srs = '4326'
                    geoserver.create_tilelayers_cache(
                        ws_name,
                        layer_name,
                        srs,
                        cache_config.img_format,
                        cache_config.zoom_start,
                        cache_config.zoom_stop,
                        'reseed',
                        cache_config.number_of_tasks_to_use
                    )

                    utils.refreshMaterializedView(feature_id)
                    cache_config.is_modified = False
                    cache_config.save()
