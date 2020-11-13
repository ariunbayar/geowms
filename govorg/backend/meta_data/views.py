from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.db import transaction
from govorg.backend.meta_data.models import MetaData
from django.http import JsonResponse
from backend.inspire.models import MGeoDatas


def _get_meta_data_display(metadata):
    return {
            'org_name': metadata.org_name,
            'customer_org': metadata.customer_org,
            'distributor_org': metadata.distributor_org,
            'owner_org': metadata.owner_org,
            'keywords': metadata.keywords,
            'category': metadata.category,
            'status': metadata.status,
            'language': metadata.language,
            'abstract': metadata.abstract,
            'title': metadata.title,
            'schema': metadata.schema,
        }


def _update_or_create(pk, data, user):
    if pk:
        meta_data = get_object_or_404(MetaData, pk=pk)
    else:
        meta_data = MetaData()
        meta_data.created_by = user

    meta_data.org_name = data.get('org_name')
    meta_data.customer_org = data.get('customer_org')
    meta_data.distributor_org = data.get('distributor_org')
    meta_data.owner_org = data.get('owner_org')
    meta_data.keywords = data.get('keywords')
    meta_data.category = data.get('category')
    meta_data.status = data.get('status')
    meta_data.language = data.get('language')
    meta_data.abstract = data.get('abstract')
    meta_data.title = data.get('title')
    meta_data.schema = data.get('schema')
    meta_data.updated_by = user
    meta_data.save()

    return meta_data


@require_GET
@ajax_required
def all(request):

    meta_data_list = [
        _get_meta_data_display(metadata)
        for metadata in MetaData.objects.all()
    ]

    rsp = {
        'success': True,
        'meta_data_list': meta_data_list,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def create(request, payload):

    data = payload.get("meta_data")
    print('data')
    print('data')
    print('data')
    print('data')
    print('data')
    print('data')
    print(data)
    print("geom")
    print("geom")
    print("geom")
    print("geom")
    print("geom")
    print("geom")
    print(payload.get("geom_ids"))
    geoms = MGeoDatas.objects.filter(geo_id__in = payload.get("geom_ids"))
    try:
        if data.get("id"):
            meta = MetaData.objects.get(pk=data.get("id"))
        else:
            meta = _update_or_create(None, data, request.user)

        for geom in geoms:
            meta.geo_datas.add(geom)

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def edit(request, payload, pk):

    if _update_or_create(pk, payload.get("meta_data"), request.user):
        return JsonResponse({'success': True})

    return JsonResponse({'success': False})


@require_GET
@ajax_required
def detail(request, pk):

    meta_data = get_object_or_404(MetaData, pk=pk)

    rsp = {
        'success': True,
        'meta_data': _get_meta_data_display(meta_data),
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def delete(request, pk):

    with transaction.atomic():
        meta_data = get_object_or_404(MetaData, pk=pk)
        meta_data.geo_datas.clear()
        meta_data.delete()

        return JsonResponse({'success': True})

    return JsonResponse({'success': False})


@require_GET
@ajax_required
def getFields(request):
    send_fields = []
    for f in MetaData._meta.get_fields():
        if f.name != 'id' and f.name != 'geo_datas' and not 'create' in f.name and not 'update' in f.name:
            if hasattr(f, 'verbose_name') and hasattr(f, 'max_length'):
                send_fields.append({
                    'origin_name': f.name,
                    'name': f.verbose_name,
                    'length': f.max_length,
                    'choices': f.choices
                })
    rsp = {
        'success': True,
        'fields': send_fields
    }
    return JsonResponse(rsp)