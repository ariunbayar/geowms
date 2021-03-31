import os
import glob
import csv
import datetime
from django.conf import settings

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_GET

from django.core.paginator import Paginator
from main.decorators import ajax_required
from backend.payment.models import Payment
from backend.payment.models import PaymentPoint
from backend.payment.models import PaymentPolygon
from backend.payment.models import PaymentLayer
from backend.wmslayer.models import WMSLayer
from backend.inspire.models import LFeatures
from backend.inspire.models import LProperties
from backend.inspire.models import MDatas
from backend.inspire.models import LCodeLists
from geoportal_app.models import User
from govorg.backend.forms.models import TsegUstsan, Mpoint_view
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile
from main import utils


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
        'id': payment.id,
        'geo_unique_number': payment.geo_unique_number,
        'bank_unique_number': payment.bank_unique_number,
        'description': payment.description,
        'total_amount': payment.total_amount,
        'user': payment.user.username,
        'is_success': payment.is_success,
        'card_number': payment.card_number,
        'message': payment.message,
        'code': payment.code,
        'export_file': payment.export_file,
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


def _get_feature_id(feature_code):
    feat_qs = LFeatures.objects
    feat_qs = feat_qs.filter(feature_code=feature_code)
    return feat_qs


def _get_filter_dicts():
    prop_qs = LProperties.objects
    prop_qs = prop_qs.filter(property_code__iexact='pointnumber')
    prop = prop_qs.first()

    feature_qs = _get_feature_id('gnp-gp-gp')
    if feature_qs:

        feature = feature_qs.first()
        property_qs, l_feature_c_qs, data_type_c_qs = utils.get_properties(feature.feature_id)
        data = utils.get_filter_field_with_value(property_qs, l_feature_c_qs, data_type_c_qs, prop.property_code)

        for prop_dict in prop_qs.values():
            for type in utils.value_types():
                if prop_dict['value_type_id'] in type['value_names']:
                    filter_value_type = type['value_type']
                    break
    return data, filter_value_type


def _filter_Model(filters, Model=MDatas):
    qs = Model.objects
    for search in filters:
        qs = qs.filter(**search)
    return qs


def _get_tseg_detail(payment):
    points = list()
    pay_points = PaymentPoint.objects.filter(payment=payment)
    for point in pay_points:
        data, filter_value_type = _get_filter_dicts()
        filter_value = dict()
        filter_value[filter_value_type] = point.pdf_id
        mdata_qs = _filter_Model([data, filter_value])
        mdata = mdata_qs.first()
        point_info = utils.get_mdata_value('gnp-gp-gp', mdata.geo_id, is_display=True)
        info = dict()
        for key, value in point_info.items():
            if isinstance(value, datetime.datetime):
                point_info[key] = utils.datetime_to_string(value)
            if key == 'AdministrativeUnitSubClass':
                code_qs = _filter_Model([{'code_list_id': point_info[key]}], Model=LCodeLists)
                if code_qs:
                    code = code_qs.first()
                    if code.top_code_list_id:
                        top_code_qs = _filter_Model([{'top_code_list_id': code.top_code_list_id}], Model=LCodeLists)
                        if top_code_qs:
                            top_code = top_code_qs.first()
                            info['aimag'] = top_code.code_list_name
                            info['sum'] =  code.code_list_name
                    else:
                        info['aimag'] = code.code_list_name
            info[key] = value
        info['amount'] = point.amount
        points.append(info)

    return points


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


def _get_detail_items(payment):
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
    return items


@require_GET
@ajax_required
@login_required
def get_detail(request, pk):

    payment = get_object_or_404(Payment, pk=pk)
    if payment.user == request.user:
        if payment.export_kind == Payment.EXPORT_KIND_POINT:
            points = _get_tseg_detail(payment)
            items = _get_detail_items(payment)
            rsp = {
                'success': True,
                'items': items,
                'points': points
            }

        if payment.export_kind == Payment.EXPORT_KIND_POLYGON:
            polygon = _get_polygon_detail(payment)
            layers = _get_layer_detail(payment)
            items = _get_detail_items(payment)
            rsp = {
                'success': True,
                'polygon': polygon,
                'layers': layers,
                'items': items,
            }
    else:
        rsp = {
            'success': False,
            'info': 'Уучлаарай энэ мэдээлэл олдсонгүй.'
        }

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


@require_GET
@ajax_required
@login_required
def check_email(request):

    user = request.user

    if user.email:
        rsp = {
            'success': True,
            'info': 'Email хаяг байна.'
        }
    else:
        rsp = {
            'success': False,
            'info': 'Уучлаарай email хаяг хоосон байна.'
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def set_email(request, payload):

    errors = dict()
    email = payload.get('email')

    if not utils.is_email(email):
        errors['email'] = 'Email хаяг алдаатай байна.'
    if User.objects.filter(email=email).first():
        errors['email'] = 'Email хаяг бүртгэлтэй байна.'
    if errors:
        rsp = {
            'success': False,
            'errors': errors
        }
        return JsonResponse(rsp)

    user = request.user
    user.email = email
    user.save()
    rsp = {
        'success': True,
        'info': 'Амжилттай'
    }

    return JsonResponse(rsp)
