from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from django.db import transaction

from main.decorators import ajax_required
from backend.org.models import Org
from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    EmpRole,
    EmpRoleInspire,
    LFeatures,
    LPackages,
)

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display,
)


@require_GET
@ajax_required
def list(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def create(request, payload):



    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def update(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def detail(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def delete(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)
