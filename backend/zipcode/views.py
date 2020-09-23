from django.shortcuts import render
from backend.wmslayer.models import WMSLayer
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.db import connections


@require_POST
@ajax_required
def aimag(request):
    try:
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT  code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))) FROM public."AU_AimagUnit" ORDER BY name ASC ''')
        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)



@require_POST
@ajax_required
def sum(request, payload):
    try:
        code = payload.get('code')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))), au1_code FROM public."AU_SumUnit" where au1_code = %s ORDER BY name  ASC ''', [code])
        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)

@require_POST
@ajax_required
def bagaHoroo(request, payload):
    try:
        code = payload.get('code')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))), au1_code, au2_code FROM public."AU_BagUnit" where au2_code = %s ORDER BY name ASC ''', [code])
        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_GET
@ajax_required
def wmsLayer(request):
    layers = []
    zip_layers = WMSLayer.objects.filter(geodb_table='zip_code')
    for zip_layer in zip_layers:
        layers.append({
            'name':zip_layer.name,
            'code':zip_layer.code
        })
        wms_id = zip_layer.wms_id
    wms_list = [{
        'name': 'Зипкод',
        'url': '/back/wms/WMS/' + str(wms_id) + '/',
        'layers':layers
    }]
    rsp = {
        'wms_list': wms_list,
        'success': True,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def zipUpdate(request, payload):
    aimag_id = payload.get('aimag_id')
    sum_id = payload.get('sum_id')
    zip_code =  payload.get('zip_code')
    zip_id =  payload.get('zip_id')
    zip_code_before =  payload.get('zip_code_before')
    find_cursor = connections['postgis_db'].cursor()
    if not aimag_id != -1 and sum_id == -1 and baga_id == -1:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)

    if aimag_id != -1 and sum_id == -1 and zip_id == -1:
        find_cursor.execute(''' UPDATE  public."AU_AimagUnit" SET zipcode = %s where zipcode = %s''', [zip_code, zip_code_before])
        find_cursor.execute(''' UPDATE  public."AU_SumUnit" SET au1_code = %s where au1_code = %s''', [zip_code, zip_code_before])
        find_cursor.execute(''' UPDATE public.zipcode2 SET au1_code = %s where au1_code = %s''', [zip_code, zip_code_before])

    if sum_id != -1 and aimag_id != -1 and zip_id == -1:
        find_cursor.execute(''' UPDATE  public."AU_SumUnit" SET code = %s where code = %s''', [zip_code, zip_code_before])
        find_cursor.execute(''' UPDATE public.zipcode2 SET au2_code = %s where au2_code = %s''', [zip_code, zip_code_before])

    if sum_id != -1 and aimag_id != -1 and zip_id != -1:
        find_cursor.execute(''' UPDATE public.zipcode2 SET zip_code = %s where zip_code = %s''', [zip_code, zip_code_before])
    rsp = {
        'success': True,
        'info': "Алдаа гарсан",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def zip(request, payload):
    try:
        code = payload.get('code')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT zip_code, zip_name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))) FROM public.zipcode2 where au2_code = %s ORDER BY zip_name ASC ''', [code])
        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_POST
@ajax_required
def search(request, payload):
    try:
        query = payload.get('query')
        search_table = payload.get('search_table')
        data = None
        find_cursor = connections['postgis_db'].cursor()
        if search_table == 'AU_AimagUnit':
            if query:
                find_cursor.execute(''' SELECT code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))) FROM "AU_AimagUnit" WHERE code LIKE %s ORDER BY name ASC limit 10 ''', [query + '%'])
            else:
                find_cursor.execute(''' SELECT code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))) FROM "AU_AimagUnit" WHERE code IS NULL ORDER BY name ASC limit 10 ''', [query + '%'])
        if search_table == 'AU_SumUnit':
            if query:
                find_cursor.execute(''' SELECT code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))), au1_code FROM "AU_SumUnit" WHERE CAST(code AS TEXT) LIKE %s ORDER BY name ASC limit 10 ''', [query + '%'])
            else:
                find_cursor.execute(''' SELECT code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))), au1_code FROM "AU_SumUnit" WHERE CAST(code AS TEXT) IS NULL ORDER BY name ASC limit 10 ''', [query + '%'])
        if search_table == 'zipcode':
            if query:
                find_cursor.execute(''' SELECT zip_code, zip_name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))), au1_code, au2_code FROM public.zipcode2 WHERE CAST(zip_code AS TEXT) LIKE %s ORDER BY zip_name ASC limit 10 ''', [query + '%'])
            else:
                find_cursor.execute(''' SELECT zip_code, zip_name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))), au1_code, au2_code FROM public.zipcode2 WHERE CAST(zip_code AS TEXT) IS NULL ORDER BY zip_name ASC limit 10 ''', [query + '%'])

        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)