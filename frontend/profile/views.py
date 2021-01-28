from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from django.core.paginator import Paginator
from main.decorators import ajax_required
from backend.payment.models import Payment, PaymentPoint, PaymentPolygon, PaymentLayer
from backend.wmslayer.models import WMSLayer
from geoportal_app.models import User
from govorg.backend.forms.models import TsegUstsan, Mpoint_view
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile


@require_GET
@login_required
def history(request):

    return render(request, 'profile/index.html', {"profile": "profile"})


def _datetime_display(dt):
    return dt.strftime('%Y-%m-%d %H:%M') if dt else None

def _date_display(dt):
    return dt.strftime('%Y-%m-%d') if dt else None

def _get_payment_display(payment):

    return {
        'id':payment.id,
        'geo_unique_number':payment.geo_unique_number,
        'bank_unique_number':payment.bank_unique_number,
        'description':payment.description,
        'total_amount':payment.total_amount,
        'user':payment.user.username,
        'is_success':payment.is_success,
        'card_number':payment.card_number,
        'message':payment.message,
        'code':payment.code,
        'export_file':payment.export_file,
        'created_at': _datetime_display(payment.created_at),
        'failed_at': _date_display(payment.failed_at),
        'success_at': _date_display(payment.success_at),
    }


@require_POST
@ajax_required
@login_required
def all(request, payload):

    page = payload.get('page')
    per_page = payload.get('per_page')
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = '-created_at'
    total_items = Paginator(Payment.objects.filter(user=request.user).order_by(sort_name), per_page)
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
    names = []
    mpoint = Mpoint_view.objects.using('postgis_db').filter(point_id__icontains=query)[:10]
    if mpoint:
        for tseg in mpoint:
            items.append({
                "tseg": tseg.point_id
            })
        for name in mpoint[:1]:
            names.append({
                'aimag_ner': name.aimag,
                'sum_ner': name.sum,
            })
        rsp = {
            'items': items,
            'names': names
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

    mpoint = Mpoint_view.objects.using('postgis_db').filter(point_id__icontains=tseg_dugaar).first()
    if mpoint.point_id != tseg_dugaar:
        return JsonResponse({'success': False})

    oiroltsoo_bairlal = request.POST.get('oiroltsoo_bairlal')
    evdersen_baidal = request.POST.get('evdersen_baidal')
    shaltgaan = request.POST.get('nohtsol_baidal')
    sergeeh_sanal = request.POST.get('sergeeh_sanal')
    TorF = request.POST.get('hemjilt_hiih_bolomj')
    if TorF == 'false':
        TorF = False
    else:
        TorF = True
    img_holoos = request.POST.get('zurag_hol')
    img_oiroos = request.POST.get('zurag_oir')
    img_baruun = request.POST.get('zurag_baruun')
    img_zuun = request.POST.get('zurag_zuun')
    img_hoino = request.POST.get('zurag_hoid')
    img_omno = request.POST.get('zurag_omno')
    if img_holoos:
        [image_x2] = resize_b64_to_sizes(img_holoos, [(720, 720)])
        img_holoos = SimpleUploadedFile('img.png', image_x2)
    if img_oiroos:
        [image_x2] = resize_b64_to_sizes(img_oiroos, [(720, 720)])
        img_oiroos = SimpleUploadedFile('img.png', image_x2)
    if img_baruun:
        [image_x2] = resize_b64_to_sizes(img_baruun, [(720, 720)])
        img_baruun = SimpleUploadedFile('img.png', image_x2)
    if img_zuun:
        [image_x2] = resize_b64_to_sizes(img_zuun, [(720, 720)])
        img_zuun = SimpleUploadedFile('img.png', image_x2)
    if img_hoino:
        [image_x2] = resize_b64_to_sizes(img_hoino, [(720, 720)])
        img_hoino = SimpleUploadedFile('img.png', image_x2)
    if img_omno:
        [image_x2] = resize_b64_to_sizes(img_omno, [(720, 720)])
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


def _get_tseg_detail(payment):
    points = []
    pay_point = PaymentPoint.objects.filter(payment_id=payment.id)
    for point in pay_point:
        mpoint = Mpoint_view.objects.using('postgis_db').filter(id=point.point_id).first()
        if mpoint.pid:
            pdf = mpoint.pid
        else:
            pdf = 'файл байхгүй байна'
        points.append({
            'name': point.point_name,
            'amount': point.amount,
            'file_name': pdf
        })
    return {'points': points, 'mpoint': mpoint}


def _get_polygon_detail(payment):
    polygon_detail = []
    polygon = PaymentPolygon.objects.filter(payment=payment).first()
    polygon_detail.append({
        'LeftTopX': polygon.coodrinatLeftTopX,
        'LeftTopY': polygon.coodrinatLeftTopY,
        'RightBottomX': polygon.coodrinatRightBottomX,
        'RightBottomY': polygon.coodrinatRightBottomY,
    })
    return polygon_detail


def _get_layer_detail(payment):
    layer_list = []
    layers = PaymentLayer.objects.filter(payment=payment)
    for layer in layers:
        layer_info = WMSLayer.objects.filter(id=layer.wms_layer_id).first()
        layer_list.append({
            'name': layer_info.title,
            'amount': layer.amount,
        })
    return layer_list


def _get_detail_items(payment, mpoint):
    items = []
    items.append({
        'description': payment.description,
        'created_at': _datetime_display(payment.created_at),
        'success_at': payment.success_at,
        'is_success': payment.is_success,
        'user_id': payment.user_id,
        'geo_unique_number': payment.geo_unique_number,
        'total': payment.total_amount,
        'export_file': payment.export_file,
    })
    if mpoint:
         items.append({
            'mpoint_aimag': mpoint.aimag,
            'mpoint_sum': mpoint.sum,
            'undur': mpoint.ondor if mpoint.ondor else "Өндөр байхгүй",
        })
    return items


@require_GET
@ajax_required
@login_required
def getDetail(requist, pk):

    payment = Payment.objects.filter(pk=pk).first()
    if payment:
        if payment.export_kind == Payment.EXPORT_KIND_POINT:
            points = _get_tseg_detail(payment)
            items = _get_detail_items(payment, points['mpoint'])
            rsp = {
                'success': True,
                'items': items,
                'points': points
            }
        if payment.export_kind == Payment.EXPORT_KIND_POLYGON:
            polygon = _get_polygon_detail(payment)
            layers = _get_layer_detail(payment)
            items = _get_detail_items(payment, None)
            rsp = {
                'success': True,
                'polygon': polygon,
                'layers': layers,
                'items': items,
            }
    else:
        rsp = {'success': False}

    return JsonResponse(rsp)


def _get_user_display(user):
    return {
            'username': user.username,
            'last_name': user.last_name,
            'first_name': user.first_name,
            'email': user.email,
            'gender': user.gender,
            'register': user.register,
        }


@require_GET
@ajax_required
def user_info(request):

    rsp = {
        'success': True,
        'user_detail': _get_user_display(request.user),
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def user_update_password(request, payload):

    old_password = payload.get("old_password")
    new_password = payload.get("new_password")
    user = request.user

    if not old_password:
        return JsonResponse({'success': False, 'error': 'Хуучин нууц хоосон байна.'})

    if not new_password:
            return JsonResponse({'success': False, 'error': 'Шинэ нууц хоосон байна.'})

    if not user.check_password(old_password):
        return JsonResponse({'success': False, 'error': 'Хуучин нууц үг буруу байна.'})

    if old_password == new_password:
        return JsonResponse({'success': False, 'error': 'Хуучин нууц үг болон шинэ нууц үг ижил байна.'})

    try:
        user.set_password(new_password)
        user.save()
        return JsonResponse({'success': True, 'msg': 'Нууц үг амжилттай хадгалаа.'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': 'Нууц үг солиход алдаа гарлаа.'})
