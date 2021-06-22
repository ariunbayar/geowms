from backend.inspire.models import MGeoDatas, LFeatures, LPackages, LThemes
from backend.geoserver.models import WmtsCacheConfig
from main import geoserver
from main import utils

def _make_view_name(feature):
    feature_code = feature.feature_code
    feature_code = feature_code.split("-")
    view_name = utils.slugifyWord(feature.feature_name_eng) + "_" + feature_code[len(feature_code) - 1] + '_view'
    return view_name


def update_web_cache():
    for cache_config in WmtsCacheConfig.objects.all():
        if cache_config.feature_id:
            feature_id = cache_config.feature_id
            count_of_feature = MGeoDatas.objects.filter(feature_id=feature_id).count()
            if count_of_feature != cache_config.feature_count or cache_config.is_modified:
                l_feature = LFeatures.objects.filter(feature_id=feature_id).first()
                l_package = LPackages.objects.filter(package_id=l_feature.package_id).first()
                l_theme = LThemes.objects.filter(theme_id=l_package.theme_id).first().theme_code
                ws_name = 'gp_' + l_theme
                layer_name = 'gp_layer_' + _make_view_name(l_feature)
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
                if wmts_config.status_code == 200:
                    cache_config.feature_count = count_of_feature
                    cache_config.is_modified = False
                    cache_config.save()
