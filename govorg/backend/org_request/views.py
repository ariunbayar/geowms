import json
from geojson import Feature, FeatureCollection
from django.contrib.gis.geos import GEOSGeometry

from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.contrib.gis.geos import Polygon, MultiPolygon, MultiPoint, MultiLineString
from django.db import connections
import random
from backend.org.models import Org, Employee, InspirePerm
from govorg.backend.org_request.models import ChangeRequest
from geoportal_app.models import User
from backend.inspire.models import (
    LThemes,
    LPackages,
    LFeatures,
    MGeoDatas,
    MDatasBoundary,
    MDatasBuilding,
    MDatasCadastral,
    MDatasGeographical,
    MDatasHydrography,
    EmpPermInspire,
    EmpPerm,
    GovPerm,
    GovPermInspire
)


from main.utils import (
    gis_delete,
    gis_fetch_one,
    gis_fields_by_oid,
    gis_insert,
    gis_table_by_oid,
    gis_tables_by_oids,
    dict_fetchall,
    refreshMaterializedView
)


def _get_geom(geo_id, fid):
    cursor = connections['default'].cursor()
    sql = """
        SELECT
            ST_AsGeoJSON(ST_Transform(geo_data,4326)) as geom
        FROM
            m_geo_datas
        WHERE
            feature_id = {fid} and geo_id='{geo_id}'
        order by geo_id desc
        limit {limit}
    """.format(
        fid=fid,
        geo_id=geo_id,
        limit=4000
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


def _get_geoJson(data):
    geom_type = data['type']
    coordinates = data['coordinates']
    if geom_type == 'Point':
        from geojson import Point
        point = Point(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'LineString':
        from geojson import LineString
        point = LineString(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'Polygon':
        from geojson import Polygon
        point = Polygon(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'MultiPoint':
        from geojson import MultiPoint
        point = MultiPoint(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'MultiLineString':
        from geojson import MultiLineString
        point = MultiLineString(coordinates)
        return Feature(geometry=point)

    else:
        from geojson import MultiPolygon
        point = MultiPolygon(coordinates)
        return Feature(geometry=point)


def _convert_text_json(data):
    data = data.replace("\'", "\"")
    data = data.replace("True", "true")
    data = data.replace("False", "false")
    data = json.loads(data)

    return data


def _get_state_and_kind(type_of, module):
    data = ''
    for i in module:
        if i[0] == type_of:
            data = i[0]
    return data


def _get_org_request(ob, user):

    geo_json = []
    old_geo_data = []
    form_json = []
    inspire_perm = []
    current_geo_json = []
    user = get_object_or_404(User,  username=user)
    org = get_object_or_404(Org, employee__user=user)
    
    feature_name = LFeatures.objects.filter(feature_id= ob.feature_id).first().feature_name
    package_name = LPackages.objects.filter(package_id= ob.package_id).first().package_name
    theme_name = LThemes.objects.filter(theme_id= ob.theme_id).values('theme_name', 'theme_code').first()

    state = _get_state_and_kind(ob.state,ob.STATE_CHOICES)
    kind = _get_state_and_kind(ob.kind,ob.KIND_CHOICES)

    if user.is_superuser:
        gov_perm = get_object_or_404(GovPerm, org=org)
        inspire_perm = GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=ob.feature_id, perm_kind=6)


    else:
        emp_perm = get_object_or_404(EmpPerm, employee_id=ob.employee_id).first()
        inspire_perm = EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=ob.feature_id, perm_kind=6)
        

    if inspire_perm:
        if ob.old_geo_id:
            old_geo_data = _get_geom(ob.old_geo_id, ob.feature_id)
            if old_geo_data:
                if ob.geo_json:
                    geo_json = _convert_text_json(ob.geo_json)
                    current_geo_json = _get_geoJson(geo_json)
                    old_geo_data = _convert_text_json(old_geo_data[0]['geom'])
                    old_geo_data = _get_geoJson(old_geo_data)
                    geo_json = FeatureCollection([geo_json, old_geo_data])

                else:
                    if old_geo_data:
                        old_geo_data = _convert_text_json(old_geo_data[0]['geom'])
                        geo_json = _get_geoJson(old_geo_data)
                        geo_json = FeatureCollection([geo_json])

        else:
            geo_json = _convert_text_json(ob.geo_json)
            geo_json = _get_geoJson(geo_json)
            geo_json = FeatureCollection([geo_json])

    return {
        'old_geo_id':ob.old_geo_id,
        'new_geo_id':ob.new_geo_id,
        'id':ob.id,
        'feature_id':ob.feature_id,
        'package_id':ob.package_id,
        'theme_id':ob.theme_id,
        'theme_code':theme_name['theme_code'],
        'theme_name':theme_name['theme_name'],
        'package_name':package_name,
        'feature_name':feature_name,
        'old_geo_json':current_geo_json,
        'state':state,
        'kind':kind,
        'form_json':_convert_text_json(ob.form_json) if ob.form_json else '',
        'geo_json':geo_json,
        'created_at':ob.created_at.strftime('%Y-%m-%d'),
        'employee':user.first_name,
        'org':org.name,
        'order_no': ob.order_no,
        'order_at': ob.order_at.strftime('%Y-%m-%d') if ob.order_at else '',
    }


@require_GET
@ajax_required
def getChangeAll(request):
    org_request = []
    employee = Employee.objects.filter(user=request.user).first()
    org_request_list = ChangeRequest.objects.filter(employee_id=employee.id)
    user = request.user
    if org_request_list:
        org_request = [_get_org_request(ob, user) for ob in org_request_list]
        if org_request[0] != '':
            rsp = {
                'success':True,
                'org_request': org_request,
            }

            return JsonResponse(rsp)
        else:
            rsp = {
                'success':False,
            }

            return JsonResponse(rsp)
    else:
        rsp = {
                'success':False,
            }

        return JsonResponse(rsp)


def _get_features(org, package_id):
    features = []
    inspire_features = LFeatures.objects.filter(package_id=package_id).values('feature_id', 'feature_name')
    if inspire_features:
        for org_feature in inspire_features:
            org_features = InspirePerm.objects.filter(org=org, perm_view=True, module_root_id = package_id, module_id=org_feature['feature_id'])
            if org_features:
                for feature in org_features:
                    features.append({
                        'id': org_feature['feature_id'],
                        'name': org_feature['feature_name'],
                    })
    return features


def _get_packages(org, theme_id):
    packages = []
    org_packages = InspirePerm.objects.filter(org=org, perm_view=True, module_root_id = theme_id)
    if org_packages:
        for org_package in org_packages:
            inspire_packages = LPackages.objects.filter(package_id=org_package.module_id).values('package_id', 'package_name')
            if inspire_packages:
                for package in inspire_packages:
                    packages.append({
                        'id':package['package_id'],
                        'name':package['package_name'],
                        'features':_get_features(org, package['package_id'])
                    })
    return packages


def _getChoices(user):
    choices = []
    modules = []
    for f in ChangeRequest._meta.get_fields():
        if hasattr(f, 'choices'):
            if f.name == 'state':
                choices.append(f.choices)
            if f.name == 'kind':
                choices.append(f.choices)
    org = get_object_or_404(Org, employee__user=user)
    roles_inspire = InspirePerm.objects.filter(org=org, perm_view=True, module=1)
    for role in roles_inspire:
        themes = LThemes.objects.filter(theme_id=role.module_id)
        for theme in themes:
            modules.append({
                'id': theme.theme_id,
                'name': theme.theme_name,
                'packages': _get_packages(org, theme.theme_id)
            })

    return {'choices': choices, 'modules': modules}

@require_GET
@ajax_required
def getAll(request):

    org_request = []
    user = request.user
    org_request_list = ChangeRequest.objects.all().order_by('-created_at')
    if org_request_list:
        org_request = [_get_org_request(ob, user) for ob in org_request_list]
        choices = _getChoices(request.user)
        if org_request[0] != '':
            rsp = {
                'success':True,
                'org_request': org_request,
                'choices': choices['choices'],
                'modules': choices['modules'],
            }

            return JsonResponse(rsp)
        else:
            rsp = {
                'success':False,
            }

            return JsonResponse(rsp)
    else:
        rsp = {
                'success':False,
            }

        return JsonResponse(rsp)


@require_GET
@ajax_required
def requestDelete(request, pk):

    get_object_or_404(ChangeRequest, id=pk)
    change_request = ChangeRequest.objects.filter(id = pk).update(state=ChangeRequest.STATE_REJECT)

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


def geoJsonConvertGeom(geojson):
    with connections['default'].cursor() as cursor:

        sql = """ SELECT ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        geom =  ''.join(geom)
        geom = GEOSGeometry(geom).hex
        geom = geom.decode("utf-8")
        return geom


def _get_model_name(name):

    if name == 'hg':
        return MDatasHydrography
    elif name == 'au':
        return MDatasBoundary
    elif name =='bu':
        return MDatasBuilding
    elif name=='gn':
        return MDatasGeographical
    elif name=='cp':
        return MDatasCadastral


def _get_ids(fid, pid):
    cursor = connections['default'].cursor()
    sql = """
        select
            f.feature_config_id,
            d.data_type_id
        from l_feature_configs as f
        inner join
            l_data_type_configs as d
        on d.data_type_id=f.data_type_id
        where
            f.feature_id='{fid}'  and  d.property_id={pid}
    """.format(
        fid=fid,
        pid=pid,
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


@require_POST
@ajax_required
def requestApprove(request, payload, pk):

    values = payload.get("values")
    request_object  = ChangeRequest.objects.filter(id=pk)
    if request_object:
        old_geo_id = values['old_geo_id']
        feature_id = values['feature_id']
        old_geo_json = values["old_geo_json"]
        theme_code = values["theme_code"]
        form_json = values['form_json']
        geo_json = values['geo_json']
        count = random.randint(106942, 996942)
        new_geo_id = str(count)+'geo'

        if old_geo_id:
            if old_geo_json:
                geom = []
                geo_json = old_geo_json['geometry']
                geo_json = str(geo_json).replace("\'", "\"")
                geom = GEOSGeometry(geo_json)
                MGeoDatas.objects.filter(geo_id=old_geo_id, feature_id=feature_id).update(geo_data=geom)
                ChangeRequest.objects.filter(id = pk).update(state=ChangeRequest.STATE_APPROVE)
                view_check = refreshMaterializedView(feature_id)
                rsp = {
                    'success': True,
                }

            else:
                data = MGeoDatas.objects.filter(geo_id=old_geo_id, feature_id=feature_id)
                data.delete()
                geo_data_model = _get_model_name(theme_code).objects.filter(geo_id=old_geo_id)
                geo_data_model.delete()
                ChangeRequest.objects.filter(id = pk).update(state=ChangeRequest.STATE_APPROVE)
                view_check = refreshMaterializedView(feature_id)
                rsp = {
                    'success': True,
                }
        else:
            geom = []
            geo_json = geo_json['features'][0]['geometry']
            geo_json = str(geo_json).replace("\'", "\"")
            geo_data = geoJsonConvertGeom(geo_json)
            geom =  ''.join(geo_data)
            geom = GEOSGeometry(geom)
            geom_type = GEOSGeometry(geom).geom_type
            if geom_type == 'Point':
                geom = MultiPoint(geom, srid=4326)
            if geom_type == 'LineString':
                geom = MultiLineString(geom, srid=4326)
            if geom_type == 'Polygon':
                geom = MultiPolygon(geom, srid=4326)
            if geom:
                MGeoDatas.objects.create(
                    geo_id=new_geo_id,
                    feature_id=feature_id,
                    geo_data=geom
                    )

            geo_data_model = _get_model_name(theme_code)
            value_data = None
            for i in form_json['form_values']:
                ids = _get_ids(feature_id, i['property_id'])
                fid = ids[0]['feature_config_id']
                did = ids[0]['data_type_id']
                if  i['value_type_id'] == 'number':
                    if i['data']:
                        value_data = i['data']
                    geo_data_model.objects.create(
                        geo_id = new_geo_id,
                        feature_config_id=fid,
                        data_type_id = did,
                        property_id = i['property_id'],
                        value_number = value_data
                    )
                elif i['value_type_id'] == 'date':
                    if i['data']:
                        value_data = i['data']+' '+'06:00:00+0800'
                    geo_data_model.objects.create(
                        geo_id = new_geo_id,
                        feature_config_id=fid,
                        data_type_id = did,
                        property_id = i['property_id'],
                        value_date = value_data
                    )
                else:
                    if i['data']:
                        value_data = i['data']
                    geo_data_model.objects.create(
                        geo_id = new_geo_id,
                        feature_config_id=fid,
                        data_type_id = did,
                        property_id = i['property_id'],
                        value_text = value_data
                    )
            ChangeRequest.objects.filter(id = pk).update(state=ChangeRequest.STATE_APPROVE)
            view_check = refreshMaterializedView(feature_id)
            rsp = {
                'success': True,
            }

    else:
        rsp = {
            'success': False,
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def getCount(request):
    try:
        if request.user:
            count = ChangeRequest.objects.filter(state=ChangeRequest.STATE_NEW).count()

        else:
            employee = Employee.objects.filter(user = request.user).first()
            if employee:
                count = ChangeRequest.objects.filter(state=ChangeRequest.STATE_NEW, employee_id=employee.id).count()

        rsp = {
            'success': True,
            'count': count
        }
    except Exception as e:
        rsp = {
            'success': False,
            'info': str(e)
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def search(request, payload):
    data_list = []
    search = {}
    state = payload.get('state')
    kind = payload.get('kind')
    theme = payload.get('theme')
    package = payload.get('packag')
    feature = payload.get('feature')
    user = request.user
    if state:
        search['state'] = state
    if kind:
        search['kind'] = kind
    if theme:
        search['theme_id'] = theme
    if package:
        search['package_id'] = package
    if feature:
        search['feature_id'] = feature
    try:
        datas = ChangeRequest.objects.filter(**search)
        data_list = [_get_org_request(data, user) for data in datas]
        rsp = {
            'success': True,
            'org_request': data_list
        }
    except Exception as e:
        rsp = {
            'success': False,
            'info': str(e)
        }
    return JsonResponse(rsp)
