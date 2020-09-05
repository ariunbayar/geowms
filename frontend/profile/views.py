from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from django.core.paginator import Paginator
from main.decorators import ajax_required
from backend.payment.models import Payment
from backend.forms.models import TsegUstsan, TsegPersonal, TuuhSoyol, TuuhSoyolPoint, TuuhSoyolHuree, TuuhSoyolAyuulHuree, Mpoint

@require_GET
@login_required
def history(request):

    return render(request, 'profile/index.html', {"profile": "profile"})


def _datetime_display(dt):
    return dt.strftime('%Y-%m-%d') if dt else None


def _get_payment_display(payment):

    return {
        'id': payment.id,
        'amount': payment.amount,
        'description': payment.description,
        'created_at': _datetime_display(payment.created_at),
        'is_success': payment.is_success,
        'user_id': payment.user_id,
        'bank_unique_number': payment.bank_unique_number,
        'data_id': payment.data_id,
        'geo_unique_number': payment.geo_unique_number,
        'success_at': _datetime_display(payment.success_at),
    }


@require_POST
@ajax_required
@login_required
def all(request, payload):

    page = payload.get('page')
    per_page = payload.get('per_page')
    total_items = Paginator(Payment.objects.all(), per_page)
    items_page = total_items.page(page)
    items = [
        _get_payment_display(pay)
        for pay in items_page.object_list
    ]
    total_page = total_items.num_pages

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
    }
    
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def tsegUstsanEdit(request, payload):
    print("haha")
    form_data = []
    img_holoos_url = ''
    img_oiroos_url = ''
    img_baruun_url = ''
    img_zuun_url = ''
    img_omno_url = ''
    img_hoino_url = ''
    for tseg in TsegUstsan.objects.filter(pk = payload.get('id')):
        if tseg.img_holoos:
            img_holoos_url = tseg.img_holoos.url
        if tseg.img_holoos:
            img_holoos_url = tseg.img_holoos.url
        if tseg.img_oiroos:
            img_oiroos_url = tseg.img_oiroos.url
        if tseg.img_baruun:
            img_baruun_url = tseg.img_baruun.url
        if tseg.img_zuun:
            img_zuun_url = tseg.img_zuun.url
        if tseg.img_omno:
            img_omno_url = tseg.img_omno.url
        if tseg.img_hoino:
            img_hoino_url = tseg.img_hoino.url
        form_data.append({
            'tseg_id': tseg.tseg_id,
            'email': tseg.email,
            'name': tseg.name,
            'alban_tushaal': tseg.alban_tushaal,
            'utas': tseg.phone,
            'oiroltsoo_bairlal': tseg.oiroltsoo_bairlal,
            'evdersen_baidal': tseg.evdersen_baidal,
            'nohtsol_baidal': tseg.shaltgaan,
            'sergeeh_sanal': tseg.sergeeh_sanal,
            'gps_hemjilt': tseg.gps_hemjilt,
            'img_holoos': img_holoos_url,
            'img_oiroos': img_oiroos_url,
            'img_baruun': img_baruun_url,
            'img_zuun': img_zuun_url,
            'img_omno': img_omno_url,
            'img_hoino': img_hoino_url,
        })
    rsp ={
        'form_data': form_data
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def tsegSearch(request, payload):
    query = payload.get('query')
    items = []
    mpoint = Mpoint.objects.using('postgis_db').filter(point_id__icontains=query)
    if(mpoint):
        for tseg in mpoint:
            items.append({
                "tseg": tseg.point_id
            })
        rsp = {
            'items': items
        }
        return JsonResponse(rsp)
    else:
        rsp = {
            'items': False
        }
        return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required
def tsegList(request):
    print("hi")
    tseg_ustsan = []
    for tseg in TsegUstsan.objects.all():
        tseg_ustsan.append({
            'id': tseg.id,
            'tseg_id': tseg.tseg_id,
            'email': tseg.email,
            'name': tseg.name,
            'alban_tushaal': tseg.alban_tushaal,
            'utas': tseg.phone,
            'oiroltsoo_bairlal': tseg.oiroltsoo_bairlal,
            'evdersen_baidal': tseg.evdersen_baidal,
            'nohtsol_baidal': tseg.shaltgaan,
        })
    return JsonResponse({
        'tseg_ustsan_all': tseg_ustsan,
        'success': True
    })

