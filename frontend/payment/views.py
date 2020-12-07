from zipfile import ZipFile
import os
import uuid
import subprocess

from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse, Http404
from django.shortcuts import get_object_or_404, get_list_or_404
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB
from govorg.backend.forms.models import Mpoint_view
from backend.payment.models import Payment, PaymentPoint, PaymentPolygon, PaymentLayer
from backend.inspire.models import LThemes, LFeatureConfigs, LDataTypeConfigs
from geoportal_app.models import User
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import Bundle
from main.decorators import ajax_required
from main.utils import send_email


def index(request):

    context = {
        'purchase': "purchase"
    }

    return render(request, 'payment/index.html', context)


@require_POST
@ajax_required
@login_required
def dictionaryRequest(request, payload):
    purchase_all = payload.get('purchase_all')
    # Хүсэлт илгээх xml датаг бэлтгэх
    mbutil = MBUtil(purchase_all['total_amount'], purchase_all['description'])
    finalRequest = mbutil.xmlConvert()
    # Банкруу хүсэлт илгээж байна.
    payReq = PaymentMethod(request, finalRequest)
    paymentRequest = payReq.paymentMethod()
    # Хүсэлт илгээж байна
    if not paymentRequest:
        return JsonResponse({'message': "Банкны сервертэй холбогдох үед алдаа гарлаа", "success": False})
    else:
        # Банкнаас ирсэн response шалгаж байна
        pay = PaymentMethodMB(paymentRequest, purchase_all['id'])
        message = pay.paymentMethodMB()

        if message:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False})


def dictionaryResponse(request):

    if request.method == 'GET':
        return JsonResponse({'success': True, 'xmlmsg': 12})


def _calc_layer_amount(area, area_type):
    if area_type == 'm':
        amount = area * Payment.POLYGON_PER_M_AMOUNT
    if area_type == 'km':
        amount = area * Payment.POLYGON_PER_KM_AMOUNT
    return amount


@require_POST
@ajax_required
@login_required
def purchaseDraw(request, payload):

    price = payload.get('price')
    description = payload.get('description')
    coodrinatLeftTop = payload.get('coodrinatLeftTop')
    coodrinatRightBottom = payload.get('coodrinatRightBottom')
    layer_ids = payload.get('layer_ids')
    bundle_id = payload.get('bundle_id')
    area = payload.get('area')
    area_type = payload.get('area_type')

    bundle = get_object_or_404(Bundle, pk=bundle_id)
    layers = get_list_or_404(WMSLayer, pk__in=layer_ids)
    with transaction.atomic():

        payment = Payment()
        payment.geo_unique_number = uuid.uuid4()
        payment.bank_unique_number = ' '
        payment.description = 'Хэсэгчлэн худалдаж авах хүсэлт'
        payment.user = request.user
        payment.bundle = bundle
        payment.kind = Payment.KIND_QPAY
        payment.total_amount = price
        payment.export_kind = Payment.EXPORT_KIND_POLYGON
        payment.is_success = False
        payment.message = 'Хэсэгчлэн худалдаж авах хүсэлт'
        payment.code = ''
        payment.save()

        payment_polygon = PaymentPolygon()
        payment_polygon.payment = payment
        payment_polygon.data_id = ''
        payment_polygon.pdf_id = ''
        payment_polygon.coodrinatLeftTopX = coodrinatLeftTop[0]
        payment_polygon.coodrinatLeftTopY = coodrinatLeftTop[1]
        payment_polygon.coodrinatRightBottomX = coodrinatRightBottom[0]
        payment_polygon.coodrinatRightBottomY = coodrinatRightBottom[1]
        payment_polygon.save()

        for layer in layers:
            layer_amount = _calc_layer_amount(area, area_type)
            payment_layer = PaymentLayer()
            payment_layer.payment = payment
            payment_layer.wms_layer = layer
            payment_layer.amount = layer_amount
            payment_layer.save()

    return JsonResponse({
        'success': True,
        'payment_id': payment.id,
        'msg': 'Амжилттай боллоо',
    })


def get_all_file_paths(directory):

    file_paths = []

    for root, directories, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(root, filename)
            file_paths.append(filepath)

    return file_paths


def get_all_file_remove(directory):

    file_paths = []

    for root, directories, files in os.walk(directory):
        for filename in files:
            if filename != 'export.zip':
                filepath = os.path.join(root, filename)
                os.remove(filepath)


def _create_shp_file(payment, layer, polygon):

    x1, y1 = polygon.coodrinatLeftTopX, polygon.coodrinatLeftTopY

    x2, y2 = polygon.coodrinatRightBottomX, polygon.coodrinatRightBottomY

    try:
        file_type = 'ESRI SHAPEFILE'
        path = os.path.join(settings.FILES_ROOT, 'shape', str(payment.id))
        if not os.path.isdir(path):
            os.mkdir(path)
        file_ext = '.shp'
        filename = os.path.join(path, str(layer.code) + file_ext)

        url = layer.wms.url
        url_service = 'SERVICE=WFS'
        url_version = 'VERSION=1.1.0'
        url_request = 'REQUEST=GetCapabilities'
        geoserver_layer = layer.code

        spat_srs = 'EPSG:4326'
        # source_srs = 'EPSG:32648'
        trans_srs = 'EPSG:4326'
        meta = 'ENCODING=UTF-8'
        command = subprocess.run([
            'ogr2ogr',
            '-f', file_type,
            filename,
            'WFS:' + url + '?&' + url_service + '&' + url_version + '&' + url_request,
            geoserver_layer,
            '-spat_srs', spat_srs,
            '-spat', str(x1), str(y1), str(x2), str(y2),
            '-lco', meta,
            # '-s_srs', source_srs,
            '-t_srs', trans_srs
        ])

    except Exception as e:
        print(e)


def _export_shp(payment):

    try:
        layers = PaymentLayer.objects.filter(payment=payment)
        polygon = PaymentPolygon.objects.filter(payment=payment).first()

        for layer in layers:
            _create_shp_file(payment, layer.wms_layer, polygon)

        path = os.path.join(settings.FILES_ROOT, 'shape', str(payment.id))

        file_paths = get_all_file_paths(path)
        zip_path = os.path.join(path, 'export.zip')
        with ZipFile(zip_path,'w') as zip:
            for file in file_paths:
                zip.write(file, os.path.basename(file))

        get_all_file_remove(path)
        payment.export_file = 'shape/' + str(payment.id) + '/export.zip'
        payment.save()

        return True

    except Exception as e:
        print(e)
        return False


@require_GET
@ajax_required
@login_required
def download_purchase(request, pk):
    payment = get_object_or_404(Payment, pk=pk, user=request.user, is_success=True)

    if payment.export_file:
        is_created = True
    else:
        is_created = _export_shp(payment)

        if is_created:

            subject = 'Худалдан авалт'
            msg = 'Дараах холбоос дээр дарж худалдан авсан бүтээгдэхүүнээ татаж авна уу! http://192.168.10.92/payment/history/api/details/{id}/'.format(id=payment.pk)
            to_email = [payment.user.email]

            send_email(subject, msg, to_email)

    rsp = {
        'success': is_created,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required
def test_payment(request, pk):

    payment = Payment.objects.filter(pk=pk, user=request.user).update(is_success=True)

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def purchaseFromCart(request, payload):

    datas = payload.get('data')
    code = payload.get('code')
    check_id = True
    while check_id:
        uniq_id = uuid.uuid4()
        if len(Payment.objects.filter(geo_unique_number=uniq_id)) == 0:
            check_id = False
        else:
            check_id = True

    user_id = request.user.id
    userList = User.objects.filter(id=user_id)
    for user in userList:
        userID = user.id
    amount = 1
    total_amount = 0
    try:
        payment = Payment.objects.create(
            geo_unique_number = uniq_id,
            bank_unique_number = ' ',
            description = 'Цэг худалдаж авах хүсэлт',
            user_id = userID,
            kind=2,
            total_amount=0,
            export_kind=1,
            is_success = False,
            message = 'Цэг худалдаж авах хүсэлт',
            code = '',
        )
        pay_id = payment.id
        check_id = True
        while check_id:
            uniq_id = uuid.uuid4()
            if payment.geo_unique_number == uniq_id:
                check_id = True
            else:
                check_id = False
        total_amount = 0
        for data in datas:
            dId = data['id']
            if pay_id > 0:
                mpoint = Mpoint_view.objects.using('postgis_db').filter(id=dId).first()
                amount=0
                if dId:
                    wms_layer = WMSLayer.objects.filter(code=code).first()
                    if wms_layer:
                        amount = wms_layer.feature_price

                total_amount = total_amount + amount
                pdf_id = ''
                point_name = 'Нэр алга'
                if mpoint:
                    if mpoint.pid:
                        pdf_id = mpoint.pid
                    if mpoint.point_name:
                        point_name = mpoint.point_name
                point = PaymentPoint.objects.create(
                    payment_id = pay_id,
                    point_id = dId,
                    point_name = point_name,
                    amount = amount,
                    pdf_id = pdf_id,
                )
            else:
                rsp = {
                    'success': False,
                    'msg': "Амжилтгүй"
                }
                return JsonResponse(rsp)
        Payment.objects.filter(id=pay_id).update(total_amount=total_amount)
    except Exception:
        rsp = {
            'success': False,
            'msg': 'Алдаа гарсан байна'
        }
        return JsonResponse(rsp)

    rsp = {
        'success': True,
        'msg': 'Амжилттай боллоо',
        'payment': pay_id
    }
    return JsonResponse(rsp)


@require_GET
@login_required
def download_pdf(request, pk):
    mpoint = Mpoint_view.objects.using('postgis_db').filter(pid=pk).first()
    if mpoint:
        point = PaymentPoint.objects.filter(point_id=mpoint.id).first()
        if point:
            payment = get_object_or_404(Payment, user=request.user, id=point.payment_id, is_success=True)
            # generate the file
            file_name = pk + '.pdf'
            src_file = os.path.join(settings.FILES_ROOT, 'tseg-personal-file', file_name)
            response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename=file_name)
            return response
        else:
            raise Http404
    else:
        raise Http404


@require_GET
@login_required
def download_zip(request, pk):
    payment = get_object_or_404(Payment, user=request.user, pk=pk)
    # generate the file
    src_file = os.path.join(settings.FILES_ROOT, 'shape', str(payment.id), 'export.zip')
    response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename="export.zip")
    return response


def _lfeature_config(feature_id):
    all_count = 0
    f_configs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    for f_config in f_configs:
        data_type_id = f_config.data_type_id
        connect_feature_id = f_config.connect_feature_id
        if data_type_id is not None:
            prop_count = _data_type_configs(data_type_id)
            all_count += prop_count
        else:
            connect_features = LFeatureConfigs.objects.filter(feature_id=connect_feature_id)
            for connect_feature in connect_features:
                connected_feature_id = connect_feature.connect_feature_id
                fc_data_type_id = connect_feature.data_type_id
                if fc_data_type_id is not None:
                    prop_count = _data_type_configs(fc_data_type_id)
                    all_count += prop_count
        if data_type_id is None and connect_feature_id is None:
            prop_count = _data_type_configs(data_type_id)
            all_count += prop_count
    return all_count


def _data_type_configs(data_type_id):
    property_len = LDataTypeConfigs.objects.filter(data_type_id=data_type_id).count()
    return property_len


def _get_key_and_compare(dict, item):
    for key in dict.keys():
        if key == item:
            return key


def _get_all_property_count(layer_list, feature_info_list):
    count = 0
    for code in layer_list:
        for feature in feature_info_list:
            key = _get_key_and_compare(feature, code)
            if key:
                for info in feature[key]:
                    fconfig_count = _lfeature_config(info['feature_id'])
                    count += fconfig_count
    return count


def _calc_per_price(area, area_type, layer_length, all_len_property, len_object_in_layer):
    amount = None
    if area_type == 'km':
        amount = Payment.POLYGON_PER_KM_AMOUNT
    if area_type == 'm':
        amount = Payment.POLYGON_PER_M_AMOUNT
    price = (((area * amount) + (all_len_property * Payment.PROPERTY_PER_AMOUNT)) * layer_length) * len_object_in_layer
    return price


@require_POST
@ajax_required
def calcPrice(request, payload):
    area = payload.get('area')
    layer_list = payload.get("layer_list")
    feature_info_list = payload.get("feature_info_list")
    area_type = area['type']
    area = area['output']

    is_user = request.user
    if str(is_user) != 'AnonymousUser':
        is_user = True
    else:
        is_user = False

    all_len_property = _get_all_property_count(layer_list, feature_info_list)
    total_price = _calc_per_price(area, area_type, len(layer_list), all_len_property, len(feature_info_list))

    rsp = {
        'success': True,
        'total_price': total_price,
        'is_user': is_user,
    }
    return JsonResponse(rsp)