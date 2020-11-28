from django.shortcuts import render, get_object_or_404
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
import json

from main.decorators import ajax_required
from main.utils import refreshMaterializedView

from backend.inspire.models import MGeoDatas, MDatasBoundary, MDatasBuilding, MDatasCadastral, MDatasGeographical, MDatasHydrography
from govorg.backend.org_request.models import ChangeRequest
from backend.org.models import Org, Employee


def _convert_text_json(data):
    data = data.replace("\'", "\"")
    data = json.loads(data)

    return data


def _get_revoke_request_display(revoke_request):
    return {
            'id': revoke_request.id,
            'old_geo_id': revoke_request.old_geo_id,
            'order_no': revoke_request.order_no,
            'order_at': revoke_request.order_at,
            'theme_id': revoke_request.theme_id,
            'package_id': revoke_request.package_id,
            'feature_id': revoke_request.feature_id,
            'last_name': revoke_request.employee.user.last_name,
            'first_name': revoke_request.employee.user.first_name,
            'org': revoke_request.employee.org.name,
            'form_json': _convert_text_json(revoke_request.form_json),
            'geo_json': revoke_request.geo_json,
        }


@require_GET
@ajax_required
def all(request):

    org = get_object_or_404(Org, employee__user=request.user)

    revoke_requests = ChangeRequest.objects.filter(employee__org=org, kind=ChangeRequest.KIND_REVOKE)

    revoke_request_list = [
        _get_revoke_request_display(revoke_request)
        for revoke_request in revoke_requests
    ]

    rsp = {
        'success': True,
        'revoke_requests': revoke_request_list,
    }

    return JsonResponse(rsp)


def _set_change_request(employee, data):

    theme_id = payload.get('tid')
    package_id = payload.get('pid')
    feature_id = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    geo_json = payload.get('geo_json')
    form_json = payload.get('form_json')
    order_no = payload.get('order_no')
    order_at = payload.get('order_at')

    changeRequest = ChangeRequest()
    changeRequest.old_geo_id = old_geo_id
    changeRequest.new_geo_id = None
    changeRequest.theme_id = theme_id
    changeRequest.package_id = package_id
    changeRequest.feature_id = feature_id
    changeRequest.employee = employee
    changeRequest.state = ChangeRequest.STATE_APPROVE
    changeRequest.kind = ChangeRequest.KIND_REVOKE
    changeRequest.form_json = form_json
    changeRequest.geo_json = geo_json
    changeRequest.order_at = order_at
    changeRequest.order_no = order_no
    changeRequest.save()


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


@require_POST
@ajax_required
def revoke(request, payload):

        employee = get_object_or_404(Employee, user=request.user)

        theme_code = payload.get('tcode')
        feature_id = payload.get('fid')
        old_geo_id = payload.get('old_geo_id')

        _set_change_request(employee, payload)

        MGeoDatas.objects.filter(geo_id=old_geo_id, feature_id=feature_id).delete()
        _get_model_name(theme_code).objects.filter(geo_id=old_geo_id).delete()
        refreshMaterializedView(feature_id)
