import json
from geojson import Feature, FeatureCollection
from django.contrib.gis.geos import GEOSGeometry

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.contrib.gis.geos import MultiPolygon, MultiPoint, MultiLineString
from django.db import connections
import random
from backend.org.models import Org, Employee, InspirePerm
from govorg.backend.org_request.models import ChangeRequest
from backend.inspire.models import (
    LThemes,
    LPackages,
    LFeatures,
    MGeoDatas,
    MDatas,
    EmpPermInspire,
    EmpPerm
)
from django.contrib.auth.decorators import login_required
from main.utils import (
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
    data = json.loads(data)
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


def _get_org_request(ob, employee):

    geo_json = []
    old_geo_data = []
    current_geo_json = []
    feature_name = LFeatures.objects.filter(feature_id=ob.feature_id).first().feature_name
    package_name = LPackages.objects.filter(package_id=ob.package_id).first().package_name
    theme_name = LThemes.objects.filter(theme_id= ob.theme_id).values('theme_name', 'theme_code').first()
    if ob.old_geo_id:
        old_geo_data = _get_geom(ob.old_geo_id, ob.feature_id)
        if old_geo_data:
            old_geo_data = old_geo_data[0]['geom']
            old_geo_data = _get_geoJson(old_geo_data)

        if ob.geo_json:
            geo_json = ob.geo_json
            current_geo_json = _get_geoJson(geo_json)
            geo_json = FeatureCollection([current_geo_json, old_geo_data])

        else:
            geo_json = FeatureCollection([old_geo_data])

    else:
        geo_json = ob.geo_json
        geo_json = _get_geoJson(geo_json)
        geo_json = FeatureCollection([geo_json])

    return {
        'change_request_id':ob.id,
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
        'state':ob.state,
        'kind':ob.kind,
        'form_json':json.loads(ob.form_json) if ob.form_json else '',
        'geo_json':geo_json,
        'created_at':ob.created_at.strftime('%Y-%m-%d'),
        'employee':employee.user.first_name,
        'org':employee.org.name,
        'order_no': ob.order_no,
        'order_at': ob.order_at.strftime('%Y-%m-%d') if ob.order_at else '',
    }



@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_change_all(request):
    org_request = []
    employee = get_object_or_404(Employee, user=request.user)
    org_request_list = ChangeRequest.objects.filter(employee_id=employee.id).order_by("-created_at")

    if org_request_list:
        org_request = [_get_org_request(ob, employee) for ob in org_request_list]
        if org_request[0] != '':
            rsp = {
                'success':True,
                'org_request': org_request,
            }
        else:
            rsp = {
                'success':False,
            }
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
@login_required(login_url='/gov/secure/login/')
def getAll(request):
    org_request = []
    employees = _get_employees(request)
    employee = employees.filter(user=request.user).first()
    emp_features = _get_emp_features(employee)
    if emp_features:
        qs = ChangeRequest.objects
        qs = qs.filter(feature_id__in=emp_features)
        qs = qs.exclude(kind=ChangeRequest.KIND_REVOKE)
        qs = qs.order_by('-created_at')
        org_request_list = qs
        if org_request_list:
            org_request = [_get_org_request(ob, employee) for ob in org_request_list]
            choices = _getChoices(request.user)
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
@login_required(login_url='/gov/secure/login/')
def request_delete(request, pk):

    employee = get_object_or_404(Employee, user__username=request.user)
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
    change_req_obj = get_object_or_404(ChangeRequest, pk=pk)

    qs = EmpPermInspire.objects
    qs = qs.filter(emp_perm=emp_perm)
    qs = qs.filter(perm_kind=EmpPermInspire.PERM_REVOKE)
    perm_reject = qs.filter(feature_id=change_req_obj.feature_id)

    if perm_reject:
        change_req_obj.state = ChangeRequest.STATE_REJECT
        change_req_obj.save()
        rsp = {
            'success': True,
            'info': 'Амжилттай цуцаллаа'
        }
    else:
        rsp = {
            'success': False,
            'info': 'Цуцлах эрхгүй байна'
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
            f.feature_id='{fid}' and d.property_id={pid}
    """.format(
        fid=fid,
        pid=pid,
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


def _create_mdatas_object(form_json, feature_id, geo_id, approve_type):
    for i in form_json:
        value = dict()
        data = i['data'] or None
        code_list_value_types = ['option', 'single-select', 'boolean']
        if i['value_type'] in code_list_value_types:
            value_type = 'code_list_id'
            for code in i['data_list']:
                if data == code[value_type]:
                    data = code[value_type]
        else:
            value_type = 'value_' + i['value_type']

        value[value_type] = data

        if approve_type == 'create':
            ids = _get_ids(feature_id, i['property_id'])
            value['geo_id'] = geo_id
            value['feature_config_id'] = ids[0]['feature_config_id']
            value['data_type_id'] = ids[0]['data_type_id']
            value['property_id'] = i['property_id']
            MDatas.objects.create(**value)

        elif approve_type == 'update':
            MDatas.objects.filter(pk=i['pk']).update(**value)

    return True


def _geojson_to_geom(geo_json):
    geom = []
    geo_json = str(geo_json).replace("\'", "\"")
    geo_data = geoJsonConvertGeom(geo_json)
    geom = ''.join(geo_data)
    geom = GEOSGeometry(geom)

    geom_type = GEOSGeometry(geom).geom_type
    if geom_type == 'Point':
        geom = MultiPoint(geom, srid=4326)
    if geom_type == 'LineString':
        geom = MultiLineString(geom, srid=4326)
    if geom_type == 'Polygon':
        geom = MultiPolygon(geom, srid=4326)

    return geom


def _has_data_in_geo_datas(old_geo_id, feature_id):
    m_geo_datas = MGeoDatas.objects
    m_geo_datas = m_geo_datas.filter(geo_id=old_geo_id)
    m_geo_datas = m_geo_datas.filter(feature_id=feature_id)
    return m_geo_datas


def _make_geo_id(theme_code, feature_id):
    count = random.randint(106942, 996942)
    feature_code = LFeatures.objects.get(feature_id=feature_id).feature_code
    new_geo_id = feature_code + "_" + str(count) + "_" + 'geo'
    m_geo_datas = _has_data_in_geo_datas(new_geo_id, feature_id)
    if m_geo_datas:
        new_geo_id = _make_geo_id(theme_code)

    return new_geo_id



def _get_emp_features(employee):
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    emp_features = EmpPermInspire.objects.filter(emp_perm=emp_perm, perm_kind=EmpPermInspire.PERM_APPROVE).values_list('feature_id', flat=True)
    emp_feature = []
    if emp_features:
        for feature in emp_features:
            if feature not in emp_feature:
                emp_feature.append(feature)
    return emp_feature


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def request_approve(request, payload, pk):

    employee = get_object_or_404(Employee, user=request.user)
    emp_perm = get_object_or_404(EmpPerm, employee=employee)
    r_approve = get_object_or_404(ChangeRequest, pk=pk)
    values = payload.get("values")
    feature_id = values['feature_id']
    theme_code = values["theme_code"]
    success = False

    perm_approve = EmpPermInspire.objects.filter(
        emp_perm_id=emp_perm.id,
        feature_id=feature_id,
        perm_kind=EmpPermInspire.PERM_APPROVE
    )

    def _request_to_m(
            geo_json, theme_code, feature_id,
            form_json, approve_type, m_geo_datas,
            geo_id=None):
        geom = _geojson_to_geom(geo_json)

        success = _create_mdatas_object(
            form_json, feature_id,
            geo_id, approve_type
        )

        if approve_type == 'create':
            if geom:
                MGeoDatas.objects.create(
                    geo_id=geo_id,
                    feature_id=feature_id,
                    geo_data=geom
                )

        elif approve_type == 'update':
            m_geo_datas.update(geo_data=geom)

        return success

    if perm_approve:
        old_geo_id = values['old_geo_id']
        old_geo_json = values["old_geo_json"]
        new_geo_json = r_approve.geo_json
        form_json = values['form_json']

        m_geo_datas = _has_data_in_geo_datas(old_geo_id, feature_id)

        if r_approve.kind == ChangeRequest.KIND_CREATE:
            if old_geo_id and not m_geo_datas:
                approve_type = 'create'
                success = _request_to_m(
                    new_geo_json, theme_code,
                    feature_id, form_json,
                    approve_type, m_geo_datas,
                    old_geo_id,
                )
            else:
                new_geo_id = _make_geo_id(theme_code, feature_id)
                approve_type = 'create'
                success = _request_to_m(
                    new_geo_json, theme_code,
                    feature_id, form_json,
                    approve_type, m_geo_datas,
                    new_geo_id,
                )

                if success:
                    r_approve.new_geo_id = new_geo_id

        if r_approve.kind == ChangeRequest.KIND_UPDATE:
            if old_geo_json:
                approve_type = 'update'
                success = _request_to_m(
                    new_geo_json, theme_code,
                    feature_id, form_json,
                    approve_type, m_geo_datas,
                )

            else:
                m_geo_datas.delete()
                geo_data_model = MDatas.objects.filter(geo_id=old_geo_id)
                geo_data_model.delete()

        refreshMaterializedView(feature_id)
        r_approve.state = ChangeRequest.STATE_APPROVE
        r_approve.save()
        rsp = {
            'success': success,
            'info': 'Амжилттай баталгаажсан',
        }

    else:
        rsp = {
            'success': False,
            'info': 'Таньд баталгаажуулах эрх алга байна.'
        }

    return JsonResponse(rsp)


def _get_employees(request):
    org = get_object_or_404(Employee, user=request.user).org
    employees = Employee.objects.filter(org=org)
    return employees


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_count(request):

    employee = get_object_or_404(Employee, user=request.user)
    emp_features = _get_emp_features(employee)

    qs = ChangeRequest.objects
    qs = qs.filter(state=ChangeRequest.STATE_NEW)
    qs = qs.filter(feature_id__in=emp_features)

    revoke_count = qs.filter(kind=ChangeRequest.KIND_REVOKE).count()
    request_count = qs.exclude(kind=ChangeRequest.KIND_REVOKE).count()

    rsp = {
        'success': True,
        'count': request_count,
        'revoke_count': revoke_count,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def search(request, payload):
    data_list = []
    search = {}
    state = payload.get('state')
    kind = payload.get('kind')
    theme = payload.get('theme')
    package = payload.get('packag')
    feature = payload.get('feature')

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
        employee = get_object_or_404(Employee, user=request.user)
        emp_features = _get_emp_features(employee)
        if emp_features:
            datas = ChangeRequest.objects.filter(**search, feature_id__in=emp_features)
            data_list = [_get_org_request(data, employee) for data in datas]
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
