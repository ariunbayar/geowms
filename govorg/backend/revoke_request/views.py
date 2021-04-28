import json

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.contrib.postgres.search import SearchVector
from geojson import FeatureCollection

from backend.inspire.models import (
    MGeoDatas,
    MDatas,
    LThemes,
    LPackages,
    LFeatures,
    EmpPermInspire,
    EmpPerm,
)
from govorg.backend.org_request.models import ChangeRequest
from backend.org.models import Employee

from main.decorators import ajax_required
from main.utils import refreshMaterializedView
from main.utils import has_employee_perm
from main.utils import check_form_json
from main.utils import (
    dict_fetchall,
    date_to_timezone,
    get_display_items,
    get_fields,
    get_feature_from_geojson,
)
from main.components import Datatable


def _date_to_str(date):
    return date.strftime('%Y-%m-%d')


def _get_revoke_request_display(revoke_request):
    return {
            'id': revoke_request.id,
            'old_geo_id': revoke_request.old_geo_id,
            'order_no': revoke_request.order_no,
            'order_at': _date_to_str(revoke_request.order_at) if revoke_request.order_at else '',
            'theme_name': LThemes.objects.filter(theme_id=revoke_request.theme_id).first().theme_name,
            'package_name': LPackages.objects.filter(package_id=revoke_request.package_id).first().package_name,
            'feature_name': LFeatures.objects.filter(feature_id=revoke_request.feature_id).first().feature_name,
            'last_name': revoke_request.employee.user.last_name,
            'first_name': revoke_request.employee.user.first_name,
            'org': revoke_request.employee.org.name,
            'created_at': _date_to_str(revoke_request.created_at) if revoke_request.created_at else '',
            'form_json': json.loads(revoke_request.form_json) if revoke_request.form_json else '',
            'geo_json': revoke_request.geo_json,
            'state': revoke_request.get_state_display(),
            'kind': revoke_request.get_kind_display(),
        }


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
    return json.loads(form_json) if form_json  else ''


def _geojson_to_featurecollection(geo_json, item):
    geo_json_list = list()
    if item['old_geo_id']:

        if item['geo_json']:
            current_geo_json = get_feature_from_geojson(geo_json)
            geo_json_list.append(current_geo_json)

        old_geo_data = _get_geom(item['old_geo_id'], item['feature_id'])
        if old_geo_data:
            old_geo_data = old_geo_data[0]['geom']
            old_geo_data = get_feature_from_geojson(old_geo_data)
            geo_json_list.append(old_geo_data)

    elif geo_json and not item['old_geo_id']:
        geo_json = get_feature_from_geojson(geo_json)
        geo_json_list.append(geo_json)

    geo_json = FeatureCollection(geo_json_list)
    return geo_json


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_list(request, payload):
    employee = get_object_or_404(Employee, user=request.user)
    emp_features = _get_emp_features(employee)

    if emp_features:
        qs = ChangeRequest.objects
        qs = qs.filter(feature_id__in=emp_features)
        qs = qs.exclude(kind=ChangeRequest.KIND_CREATE)
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
                'items': [],
                'page': 1,
                'total_page': 1,
            }

    else:
        rsp = {
            'items': [],
            'page': 1,
            'total_page': 1,
        }
    return JsonResponse(rsp)


def _get_emp_features(employee):
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    emp_features = EmpPermInspire.objects.filter(emp_perm=emp_perm, perm_kind=EmpPermInspire.PERM_APPROVE).values_list('feature_id', flat=True)
    emp_feature = []
    if emp_features:
        for feature in emp_features:
            if feature not in emp_feature:
                emp_feature.append(feature)
    return emp_feature


def _get_emp_inspire_roles(user):
    employee = Employee.objects.filter(user=user).first()
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm).distinct('feature_id').values_list('feature_id', flat=True)
    package_ids = LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True)
    theme_ids = LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True)
    return feature_ids, package_ids, theme_ids


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


# @require_POST
# @ajax_required
# @login_required(login_url='/gov/secure/login/')
# def revoke_paginate(request, payload):
#     employees = _get_employees(request)
#     emp_features = _get_emp_features(employees)

#     page = payload.get('page')
#     per_page = payload.get('per_page')
#     query = payload.get('query') or ''
#     state = payload.get('state')

#     revoke_requests = ChangeRequest.objects.annotate(
#         search=SearchVector(
#             'order_no',
#             'employee__user__first_name',
#             'employee__user__last_name'
#         )
#     ).filter(
#         search__icontains=query,
#         kind=ChangeRequest.KIND_REVOKE,
#         feature_id__in=emp_features,
#     ).order_by('-created_at')

#     if state:
#         revoke_requests = revoke_requests.filter(
#             state=state
#         )

#     total_items = Paginator(revoke_requests, per_page)
#     items_page = total_items.page(page)
#     items = [
#         _get_revoke_request_display(revoke_request)
#         for revoke_request in items_page.object_list
#     ]

#     total_page = total_items.num_pages

#     rsp = {
#         'items': items,
#         'page': page,
#         'total_page': total_page,
#         'success': True,
#         'choices': _get_choices_from_model(ChangeRequest, 'state'),
#     }

#     return JsonResponse(rsp)


def _change_revoke_request(id, state):
    change_request = get_object_or_404(ChangeRequest, id=id)
    change_request.state = state
    change_request.save()
    return change_request


def _delete_geom_data(change_request):
    MGeoDatas.objects.filter(geo_id=change_request.old_geo_id, feature_id=change_request.feature_id).delete()
    MDatas.objects.filter(geo_id=change_request.old_geo_id).delete()
    refreshMaterializedView(change_request.feature_id)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def revoke_state(request, payload):
    state = payload.get('state')
    pk = payload.get('id')

    if state == 'reject':
        _change_revoke_request(pk, ChangeRequest.STATE_REJECT)

    if state == 'approve':
        change_request = _change_revoke_request(pk, ChangeRequest.STATE_APPROVE)
        _delete_geom_data(change_request)

    return JsonResponse({'success': True})


def _new_revoke_request(employee, payload):

    theme_id = payload.get('tid')
    package_id = payload.get('pid')
    feature_id = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    geo_json = payload.get('geo_json')
    form_json = payload.get('form_json')
    order_no = payload.get('order_no')
    order_at = payload.get('order_at')
    form_json = check_form_json(feature_id, form_json, employee)
    geo_json = json.dumps(geo_json, ensure_ascii=False)

    change_request = ChangeRequest()
    change_request.old_geo_id = old_geo_id
    change_request.new_geo_id = None
    change_request.theme_id = theme_id
    change_request.package_id = package_id
    change_request.feature_id = feature_id
    change_request.employee = employee
    change_request.org = employee.org
    change_request.state = ChangeRequest.STATE_NEW
    change_request.kind = ChangeRequest.KIND_REVOKE
    change_request.form_json = form_json
    change_request.geo_json = geo_json
    change_request.order_no = order_no
    change_request.order_at = order_at
    change_request.save()


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def revoke_new(request, payload):
    employee = get_object_or_404(Employee, user=request.user)

    success, info = has_employee_perm(employee, payload.get('fid'), True, EmpPermInspire.PERM_REVOKE, payload.get('geo_json'))
    if success:
        _new_revoke_request(employee, payload)
        info = "Цуцлах хүсэлт амжилттай үүслээ"

    return JsonResponse({'success': success, 'info': info})
