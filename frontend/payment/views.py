from zipfile import ZipFile
import os
import io
import PIL.Image as Image
import urllib.request
import uuid
import json
import subprocess
from fpdf import FPDF
from datetime import date
import urllib.request

from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse, Http404
from django.shortcuts import get_object_or_404, get_list_or_404, reverse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET
from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB
from govorg.backend.forms.models import Mpoint_view
from backend.payment.models import Payment, PaymentPoint, PaymentPolygon, PaymentLayer
from backend.inspire.models import (
    LThemes, LFeatureConfigs,
    LDataTypeConfigs, LProperties,
    LValueTypes, LCodeListConfigs,
    LCodeLists, LFeatures, LPackages,
    MDatasBoundary, MDatasHydrography,
    MDatasBuilding, MDatasGeographical,
    MDatasGeographical, MDatasCadastral,
)
from geoportal_app.models import User
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import Bundle
from main.decorators import ajax_required
from main.utils import send_email

from django.contrib.gis.gdal import DataSource


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
    amount = 0
    if area_type == 'm':
        amount = Payment.POLYGON_PER_M_AMOUNT
    if area_type == 'km':
        amount = Payment.POLYGON_PER_KM_AMOUNT
    amount = area * amount
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
    feature_info_list = payload.get('feature_info_list')

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


def _lfeatureconfig(feature_id, table_name, path, saved_fields):
    feature_configs_name = []
    f_configs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    for f_config in f_configs:
        data_type_id = f_config.data_type_id
        connect_feature_id = f_config.connect_feature_id
        if data_type_id is not None:
            feature_configs_name.append({
                'data_types': _get_property_names(data_type_id, table_name, path, saved_fields)
            })
        else:
            connect_features = LFeatureConfigs.objects.filter(feature_id=connect_feature_id)
            for connect_feature in connect_features:
                connected_feature_id = connect_feature.connect_feature_id
                fc_data_type_id = connect_feature.data_type_id
                if fc_data_type_id is not None:
                    feature_configs_name.append({
                        'data_types': _get_property_names(fc_data_type_id, table_name, path, saved_fields)
                    })
        if data_type_id is None and connect_feature_id is None:
            feature_configs_name.append({
                'data_types': _get_property_names(data_type_id, table_name, path, saved_fields)
            })
    return feature_configs_name


def _get_property_names(data_type_id, table_name, path, saved_fields):
    property_names = []
    is_saved_field = True
    data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=data_type_id)
    if data_type_configs:
        for data_type_config in data_type_configs:
            property_id = data_type_config.property_id
            properties = LProperties.objects.filter(property_id=property_id)
            if properties:
                for prop in properties:
                    property_code = prop.property_code
                    property_names.append({
                        'property_code': prop.property_code,
                        'property_name': prop.property_name,
                        'property_id': prop.property_id,
                        'value_types': _value_types(prop.value_type_id, property_id),
                    })
                    if table_name and saved_fields:
                        for saved_field in saved_fields:
                            if saved_field in property_code.lower():
                                is_saved_field = False
                        if is_saved_field:
                            subprocess.run([
                                'ogrinfo',
                                path,
                                '-sql',
                                "ALTER TABLE " + table_name + " ADD COLUMN " + property_code + " " + 'VARCHAR(100)',
                            ])
                    is_saved_field = True
    return property_names


def _value_types(value_type_id, property_id):
    value_type_names = []
    codelists = []
    value_types = LValueTypes.objects.filter(value_type_id=value_type_id)
    if value_types:
        for value_type in value_types:
            value_type_names.append({
                'value_type_id': value_type.value_type_id,
            })
    return value_type_names

def _get_datas_model(theme_code):
    if theme_code == 'hg':
        return MDatasHydrography
    elif theme_code == 'au':
        return MDatasBoundary
    elif theme_code =='bu':
        return MDatasBuilding
    elif theme_code=='gn':
        return MDatasGeographical
    elif theme_code=='cp':
        return MDatasCadastral


def _get_theme_code(feature_id):
    package_id = get_object_or_404(LFeatures, feature_id=feature_id).package_id
    theme_id = get_object_or_404(LPackages, package_id=package_id).theme_id
    theme_code = get_object_or_404(LThemes, theme_id=theme_id).theme_code
    return theme_code


def _get_code_list_name(code_list_id):
    code_list_name = None
    code_list = LCodeLists.objects.filter(code_list_id=code_list_id)
    if code_list:
        code_list_name = code_list.first().code_list_name
    return code_list_name


def _create_field_and_insert_to_shp(feature_infos, feature_id, geo_id, path, gml_id, table_name):
    theme_code = _get_theme_code(feature_id)
    MDatasModel = _get_datas_model(theme_code)
    att_type = ''
    for info in feature_infos:
        for property in info['data_types']:
            property_code = property['property_code']
            mdata_value = MDatasModel.objects.filter(geo_id=geo_id, property_id=property['property_id'])
            if mdata_value:
                mdata_value = mdata_value.first()
            for value_type in property['value_types']:
                value_type = value_type['value_type_id']
                if value_type == 'double':
                    value_type = 'number'
                if value_type == 'single-select':
                    value_type = 'code_list_id'

            if 'code' in value_type:
                filter_value = value_type
            else:
                filter_value = "value_" + value_type

            value = getattr(mdata_value, filter_value)

            if filter_value == 'value_date' and value:
                value = value.strftime('%m/%d/%Y, %H:%M:%S')
            if filter_value == 'value_number' and value:
                value = str(value)
            if 'code_list' in filter_value and value:
                value = _get_code_list_name(value)
            if value:
                subprocess.run([
                    'ogrinfo',
                    path,
                    '-dialect', 'SQLite',
                    '-sql', "UPDATE '" + table_name + "' SET " + property_code[0:10] + "='" + value + "' WHERE gml_id='" + gml_id + "'"
                ])


def _update_and_add_column_with_value(path, file_name):
    path = os.path.join(path, file_name)
    ds = DataSource(str(path))

    lyr = ds[0]
    before_feature_id = 0
    feature_id = 0
    feature_infos = None
    table_name = file_name.split(".")[0]

    for val in lyr:
        for field in lyr.fields:
            if field == 'feature_id':
                feature_id = val.get(field)
            if field == 'gml_id':
                gml_id = val.get(field)
                if gml_id:
                    list = gml_id.split(".")
                    geo_id = list[len(list) - 1]
        if before_feature_id != feature_id:
            feature_infos = _lfeatureconfig(feature_id, table_name, path, lyr.fields)
        if geo_id and feature_id:
            _create_field_and_insert_to_shp(feature_infos, feature_id, geo_id, path, gml_id, table_name)
            geo_id = None

        before_feature_id = feature_id

    return True


def _create_folder_payment_id(type, payment_id):
    path = os.path.join(settings.FILES_ROOT, type, str(payment_id))
    if not os.path.isdir(path):
        os.mkdir(path)


def _create_shp_file(payment, layer, polygon):

    x1, y1 = polygon.coodrinatLeftTopX, polygon.coodrinatLeftTopY

    x2, y2 = polygon.coodrinatRightBottomX, polygon.coodrinatRightBottomY

    try:
        file_type = 'ESRI SHAPEFILE'
        _create_folder_payment_id('shape', payment.id)
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
            '-t_srs', trans_srs,
            '-skipfailures'
        ])
        _update_and_add_column_with_value(path, str(layer.code) + file_ext)

    except Exception as e:
        print(e)


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


def _file_to_zip(payment_id, folder_name):
    try:
        path = os.path.join(settings.FILES_ROOT, folder_name, payment_id)
        file_paths = get_all_file_paths(path)
        zip_path = os.path.join(path, 'export.zip')
        with ZipFile(zip_path,'w') as zip:
            for file in file_paths:
                zip.write(file, os.path.basename(file))

        get_all_file_remove(path)
    except Exception as e:
        print(e)


def _export_shp(payment):

    try:
        layers = PaymentLayer.objects.filter(payment=payment)
        polygon = PaymentPolygon.objects.filter(payment=payment).first()

        for layer in layers:
            _create_shp_file(payment, layer.wms_layer, polygon)

        _file_to_zip(str(payment.id), 'shape')
        payment.export_file = 'shape/' + str(payment.id) + '/export.zip'
        payment.save()

        return True

    except Exception as e:
        print(e)
        return False

def _create_image_file(payment, layer, polygon, download_type):
    geoserver_layer = layer.wms_layer.code

    x1, y1 = polygon.coodrinatLeftTopX, polygon.coodrinatLeftTopY

    x2, y2 = polygon.coodrinatRightBottomX, polygon.coodrinatRightBottomY

    if x1 > x2:
        save_x = x1
        x1 = x2
        x2 = save_x
    if y1 > y2:
        save_y = y1
        y1 = y2
        y2 = save_y

    path = os.path.join(settings.FILES_ROOT, 'image', str(payment.id))
    if not os.path.isdir(path):
        os.mkdir(path)
    file_ext = '.' + download_type
    filename = os.path.join(path, str(geoserver_layer) + file_ext)

    url = layer.wms_layer.wms.url
    url_service = 'SERVICE=WMS'
    url_version = 'VERSION=1.1.0'
    url_request = 'REQUEST=GetMap'
    url_format = 'FORMAT=image/' + download_type
    url_transparent = 'TRANSPARENT=true'
    url_width = 'WIDTH=464'
    url_height = 'HEIGHT=768'
    url_layers = 'LAYERS=' + geoserver_layer
    url_bbox = 'BBOX=' + str(x1) + ',' + str(y1) + ',' + str(x2) + ',' + str(y2) + ',urn:ogc:def:crs:EPSG:4326'

    fullurl = url + '?' + url_service + '&' + url_version + '&' + url_request + '&' + url_format + '&' + url_transparent + '&' + url_width + '&' + url_height + '&' + url_bbox + '&' + url_layers

    with urllib.request.urlopen(fullurl) as response:
        image_byte = response.read()
    bytes = bytearray(image_byte)
    image = Image.open(io.BytesIO(bytes))
    image.save(os.path.join(settings.FILES_ROOT, 'image', str(payment.id), geoserver_layer + file_ext))

def _export_image(payment, download_type):

    try:
        layers = PaymentLayer.objects.filter(payment=payment)
        polygon = PaymentPolygon.objects.filter(payment=payment).first()

        for layer in layers:
            _create_image_file(payment, layer, polygon, download_type)

        _file_to_zip(str(payment.id), 'image')
        payment.export_file = 'image/' + str(payment.id) + '/export.zip'
        payment.save()
        return True

    except Exception as e:
        print(e)
        return False

def _get_Feature_info_from_url(polygon, layer):
    info = []
    x1, y1 = polygon.coodrinatLeftTopX, polygon.coodrinatLeftTopY
    x2, y2 = polygon.coodrinatRightBottomX, polygon.coodrinatRightBottomY
    if x1 > x2:
        save_x = x1
        x1 = x2
        x2 = save_x
    if y1 > y2:
        save_y = y1
        y1 = y2
        y2 = save_y

    url = layer.wms_layer.wms.url
    if not '?' in url:
        url = url + "?"
    service = 'WFS'
    version = '1.1.0'
    request = 'GetFeature'
    code = layer.wms_layer.code
    trans_srs = 'EPSG:4326'
    property_name = 'feature_id'
    out_format = 'JSON'

    full_url =  url + 'service=' + service + '&version=' + version + '&request=' +request + '&typeName=' + code + '&bbox=' + str(x1) +  ',' + str(y1)  + ',' + str(x2) + ',' + str(y2) + ',' + trans_srs + '&PropertyName=' + property_name + '&outputFormat=' + out_format
    with urllib.request.urlopen(full_url) as response:
        get_features = response.read().decode("utf-8")
        for feature in json.loads(get_features)['features']:
            geo_id = feature['id']
            geo_id = geo_id.split('.')[len(geo_id.split('.')) - 1]
            feature_id = feature['properties']['feature_id']
            info.append({
                'geo_id': geo_id,
                'feature_id': feature_id,
            })

    return info


def _get_pdf_info_from_inspire(payment, layer, polygon):
    prev_feature_id = 0
    infos = []
    feature_infos = _get_Feature_info_from_url(polygon, layer)
    for feature_info in feature_infos:
        att_type = ''
        feature_id = feature_info['feature_id']
        geo_id = feature_info['geo_id']
        for_pdf_info = []
        if feature_id != prev_feature_id:
            lfeatures = _lfeatureconfig(feature_id, None, None, None)
            theme_code = _get_theme_code(feature_id)
            MDatasModel = _get_datas_model(theme_code)
        for info in lfeatures:
            for property in info['data_types']:
                property_code = property['property_code']
                property_name = property['property_name']
                mdata_value = MDatasModel.objects.filter(geo_id=geo_id, property_id=property['property_id'])
                if mdata_value:
                    mdata_value = mdata_value.first()
                    for value_type in property['value_types']:
                        value_type = value_type['value_type_id']
                        if value_type == 'double':
                            value_type = 'number'
                        if value_type == 'single-select':
                            value_type = 'code_list_id'

                    if 'code' in value_type:
                        filter_value = value_type
                    else:
                        filter_value = "value_" + value_type
                    if getattr(mdata_value, filter_value):
                        value = getattr(mdata_value, filter_value)
                    else:
                        value = None

                    if filter_value == 'value_date' and value:
                        value = value.strftime('%m/%d/%Y, %H:%M:%S')
                    if filter_value == 'value_number' and value:
                        value = str(value)
                    if 'code_list' in filter_value and value:
                        value = _get_code_list_name(value)
                    for_pdf_info.append({
                        'property_name': property_name,
                        'value': value,
                    })
        infos.append({
            'geo_id': geo_id,
            'for_pdf_info': for_pdf_info
        })
        prev_feature_id = feature_id
    return infos


def _create_pdf(payment, download_type, payment_id, layer_code, infos):
    path_with_file_name = os.path.join(settings.FILES_ROOT, download_type, str(payment_id), str(layer_code) + '.' + download_type)

    class PDF(FPDF):
        def header(self):
            self.set_font('Arial', '', 8)
            self.cell(10, 10, date.today().strftime("%Y-%m-%d"))
            self.add_font('DejaVu', '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
            self.image(os.path.join(settings.STATIC_ROOT, 'assets', 'image', 'logo', 'logo-2.png'), 180, 8, 15)
            self.set_font('DejaVu', '', 15)
            title = "Хэсэгчлэн худалдан авалт"
            self.cell(50)
            self.cell(20, 10, title, 0, 2, 'D')
            self.ln(5)

        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, 'Page %s' % self.page_no(), 0, 0, 'C')

    pdf = PDF()
    pdf.add_page()
    pdf.add_font('DejaVu', '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
    pdf.set_font('DejaVu', '', 10)
    for info in infos:
        pdf.set_font('DejaVu', '', 15)
        pdf.cell(10, 8, info['geo_id'])
        pdf.ln(5)
        for property in info['for_pdf_info']:
            pdf.set_font('DejaVu', '', 10)
            pdf.cell(10, 8, property['property_name'])
            if property['value']:
                value = property['value']
            else:
                value = 'Хоосон'
            pdf.cell(40)
            pdf.cell(10, 8, value)
            pdf.ln(5)
        pdf.ln(5)
    pdf.output(path_with_file_name, 'F')
    return path_with_file_name


def _export_pdf(payment, download_type):
    layers = PaymentLayer.objects.filter(payment=payment)
    polygon = PaymentPolygon.objects.filter(payment=payment).first()
    payment_id = payment.id

    for layer in layers:
        infos = _get_pdf_info_from_inspire(payment, layer, polygon)
        _create_folder_payment_id(download_type, payment_id)
        path = _create_pdf(payment, download_type, payment_id, layer.wms_layer.code, infos)

    _file_to_zip(str(payment.id), download_type)
    payment.export_file = download_type + '/' + str(payment.id) + '/export.zip'
    payment.save()
    return True


@require_GET
@ajax_required
@login_required
def download_purchase(request, pk, download_type):
    Payment.objects.filter(user=request.user, pk=pk).update(is_success=True) # arilgah code
    payment = get_object_or_404(Payment, pk=pk, user=request.user, is_success=True)
    is_created = False
    if payment.export_file:
        is_created = True
    else:
        if download_type == 'shp':
            is_created = _export_shp(payment)

        if download_type == 'jpeg' or download_type == 'png' or download_type == 'tiff':
            is_created = _export_image(payment, download_type)

        if download_type == 'pdf':
            is_created = _export_pdf(payment, download_type)

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
    src_file = os.path.join(settings.FILES_ROOT, payment.export_file)
    response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename="export.zip")
    return response


def _lfeature_config_count(feature_id):
    all_count = 0
    f_configs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    for f_config in f_configs:
        data_type_id = f_config.data_type_id
        connect_feature_id = f_config.connect_feature_id
        if data_type_id is not None:
            prop_count = _data_type_configs_count(data_type_id)
            all_count += prop_count
        else:
            connect_features = LFeatureConfigs.objects.filter(feature_id=connect_feature_id)
            for connect_feature in connect_features:
                connected_feature_id = connect_feature.connect_feature_id
                fc_data_type_id = connect_feature.data_type_id
                if fc_data_type_id is not None:
                    prop_count = _data_type_configs_count(fc_data_type_id)
                    all_count += prop_count
        if data_type_id is None and connect_feature_id is None:
            prop_count = _data_type_configs_count(data_type_id)
            all_count += prop_count
    return all_count


def _data_type_configs_count(data_type_id):
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
                    fconfig_count = _lfeature_config_count(info['feature_id'])
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