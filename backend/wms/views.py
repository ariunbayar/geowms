import requests
from django.http import HttpResponse, Http404
from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_POST, require_GET
from django.core.paginator import Paginator
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.contrib.postgres.search import SearchVector

from api.utils import replace_src_url
from backend.bundle.models import BundleLayer
from backend.wmslayer.models import WMSLayer
from backend.payment.models import PaymentLayer
from main.decorators import ajax_required

from .models import WMS
from .forms import WMSForm



def _get_wms_display(request, wms):
    return {
        'id': wms.id,
        'name': wms.name,
        'url': wms.url,
        'is_active': wms.is_active,
        'layers': [ob.code for ob in wms.wmslayer_set.all()],
        'layer_list': list(wms.wmslayer_set.all().values('id', 'code', 'name', 'title')),
        'public_url': request.build_absolute_uri(reverse('backend:wms:proxy', args=[wms.pk])),
        'created_at': wms.created_at.strftime('%Y-%m-%d'),
    }


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request):
    wms_list = [_get_wms_display(request, ob) for ob in WMS.objects.all()]
    return JsonResponse({'wms_list': wms_list, })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pagination(request, payload):
    last = payload.get('last')
    first = payload.get('first')
    wms_list = [_get_wms_display(request, ob) for ob in WMS.objects.all()[first:last]]
    return JsonResponse({
        'wms_list': wms_list,
        'len': WMS.objects.all().count()
            })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def updateMore(request, pk):

    wms_list = [_get_wms_display(request, ob) for ob in WMS.objects.filter(id=pk)]
    return JsonResponse({'wms_list': wms_list})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def wms_layer_all(request, payload):

    pk = payload.get('id')

    wms_layers = WMSLayer.objects.filter(wms_id=pk).order_by('sort_order')

    def _wms_layer_display(wms_layer):
        return {
                'id': wms_layer.id,
                'name': wms_layer.name,
                'code': wms_layer.code,
                'title': wms_layer.title,
                'sort_order': wms_layer.sort_order
            }

    layers_all = [
        _wms_layer_display(wms_layer)
        for wms_layer in wms_layers
    ]

    return JsonResponse({
        'layers_all': layers_all,
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def move(request, payload):

    wms = get_object_or_404(WMS, pk=payload.get('wmsId'))
    current_layer = get_object_or_404(WMSLayer, pk=payload.get('id'))

    wms_layers = wms.wmslayer_set.all().order_by('sort_order')

    if payload.get('move') == 'down':
        other_layer = wms_layers.filter(sort_order__gt=current_layer.sort_order).first()
    else:
        other_layer = wms_layers.filter(sort_order__lt=current_layer.sort_order).last()

    if other_layer:
        (other_layer.sort_order, current_layer.sort_order) = (current_layer.sort_order, other_layer.sort_order)
        other_layer.save()
        current_layer.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def activeUpdate(request, payload):

    wms_id = payload.get('id')
    is_active = payload.get('is_active')

    WMS.objects.filter(pk=wms_id).update(is_active=is_active)
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def titleUpdate(request, payload):

    title = payload.get('title')
    layer_id = payload.get('id')
    WMSLayer.objects.filter(pk=layer_id).update(title=title)
    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layerAdd(request, payload):

    wmsId = payload.get('wmsId')
    layer_name = payload.get('id')
    layer_code = payload.get('code')

    wms = get_object_or_404(WMS, pk=wmsId)
    wms_layer = WMSLayer.objects.filter(code=layer_code, wms_id=wms.id)
    if wms_layer:
        return JsonResponse({'success': False})
    else:
        wmslayerimage = WMSLayer.objects.create(name=layer_name, code=layer_code, wms=wms, title=layer_name, feature_price=0)
        return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layerRemove(request, payload):

    wmsId = payload.get('wmsId')
    layer_name = payload.get('id')
    wms_layer = get_object_or_404(WMSLayer, code=layer_name, wms=wmsId)
    BundleLayer.objects.filter(layer=wms_layer).delete()
    PaymentLayer.objects.filter(wms_layer=wms_layer).delete()
    wms_layer.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create(request, payload):

    form = WMSForm(payload)
    if form.is_valid():
        form.instance.created_by = request.user
        form.save()
        return JsonResponse({
            'wms': _get_wms_display(request, form.instance),
            'success': True
        })
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def update(request, payload):
    pk = payload.get('id')
    wms = get_object_or_404(WMS, pk=pk)
    layer_choices = payload.get('layer_choices')
    form = WMSForm(payload, instance=wms)
    is_active = payload.get('is_active')
    url_service = payload.get('url')
    if is_active:
        wms.is_active=True
    else:
        wms.is_active=False
    if url_service == wms.url:
        if form.is_valid():
            with transaction.atomic():
                form.save()
                wms = form.instance
            rsp = { 'success': True }
        else:
            rsp = { 'success': False }
    else:
        if form.is_valid():
            layers = WMSLayer.objects.filter(wms=wms)
            for layer in layers:
                PaymentLayer.objects.filter(wms_layer=layer).delete()
                BundleLayer.objects.filter(layer=layer).delete()
            layers.delete()
            form.save()
            rsp = { 'success': True }
        else:
            rsp = { 'success': False }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def delete(request, payload):

    wms = get_object_or_404(WMS, pk=payload.get('id'))
    layers = WMSLayer.objects.filter(wms=wms)
    for layer in layers:
        BundleLayer.objects.filter(layer=layer).delete()
        layer.delete()

    wms.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def paginatedList(request, payload):

    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('per_page')
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    wms_list = WMS.objects.all().annotate(search=SearchVector('name')).filter(search__contains=query).order_by(sort_name)

    total_items = Paginator(wms_list, per_page)
    items_page = total_items.page(page)
    items = [
        _get_wms_display(request, wms)
        for wms in items_page.object_list
    ]
    total_page = total_items.num_pages

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
    }

    return JsonResponse(rsp)


def _get_service_url(request, wms):
    url = reverse('backend:wms:proxy', args=[wms.pk])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
@user_passes_test(lambda u: u.is_superuser)
def proxy(request, wms_id):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    wms = get_object_or_404(WMS, pk=wms_id)
    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(wms.url, queryargs, headers=headers)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities':
        service_url = _get_service_url(request, wms)
        content = replace_src_url(content, wms.url, service_url)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(content, content_type=content_type)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_geo(requist, payload):
    wms_id = payload.get('id')
    code = payload.get('code')
    item = WMSLayer.objects.filter(wms_id=wms_id, code=code).first()
    items = []
    if item:
        items.append({
            'schema': item.geodb_schema,
            'pk_field': item.geodb_pk_field,
            'export_field': item.geodb_export_field,
            'price': item.feature_price,
            'table': item.geodb_table,
        })
    rsp = {
        'success': True,
        'items': items
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_geo(request, payload):
    datas = payload.get('data')
    wms_id = payload.get('id')
    code = payload.get('code')
    schema = None
    pk_field = None
    export_field = None
    price = None
    table = None
    schema = datas[0]['schema']
    pk_field = datas[0]['pk_field']
    export_field = datas[0]['export_field']
    if datas[0]['price']:
        price = datas[0]['price']
    else:
        price = 0
    table = datas[0]['table']

    WMSLayer.objects.filter(wms_id=wms_id, code=code).update(
        geodb_schema = schema,
        geodb_table = table,
        geodb_pk_field = pk_field,
        geodb_export_field = export_field,
        feature_price = price,
    )
    rsp = {
        'success': True
    }
    return JsonResponse(rsp)
