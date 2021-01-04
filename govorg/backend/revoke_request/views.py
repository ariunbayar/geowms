from django.shortcuts import render, get_object_or_404
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
import json
import pytz

from main.decorators import ajax_required
from main.utils import refreshMaterializedView

from backend.inspire.models import (
    MGeoDatas,
    MDatasBoundary,
    MDatasBuilding,
    MDatasCadastral,
    MDatasGeographical,
    MDatasHydrography,
    LThemes,
    LPackages,
    LFeatures,
    EmpPermInspire,
    EmpPerm,
)
from govorg.backend.org_request.models import ChangeRequest
from backend.org.models import Org, Employee

from django.conf import settings
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector


def _convert_text_json(data):
    data = data.replace("'", '"')
    data = data.replace("True", "true")
    data = data.replace("False", "false")
    data = json.loads(data)

    return data


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
            'form_json': _convert_text_json(revoke_request.form_json) if revoke_request.form_json else '',
            'geo_json': revoke_request.geo_json,
            'state': revoke_request.get_state_display(),
            'kind': revoke_request.get_kind_display(),
        }


def _get_choices_from_model(Model, field_name):
    choices = []
    for f in Model._meta.get_fields():
        if hasattr(f, 'choices'):
            if f.name == field_name:
                choices.append(f.choices)
    return choices


def _get_employees(request):
    org = get_object_or_404(Employee, user=request.user).org
    employees = Employee.objects.filter(org=org)
    return employees


def _get_emp_features(employees, request):
    employee = employees.filter(user=request.user).first()
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
def revokePaginate(request, payload):
    employees = _get_employees(request)
    emp_features = _get_emp_features(employees, request)

    page = payload.get('page')
    per_page = payload.get('per_page')
    query = payload.get('query') or ''
    order_at = payload.get('order_at')
    state = payload.get('state')

    revoke_requests = ChangeRequest.objects.annotate(
        search=SearchVector(
            'order_no',
            'employee__user__first_name',
            'employee__user__last_name'
        )
    ).filter(
        search__icontains=query,
        kind=ChangeRequest.KIND_REVOKE,
        feature_id__in=emp_features,
    ).order_by('-created_at')

    if state:
        revoke_requests = revoke_requests.filter(
            state=state
        )

    total_items = Paginator(revoke_requests, per_page)
    items_page = total_items.page(page)
    items = [
        _get_revoke_request_display(revoke_request)
        for revoke_request  in items_page.object_list
    ]
    total_page = total_items.num_pages

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
        'success': True,
        'choices': _get_choices_from_model(ChangeRequest, 'state'),
    }

    return JsonResponse(rsp)


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


def _change_revoke_request(id, state):
    change_request = get_object_or_404(ChangeRequest, id=id)
    change_request.state = state
    change_request.save()
    return change_request


def _delete_geom_data(change_request):
    MGeoDatas.objects.filter(geo_id=change_request.old_geo_id, feature_id=change_request.feature_id).delete()
    theme_code=LThemes.objects.filter(theme_id=change_request.theme_id).first().theme_code
    _get_model_name(theme_code).objects.filter(geo_id=change_request.old_geo_id).delete()
    refreshMaterializedView(change_request.feature_id)


@require_POST
@ajax_required
def revokeState(request, payload):
    state = payload.get('state')
    pk = payload.get('id')

    if state == 'reject':
        _change_revoke_request(pk, ChangeRequest.STATE_REJECT)

    if state == 'approve':
        change_request = _change_revoke_request(pk, ChangeRequest.STATE_APPROVE)
        _delete_geom_data(change_request)

    return JsonResponse({ 'success': True })