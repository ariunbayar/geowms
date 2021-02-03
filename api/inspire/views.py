from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from backend.inspire.models import LFeatures
from backend.inspire.models import EmpPerm
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import MDatas
from backend.inspire.models import MGeoDatas
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LDataTypeConfigs
from backend.org.models import Employee
from main import utils
from main.inspire import GEoIdGenerator
from backend.dedsanbutets.models import FeatureOverlaps
from django.http import Http404


def check_feature_perm(employee, feature_id, perm_kind):
    emp_perm = EmpPerm.objects.filter(employee=employee).first()

    qs = EmpPermInspire.objects
    qs = qs.filter(feature_id=feature_id)
    qs = qs.filter(perm_kind=perm_kind)
    qs = qs.filter(emp_perm=emp_perm)
    qs = qs.first()

    rsp = {
        'success': True if qs else False,
        'info': "Ажилтанд эрх алга байна",
    }

    return rsp


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


@require_POST
@csrf_exempt
def create(request, token):
    payload = json.loads(request.body)
    payload_json = payload.get('payload_json') or None
    if not payload_json:
        raise Http404
    feature_id = payload_json.get('feature_id')
    datas = payload_json.get('datas')
    feature_obj = get_object_or_404(LFeatures, feature_id=feature_id)

    employee = get_object_or_404(Employee, token=token)
    result = check_feature_perm(employee, feature_id, EmpPermInspire.PERM_CREATE)
    if not result['success']:
        return JsonResponse(result)

    property_displays = property_of_feature(feature_id)

    datas = payload_json.get('datas')
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


@require_POST
@csrf_exempt
def update(request, token):
    payload = json.loads(request.body)
    payload_json = payload.get('payload_json') or None
    if not payload_json:
        raise Http404

    feature_id = payload_json.get('feature_id')
    datas = payload_json.get('datas')
    feature_obj = get_object_or_404(LFeatures, feature_id=feature_id)

    employee = get_object_or_404(Employee, token=token)
    result = check_feature_perm(employee, feature_id, EmpPermInspire.PERM_UPDATE)
    if not result['success']:
        return JsonResponse(result)

    property_displays = property_of_feature(feature_id)

    datas = payload_json.get('datas')
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
                is_contains_update_id_busad.append()
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


@require_POST
@csrf_exempt
def remove(request, token):
    payload = json.loads(request.body)
    feature_id = payload.get('feature_id') or None

    if not feature_id:
        raise Http404
    geo_id = payload.get('geo_id') or ''
    get_object_or_404(LFeatures, feature_id=feature_id)
    employee = get_object_or_404(Employee, token=token)
    result = check_feature_perm(employee, feature_id, EmpPermInspire.PERM_REMOVE)
    if not result['success']:
        return JsonResponse(result)

    m_geo_datas = MGeoDatas.objects.filter(geo_id=geo_id)
    m_datas = MDatas.objects.filter(geo_id=geo_id)
    m_geo_datas.delete()
    m_datas.delete()

    rsp = {
        'success': True,
        'info': geo_id + " тай geom болон attribute ийг амжилттай устаглаа"
    }

    return JsonResponse(rsp)


@require_POST
@csrf_exempt
def select(request, token):
    payload = json.loads(request.body)
    feature_id = payload.get('feature_id') or None
    if not feature_id:
        raise Http404
    limit = payload.get('limit') or None
    search_geo_ids = payload.get('search_geo_ids') or None
    sort_type = payload.get('sort_type') or None
    sort_name = payload.get('sort_name') or None
    get_object_or_404(LFeatures, feature_id=feature_id)
    employee = get_object_or_404(Employee, token=token)
    result = check_feature_perm(employee, feature_id, EmpPermInspire.PERM_VIEW)
    if not result['success']:
        return JsonResponse(result)

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







