# import pyodbc
from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from backend.inspire.models import LFeatures
from backend.inspire.models import LProperties
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import MDatas
from backend.inspire.models import MGeoDatas
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LDataTypeConfigs
from main import utils
from main.inspire import GEoIdGenerator
from backend.dedsanbutets.models import FeatureOverlaps
from main.decorators import api_inspire_perm
from rest_framework.decorators import api_view


def property_of_feature(feature_id):

    l_feature_configs = LFeatureConfigs.objects.filter(feature_id=feature_id).exclude(data_type_id__isnull=True).values('feature_config_id', 'data_type_id')
    property_displays = list()
    for l_feature_config in l_feature_configs:
        l_data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=l_feature_config['data_type_id']).values_list('property_id', flat=True)
        l_data_type_configs = [i for i in l_data_type_configs]
        property_displays.append({
            'property_ids': l_data_type_configs,
            'feature_config_id': l_feature_config['feature_config_id'],
            'data_type_id': l_feature_config['data_type_id']
        })
    return property_displays


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_CREATE)
def create(request, payload):
    datas = payload.get('datas') or None
    feature_id = payload.get('feature_id') or None

    feature_obj = LFeatures.objects.filter(feature_id=feature_id).first()
    property_displays = property_of_feature(feature_id)
    m_datas_objs = list()
    info = []
    for data in datas:
        geojson = data['geojson']
        overlap_feature_id = FeatureOverlaps.objects.filter(feature_id=feature_id).values_list('overlap_feature_id', flat=True)
        overlap_feature_id = [i for i in overlap_feature_id]
        overlap_feature_id.append(feature_id)
        is_contains = utils._geom_contains_feature_geoms(geojson, overlap_feature_id)
        if is_contains:
            info = '''{feature_ids} дугааруудтай geom-той давхцаж байна.'''.format(feature_ids=', '.join(['{}'.format(f['geo_id']) for f in is_contains]))
            return JsonResponse({"success": False, "info": info})
        else:
            new_geo_id = GEoIdGenerator(feature_obj.feature_id, feature_obj.feature_code).get()
            geojson = utils.geojson_to_geom(geojson)
            MGeoDatas.objects.create(
                geo_id=new_geo_id,
                geo_data=geojson,
                feature_id=feature_id
            )
            for propertie in data['properties']:
                for property_display in property_displays:
                    if propertie['property_id'] in property_display['property_ids']:
                        m_datas_objs.append(MDatas(
                            geo_id=new_geo_id,
                            feature_config_id=property_display['feature_config_id'],
                            data_type_id=property_display['data_type_id'],
                            property_id=propertie['property_id'],
                            code_list_id=propertie['code_list_id'],
                            value_text=propertie['value_text'],
                            value_number=propertie['value_number'],
                            value_date=propertie['value_date'],
                            value_connected_geo_id=propertie['value_connected_geo_id']
                        ))
            MDatas.objects.bulk_create(m_datas_objs)

    return JsonResponse({'success': True, 'msg': "Амжилттай үүсгэлээ"})


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_UPDATE)
def update(request, payload):
    datas = payload.get('datas') or None
    feature_id = payload.get('feature_id') or None

    property_displays = property_of_feature(feature_id)
    info = []
    for data in datas:
        geojson = data['geojson']
        old_geo_id = data['geo_id']
        properties = data['properties']
        overlap_feature_id = FeatureOverlaps.objects.filter(feature_id=feature_id).values_list('overlap_feature_id', flat=True)
        overlap_feature_id = [i for i in overlap_feature_id]
        overlap_feature_id.append(feature_id)
        is_contains = utils._geom_contains_feature_geoms(geojson, overlap_feature_id)
        is_contains_update_id_busad = list()
        for is_contain in is_contains:
            if is_contain['geo_id'] != old_geo_id:
                is_contains_update_id_busad.append(is_contain)
        if is_contains_update_id_busad:
            info = '''{feature_ids} дугааруудтай geom-той давхцаж байна.'''.format(feature_ids=', '.join(['{}'.format(f['geo_id']) for f in is_contains_update_id_busad]))
            return JsonResponse({"success": False, "info": info})
        else:
            geojson = utils.geojson_to_geom(geojson)
            MGeoDatas.objects.filter(geo_id=old_geo_id, feature_id=feature_id).update(
                geo_data=geojson,
                feature_id=feature_id
            )
            for propertie in properties:
                for property_display in property_displays:
                    if propertie['property_id'] in property_display['property_ids']:
                        MDatas.objects.filter(
                                geo_id=old_geo_id,
                                feature_config_id=property_display['feature_config_id'],
                                data_type_id=property_display['data_type_id'],
                                property_id=propertie['property_id'],
                            ).update(
                                feature_config_id=property_display['feature_config_id'],
                                data_type_id=property_display['data_type_id'],
                                property_id=propertie['property_id'],
                                code_list_id=propertie['code_list_id'],
                                value_text=propertie['value_text'],
                                value_number=propertie['value_number'],
                                value_date=propertie['value_date'],
                                value_connected_geo_id=propertie['value_connected_geo_id']
                        )

    return JsonResponse({'success': True, 'info': "Амжилттай заслаа."})


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_REMOVE)
def remove(request, payload):
    feature_id = payload.get('feature_id')
    geo_id = payload.get('geo_id') or ''
    m_geo_datas = MGeoDatas.objects.filter(geo_id=geo_id, feature_id=feature_id)
    m_datas = MDatas.objects.filter(geo_id=geo_id)
    m_geo_datas.delete()
    m_datas.delete()

    rsp = {
        'success': True,
        'info': geo_id + " тай geom болон attribute ийг амжилттай устаглаа"
    }

    return JsonResponse(rsp)


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_VIEW)
def select(request, payload):
    feature_id = payload.get('feature_id') or None
    limit = payload.get('limit') or None
    search_geo_ids = payload.get('search_geo_ids') or None
    sort_type = payload.get('sort_type') or None
    sort_name = payload.get('sort_name') or None

    datas = select_query(
        feature_id,
        sort_name=sort_name,
        sort_type=sort_type,
        limit=limit,
        search_geo_ids=search_geo_ids
    )

    return JsonResponse({ 'success': True, 'result': datas })


def select_query(feature_id, sort_name="geo_id", sort_type="ASC", limit=10, search_geo_ids=[]):
    datas = list()
    with connections['default'].cursor() as cursor:
        sql = """
            select
                gd.geo_id,
                gd.geo_data,
                ST_AsGeoJSON(gd.geo_data) as geojson,
                gd.feature_id,
                md.id,
                md.feature_config_id,
                md.data_type_id,
                md.property_id,
                md.code_list_id,
                md.value_text,
                md.value_number,
                md.value_date,
                md.value_connected_geo_id,
                md.created_on
            from m_geo_datas gd
            inner join m_datas md
            on gd.geo_id = md.geo_id
            where
                gd.feature_id = {feature_id}
                {search_geo_ids}
                ORDER BY {sort_name} {sort_type}
                limit {limit}
        """.format(
                feature_id=feature_id,
                sort_name=sort_name,
                sort_type=sort_type,
                limit=limit,
                search_geo_ids=' AND gd.geo_id in({}) '.format(', '.join(["'{}'".format(f) for f in search_geo_ids])) if search_geo_ids else ''
            )
        cursor.execute(sql)

        datas = [dict((cursor.description[i][0], value) \
            for i, value in enumerate(row)) for row in cursor.fetchall()]

    return datas
