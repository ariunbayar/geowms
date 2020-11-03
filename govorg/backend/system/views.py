from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from geoportal_app.models import User
from backend.bundle.models import Bundle
from backend.wmslayer.models import WMSLayer
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db import connections
from django.contrib.postgres.search import SearchVector
from backend.govorg.models import GovOrg

def _get_govorg_display(govorg):

    layers = list(govorg.wms_layers.all().values_list('pk', flat=True))

    return {
        'id': govorg.pk,
        'name': govorg.name,
        'token': govorg.token,
        'created_at': govorg.created_at.strftime('%Y-%m-%d'),
        'layers': layers,
    }


@require_POST
@ajax_required
def systemList(request, payload):
    org = Org.objects.filter(employee__user=request.user).first()
    page = payload.get('page')
    per_page = payload.get('per_page')
    query = payload.get('query')
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    system_list = GovOrg.objects.all().annotate(search=SearchVector(
        'name')).filter(search__contains=query, org_id = org.id).order_by(sort_name)

    total_items = Paginator(system_list, per_page)
    items_page = total_items.page(page)
    items = [
        _get_govorg_display(govorg)
        for govorg in items_page.object_list
    ]
    total_page = total_items.num_pages

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
    }

    return JsonResponse(rsp)
