from django.http import JsonResponse
from django.views.decorators.http import require_GET

from main.decorators import ajax_required
from main.utils import get_geom

from backend.org.models import Employee


@require_GET
@ajax_required
def map_region(request):

    employee = Employee.objects.filter(user=request.user).first()
    org = employee.org

    geom = get_geom(org.geo_id, 'MultiPolygon')

    rsp = {
        'allowed_geom': geom.json if geom else None
    }

    return JsonResponse(rsp)
