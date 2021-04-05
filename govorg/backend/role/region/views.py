from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

from main.decorators import ajax_required
from main.utils import get_geom

from backend.org.models import Employee


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def map_region(request):

    employee = get_object_or_404(Employee, user=request.user)
    org = employee.org

    geom = get_geom(org.geo_id, 'MultiPolygon')

    rsp = {
        'allowed_geom': geom.json if geom else None
    }

    return JsonResponse(rsp)
