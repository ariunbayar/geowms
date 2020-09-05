from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from django.core.paginator import Paginator
from main.decorators import ajax_required
from backend.payment.models import Payment
from geoportal_app.models import User
from backend.forms.models import TsegUstsan, TsegPersonal, TuuhSoyol, TuuhSoyolPoint, TuuhSoyolHuree, TuuhSoyolAyuulHuree, Mpoint
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile


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


@require_POST
@ajax_required
@login_required
def tsegAdd(request):
    tseg_dugaar = request.POST.get('tsegiin_dugaar')

    mpoint = Mpoint.objects.using('postgis_db').filter(point_id__icontains=tseg_dugaar).first()
    if mpoint.point_id != tseg_dugaar:
        return JsonResponse({'success': False})

    oiroltsoo_bairlal = request.POST.get('oiroltsoo_bairlal')
    evdersen_baidal = request.POST.get('evdersen_baidal')
    shaltgaan = request.POST.get('nohtsol_baidal')
    sergeeh_sanal = request.POST.get('sergeeh_sanal')
    TorF = bool(request.POST.get('hemjilt_hiih_bolomj'))
    img_holoos = request.POST.get('zurag_hol')
    img_oiroos = request.POST.get('zurag_oir')
    img_baruun = request.POST.get('zurag_baruun')
    img_zuun = request.POST.get('zurag_zuun')
    img_hoino = request.POST.get('zurag_hoid')
    img_omno = request.POST.get('zurag_omno')

    if img_holoos:
        [image_x2] = resize_b64_to_sizes(img_holoos, [(300, 300)])
        img_holoos = SimpleUploadedFile('img.png', image_x2)
    if img_oiroos:
        [image_x2] = resize_b64_to_sizes(img_oiroos, [(300, 300)])
        img_oiroos = SimpleUploadedFile('img.png', image_x2)
    if img_baruun:
        [image_x2] = resize_b64_to_sizes(img_baruun, [(300, 300)])
        img_baruun = SimpleUploadedFile('img.png', image_x2)
    if img_zuun:
        [image_x2] = resize_b64_to_sizes(img_zuun, [(300, 300)])
        img_zuun = SimpleUploadedFile('img.png', image_x2)
    if img_hoino:
        [image_x2] = resize_b64_to_sizes(img_hoino, [(300, 300)])
        img_hoino = SimpleUploadedFile('img.png', image_x2)
    if img_omno:
        [image_x2] = resize_b64_to_sizes(img_omno, [(300, 300)])
        img_omno = SimpleUploadedFile('img.png', image_x2)

    users = User.objects.filter(id=request.user.id)
    for user in users:
        email = user.email
        baiguulla = 'ДАН'
        alban_tushaal = 'ДАН'
        phone = ''

    TsegUstsan.objects.create(
        email=email,
        name=baiguulla,
        alban_tushaal=alban_tushaal,
        phone=phone,
        img_holoos=img_holoos,
        img_oiroos=img_oiroos,
        img_baruun=img_baruun,
        img_zuun=img_zuun,
        img_hoino=img_hoino,
        img_omno=img_omno,
        tseg_id=tseg_dugaar,
        oiroltsoo_bairlal=oiroltsoo_bairlal,
        evdersen_baidal=evdersen_baidal,
        shaltgaan=shaltgaan,
        sergeeh_sanal=sergeeh_sanal,
        gps_hemjilt=TorF,
    )
    return JsonResponse({'success': True})