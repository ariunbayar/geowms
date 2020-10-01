from django.shortcuts import render

from django.views.decorators.http import require_GET
from backend.changeset.models import ChangeSet
from django.views.decorators.csrf import csrf_exempt


def _get_bundle_options():

    form_options = []

    for wms in WMS.objects.all():
        layers = list(WMSLayer.objects.filter(wms=wms).values('id', 'name').order_by('sort_order'))
        wms_display = {
            'name': wms.name,
            'is_active': wms.is_active,
            'layers': layers,
        }
        form_options.append(wms_display)

    return form_options



def _get_changeset_display(geom):
    print("bundle", geom)
    print("attributes",geom.features )
    return {
        'geom':geom.geom,
        'attributes':geom.features
    }

@require_GET
@csrf_exempt
def changeset_all(request):
    cursor = connections['default'].cursor()
    cursor.execute(''' select * from changeset_changeset ''')
    geom = cursor.fetchone()

    print(geom)


    return JsonResponse({'success': True})

cursor = connections['default'].cursor()
cursor.execute(''' select * from changeset_changeset ''')
geom = cursor.fetchone()

print(geom)
