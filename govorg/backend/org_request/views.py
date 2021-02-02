import json
from geojson import Feature, FeatureCollection
from django.contrib.gis.geos import GEOSGeometry

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.contrib.gis.geos import MultiPolygon, MultiPoint, MultiLineString
from django.db import connections, transaction
from django.db.models import Q

from backend.org.models import Employee
from govorg.backend.org_request.models import ChangeRequest
from main.inspire import GEoIdGenerator
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
    refreshMaterializedView,
    date_to_timezone,
    get_display_items,
    get_fields,
)
from main.components import Datatable


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
    theme_name = LThemes.objects.filter(theme_id=ob.theme_id).values('theme_name', 'theme_code').first()
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

    elif geo_json and ob.old_geo_id:
        geo_json = ob.geo_json
        geo_json = _get_geoJson(geo_json)
        geo_json = FeatureCollection([geo_json])

    return {
        'change_request_id': ob.id,
        'old_geo_id': ob.old_geo_id,
        'new_geo_id': ob.new_geo_id,
        'id': ob.id,
        'feature_id': ob.feature_id,
        'package_id': ob.package_id,
        'theme_id': ob.theme_id,
        'theme_code': theme_name['theme_code'],
        'theme_name': theme_name['theme_name'],
        'package_name': package_name,
        'feature_name': feature_name,
        'old_geo_json': current_geo_json,
        'state': ob.get_state_display(),
        'kind': ob.get_kind_display(),
        'group_id': ob.group_id,
        'form_json': json.loads(ob.form_json) if ob.form_json else '',
        'geo_json': geo_json if geo_json else '',
        'created_at': ob.created_at.strftime('%Y-%m-%d'),
        'employee': employee.user.first_name,
        'org': employee.org.name,
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


def _get_features(package_id, feature_ids):
    features = []
    inspire_features = LFeatures.objects.filter(package_id=package_id).values('feature_id', 'feature_name')
    for org_feature in inspire_features:
        if org_feature['feature_id'] in feature_ids:
            features.append({
                'id': org_feature['feature_id'],
                'name': org_feature['feature_name'],
            })
    return features


def _get_packages(theme_id, package_ids, feature_ids):
    packages = []
    inspire_packages = LPackages.objects.filter(theme_id=theme_id).values('package_id', 'package_name')
    for package in inspire_packages:
        if package['package_id'] in package_ids:
            packages.append({
                'id': package['package_id'],
                'name': package['package_name'],
                'features': _get_features(package['package_id'], feature_ids)
            })
    return packages


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_choices(request):
    choices = []
    modules = []
    for f in ChangeRequest._meta.get_fields():
        if hasattr(f, 'choices'):
            if f.name == 'state':
                choices.append(f.choices)
            if f.name == 'kind':
                choices.append(f.choices)

    feature_ids, package_ids, theme_ids = _get_emp_inspire_roles(request.user)
    themes = LThemes.objects.filter(theme_id__in=theme_ids)
    for theme in themes:
        modules.append({
            'id': theme.theme_id,
            'name': theme.theme_name,
            'packages': _get_packages(theme.theme_id, package_ids, feature_ids)
        })

    rsp = {
        'success': True,
        'choices': choices,
        'modules': modules
    }
    return JsonResponse(rsp)


def _make_group_request(group_id, item):
    if not item['form_json'] and not item['geo_json'] and not item['old_geo_id']:
        display_items = list()

        qs = ChangeRequest.objects
        qs = qs.filter(group_id=item['id'])
        if qs.count() > 1:
            fields = get_fields(ChangeRequest)
            хувьсах_талбарууд = _хувьсах_талбарууд()
            display_items = get_display_items(
                qs,
                fields,
                хувьсах_талбарууд
            )
        return display_items


def _get_emp_inspire_roles(user):
    employee = Employee.objects.filter(user=user).first()
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm).distinct('feature_id').values_list('feature_id', flat=True)
    package_ids = LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True)
    theme_ids = LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True)
    return feature_ids, package_ids, theme_ids


def _get_feature_name(feature_id, item):
    qs = LFeatures.objects
    qs = qs.filter(feature_id=feature_id)
    qs = qs.first()
    feature_name = qs.feature_name
    return feature_name


def _get_package_name(package_id, item):
    qs = LPackages.objects
    qs = qs.filter(package_id=package_id)
    qs = qs.first()
    package_name = qs.package_name

    return package_name


def _get_theme_name(theme_id, item):
    qs = LThemes.objects
    qs = qs.filter(theme_id=theme_id)
    qs = qs.first()
    theme_name = qs.theme_name

    return theme_name


def _get_theme_code(theme_id, item):
    qs = LThemes.objects
    qs = qs.filter(theme_id=theme_id)
    qs = qs.first()
    theme_code = qs.theme_code

    return theme_code


def _get_employee_name(employee_id, item):
    first_name = None
    if employee_id:
        employee = Employee.objects.filter(id=employee_id).first()
        first_name = employee.user.first_name
    return first_name


def _get_org_name(employee_id, item):
    org_name = None
    if employee_id:
        employee = Employee.objects.filter(id=employee_id).first()
        org_name = employee.org.name
    return org_name


def _get_display_text(field, value):
    for f in ChangeRequest._meta.get_fields():
        if hasattr(f, 'choices'):
            if f.name == field:
                for c_id, c_type in f.choices:
                    if c_id == value:
                        return c_type


def _choice_state_display(state, item):
    display_name = _get_display_text('state', state)
    return display_name


def _choice_kind_display(kind, item):
    display_name = _get_display_text('kind', kind)
    return display_name


def _str_to_json(form_json, item):
    return json.loads(form_json) if form_json else ''


def _geojson_to_featurecollection(geo_json, item):
    geo_json_list = list()
    if item['old_geo_id']:

        if item['geo_json']:
            current_geo_json = _get_geoJson(geo_json)
            geo_json_list.append(current_geo_json)

        old_geo_data = _get_geom(item['old_geo_id'], item['feature_id'])
        if old_geo_data:
            old_geo_data = old_geo_data[0]['geom']
            old_geo_data = _get_geoJson(old_geo_data)
            geo_json_list.append(old_geo_data)

    elif geo_json and not item['old_geo_id']:
        geo_json = _get_geoJson(geo_json)
        geo_json_list.append(geo_json)

    geo_json = FeatureCollection(geo_json_list)
    return geo_json


def _хувьсах_талбарууд():
    хувьсах_талбарууд = [
        {'field': 'feature_id', 'action': _get_feature_name, "new_field": "feature_name"},
        {'field': 'package_id', 'action': _get_package_name, "new_field": "package_name"},
        {'field': 'theme_id', 'action': _get_theme_name, "new_field": "theme_name"},
        {'field': 'theme_id', 'action': _get_theme_code, "new_field": "theme_code"},
        {'field': 'employee_id', 'action': _get_employee_name, "new_field": "employee"},
        {'field': 'employee_id', 'action': _get_org_name, "new_field": "org"},
        {'field': 'state', 'action': _choice_state_display, "new_field": "state"},
        {'field': 'kind', 'action': _choice_kind_display, "new_field": "kind"},
        {'field': 'form_json', 'action': _str_to_json, "new_field": "form_json"},
        {'field': 'group_id', 'action': _make_group_request, "new_field": "group"},
        {'field': 'geo_json', 'action': _geojson_to_featurecollection, "new_field": "geo_json"}
    ]

    return хувьсах_талбарууд


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_list(request, payload):

    employee = get_object_or_404(Employee, user=request.user)
    emp_features = _get_emp_features(employee)
    if emp_features:
        qs = ChangeRequest.objects
        qs = qs.filter(feature_id__in=emp_features)
        qs = qs.exclude(kind=ChangeRequest.KIND_REVOKE)
        if qs:
            qs = qs.filter(group_id__isnull=True)
            datatable = Datatable(
                model=ChangeRequest,
                payload=payload,
                initial_qs=qs,
                хувьсах_талбарууд=_хувьсах_талбарууд(),
            )
            items, total_page = datatable.get()

            rsp = {
                'items': items,
                'page': payload.get('page'),
                'total_page': total_page,
            }

        else:
            rsp = {
                'success': False,
            }

    else:
        rsp = {
                'success': False,
            }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def request_reject(request, payload):
    ids = payload.get('ids')
    feature_id = payload.get('feature_id')
    employee = get_object_or_404(Employee, user__username=request.user)
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()

    qs = EmpPermInspire.objects
    qs = qs.filter(emp_perm=emp_perm)
    qs = qs.filter(perm_kind=EmpPermInspire.PERM_REVOKE)
    perm_reject = qs.filter(feature_id=feature_id)

    if perm_reject:
        for r_id in ids:
            change_req_obj = get_object_or_404(ChangeRequest, pk=r_id)
            _check_group_items(change_req_obj)
            change_req_obj.state = ChangeRequest.STATE_REJECT
            change_req_obj.save()

        rsp = {
            'success': True,
            'info': 'Амжилттай татгалзлаа'
        }

    else:
        rsp = {
            'success': False,
            'info': 'Татгалзах эрхгүй байна'
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


def _get_emp_features(employee):
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    emp_features = EmpPermInspire.objects.filter(emp_perm=emp_perm, perm_kind=EmpPermInspire.PERM_APPROVE).values_list('feature_id', flat=True)
    emp_feature = []
    if emp_features:
        for feature in emp_features:
            if feature not in emp_feature:
                emp_feature.append(feature)
    return emp_feature


def _create_mdatas_object(form_json, feature_id, geo_id, approve_type):
    form_json = json.loads(form_json)
    for form in form_json:
        value = dict()
        data = form['data'] if form['data'] else None
        code_list_value_types = ['option', 'single-select', 'boolean']
        if form['value_type'] in code_list_value_types:
            value_type = 'code_list_id'
            for code in form['data_list']:
                if data == code[value_type]:
                    data = code[value_type]
        else:
            if form['value_type'] == 'date':
                if data:
                    data = date_to_timezone(data)
            value_type = 'value_' + form['value_type']

        value[value_type] = data

        if approve_type == 'create':
            ids = _get_ids(feature_id, form['property_id'])
            value['geo_id'] = geo_id
            value['feature_config_id'] = ids[0]['feature_config_id']
            value['data_type_id'] = ids[0]['data_type_id']
            value['property_id'] = form['property_id']
            MDatas.objects.create(**value)

        elif approve_type == 'update':
            MDatas.objects.filter(pk=form['pk']).update(**value)

    return True


def _request_to_m(request_datas):
    geom = _geojson_to_geom(request_datas['geo_json'])

    success = _create_mdatas_object(
        request_datas['form_json'], request_datas['feature_id'],
        request_datas['geo_id'], request_datas['approve_type']
    )

    if request_datas['approve_type'] == 'create':
        if geom:
            MGeoDatas.objects.create(
                geo_id=request_datas['geo_id'],
                feature_id=request_datas['feature_id'],
                geo_data=geom
            )

    elif request_datas['approve_type'] == 'update':
        request_datas['m_geo_datas_qs'].update(geo_data=geom)

    return success


def _has_data_in_geo_datas(old_geo_id, feature_id):
    qs = MGeoDatas.objects
    qs = qs.filter(geo_id=old_geo_id)
    qs = qs.filter(feature_id=feature_id)
    return qs


def _check_group_items(r_approve):
    qs = ChangeRequest.objects
    group_qs = qs.filter(group_id=r_approve.group_id)
    if group_qs:
        group_count = group_qs.count()

        if group_count <= 2:
            group_main = qs.filter(id=r_approve.group_id)
            group_main.delete()
            for other_item in group_qs:
                other_item.group_id = None
                other_item.save()

        r_approve.group_id = None


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def request_approve(request, payload):

    employee = get_object_or_404(Employee, user=request.user)
    emp_perm = get_object_or_404(EmpPerm, employee=employee)
    request_ids = payload.get("ids")
    feature_id = payload.get("feature_id")
    success = False
    new_geo_id = None

    feature_obj = get_object_or_404(LFeatures, feature_id=feature_id)
    requests_qs = ChangeRequest.objects
    requests_qs = requests_qs.filter(id__in=request_ids)

    with transaction.atomic():
        for r_approve in requests_qs:
            feature_id = r_approve.feature_id
            perm_approve = EmpPermInspire.objects.filter(
                emp_perm=emp_perm,
                feature_id=feature_id,
                perm_kind=EmpPermInspire.PERM_APPROVE
            )

            if perm_approve:
                old_geo_id = r_approve.old_geo_id
                geo_json = r_approve.geo_json
                form_json = r_approve.form_json
                group_id = r_approve.group_id

                m_geo_datas_qs = _has_data_in_geo_datas(old_geo_id, feature_id)

                if r_approve.kind == ChangeRequest.KIND_CREATE:
                    request_datas = dict()
                    if old_geo_id and not m_geo_datas_qs:
                        request_datas['geo_id'] = old_geo_id
                    else:
                        new_geo_id = GEoIdGenerator(feature_obj.feature_id, feature_obj.feature_code).get()
                        request_datas['geo_id'] = new_geo_id

                    request_datas['geo_json'] = geo_json
                    request_datas['approve_type'] = 'create'
                    request_datas['feature_id'] = feature_id
                    request_datas['form_json'] = form_json
                    request_datas['m_geo_datas_qs'] = m_geo_datas_qs
                    success = _request_to_m(request_datas)
                    if success and new_geo_id:
                        r_approve.new_geo_id = new_geo_id

                if r_approve.kind == ChangeRequest.KIND_UPDATE:
                    if geo_json:
                        request_datas = {
                            'geo_json': geo_json,
                            'geo_id': old_geo_id,
                            'approve_type': 'update',
                            'feature_id': feature_id,
                            'form_json': form_json,
                            'm_geo_datas_qs': m_geo_datas_qs
                        }
                        success = _request_to_m(request_datas)

                    else:
                        m_geo_datas_qs.delete()
                        qs = MDatas.objects.filter(geo_id=old_geo_id)
                        qs.delete()
                        r_approve.state = ChangeRequest.STATE_REJECT
                        r_approve.save()
                        rsp = {
                            'success': False,
                            'info': 'Геом өгөгдөл нь олдоогүй учраас татгалзлаа.'
                        }
                        return JsonResponse(rsp)

                r_approve.state = ChangeRequest.STATE_APPROVE
                _check_group_items(r_approve)
                r_approve.save()

            else:
                transaction.rollback()
                rsp = {
                    'success': False,
                    'info': 'Танд баталгаажуулах эрх алга байна.'
                }

        refreshMaterializedView(feature_id)
        rsp = {
            'success': True,
            'info': 'Амжилттай баталгаажуулж дууслаа'
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_count(request):

    employee = get_object_or_404(Employee, user=request.user)
    emp_features = _get_emp_features(employee)
    qs = ChangeRequest.objects
    qs = qs.filter(state=ChangeRequest.STATE_NEW)
    qs = qs.filter(feature_id__in=emp_features)
    qs = qs.exclude(Q(form_json__isnull=True) & Q(geo_json__isnull=True))
    revoke_count = qs.filter(kind=ChangeRequest.KIND_REVOKE).count()
    request_count = qs.exclude(kind=ChangeRequest.KIND_REVOKE).count()

    rsp = {
        'success': True,
        'count': request_count,
        'revoke_count': revoke_count,
    }

    return JsonResponse(rsp)
