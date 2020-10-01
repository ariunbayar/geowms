import requests
import json
from geojson import Point, Feature, FeatureCollection, dump,MultiPoint
from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

from api.utils import filter_layers, replace_src_url
from backend.govorg.models import GovOrg
from backend.wms.models import WMS, WMSLog
from backend.changeset.models import ChangeSet
from django.db import connections


def _get_service_url(request, token, wms):
    url = reverse('api:service:proxy', args=[token, wms.pk])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
def proxy(request, token, pk):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    govorg = get_object_or_404(GovOrg, token=token)
    wms = get_object_or_404(WMS, pk=pk)
    base_url = wms.url

    if not wms.is_active:
        raise Http404

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers)
    content = rsp.content

    allowed_layers = [layer.code for layer in govorg.wms_layers.filter(wms=wms)]
    if request.GET.get('REQUEST') == 'GetCapabilities':
        content = filter_layers(content, allowed_layers)

    content_type = rsp.headers.get('content-type')

    service_url = _get_service_url(request, token, wms)
    content = replace_src_url(content, wms.url, service_url)

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all= dict(queryargs),
        qs_request= qs_request,
        rsp_status= rsp.status_code,
        rsp_size= len(rsp.content),
        system_id= govorg.id,
        wms_id=pk,
    )

    return HttpResponse(content, content_type=content_type)


@require_POST
@csrf_exempt
def qgis_submit(request):

    values = request.POST.get('values')

    try:
        values_list = json.loads(values)

        changeset = ChangeSet()
        changeset.geom = values_list[0]
        changeset.features = values_list[1]
        changeset.save()

        return JsonResponse({'success': True})

    except Exception:
        return JsonResponse({'success': False})



def _get_changeset_display(ob):
    geom= eval(ob[1])
    geometry = eval(geom['geom'])
    coordinates = geometry['coordinates']
    geom_type = geometry['type']
    return {
        'coordinate':coordinates,
        'geom_type':geom_type,
        'changeset_id':ob[0],
        'changeset_attributes':ob[2]
    }

def _get_feature_coll(ob, changeset_list):
    
    point = MultiPoint((changeset_list[ob]['coordinate']))
    return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)




cursor = connections['default'].cursor()
cursor.execute(''' select * from changeset_changeset''')
changesets = cursor.fetchall()
feature = []
geoJson = []
changeset_list = [_get_changeset_display(ob) for ob in changesets]
features = [ _get_feature_coll(ob, changeset_list) for ob in range(len(changeset_list))]

feature_collection = FeatureCollection(features)
with open('myfile.geojson', 'w') as f:
   dump(feature_collection, f)
