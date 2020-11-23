from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.core.paginator import Paginator


@require_POST
@ajax_required
def list(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def create(request):

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


@require_POST
@ajax_required
def detail(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def delete(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)
