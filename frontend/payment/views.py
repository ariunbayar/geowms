from zipfile import ZipFile
import os
import io
import PIL.Image as Image
import urllib.request
import uuid
import json
import math
import subprocess
from fpdf import FPDF
from datetime import date
import urllib.request
import glob

from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import Point
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
import csv


def index(request):

    context = {
        'purchase': "purchase"
    }

    return render(request, 'payment/index.html', context)


def _get_key_and_compare(dict, item):
    value = ''
    for key in dict.keys():
        if key == item:
            value = key
    return value


def _lat_long_to_utm(lat, longi):
    point = Point([lat, longi], srid=4326)
    utm = point.transform(3857, clone=True)
    return utm.coords


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


def _calc_layer_amount(area, area_type, len_object_in_layer):
    amount = 0
    if area_type == 'm':
        amount = Payment.POLYGON_PER_M_AMOUNT
    if area_type == 'km':
        amount = Payment.POLYGON_PER_KM_AMOUNT
    amount = (area * amount) * len_object_in_layer
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
            payment_layer = PaymentLayer()
            payment_layer.payment = payment
            payment_layer.wms_layer = layer
            payment_layer.amount = _calc_layer_amount(area, area_type, len(feature_info_list))
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


def _create_folder_payment_id(folder_name, payment_id):
    path = os.path.join(settings.FILES_ROOT, folder_name, str(payment_id))
    if not os.path.isdir(path):
        os.mkdir(path)
    return path


def _create_shp_file(payment, layer, polygon):

    x1, y1 = polygon.coodrinatLeftTopX, polygon.coodrinatLeftTopY

    x2, y2 = polygon.coodrinatRightBottomX, polygon.coodrinatRightBottomY

    try:
        file_type = 'ESRI SHAPEFILE'
        path = _create_folder_payment_id('shape', payment.id)
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
                if folder_name == 'pdf':
                    if not '.jpeg' in str(file):
                        zip.write(file, os.path.basename(file))
                else:
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


def _get_size_from_extent(x1, y1, x2, y2):
    y = y2 - y1
    x = x2 - x1
    if y > x:
        width = 480
        height = 720
        orientation = 'Portrait'
    if x > y:
        width = 720
        height = 480
        orientation = 'Landscape'

    return {'height': str(height), 'width': str(width), 'orientation': orientation}


def _create_image_file(payment, layer, polygon, download_type, folder_name):
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

    size = _get_size_from_extent(x1, y1, x2, y2)


    path = _create_folder_payment_id(folder_name, payment.id)

    file_ext = '.' + download_type
    filename = os.path.join(path, str(geoserver_layer) + file_ext)

    url = layer.wms_layer.wms.url
    url_service = 'SERVICE=WMS'
    url_version = 'VERSION=1.1.0'
    url_request = 'REQUEST=GetMap'
    url_format = 'FORMAT=image/' + download_type
    url_transparent = 'TRANSPARENT=true'
    url_width = 'WIDTH=' + size['width']
    url_height = 'HEIGHT=' + size['height']
    url_layers = 'LAYERS=' + geoserver_layer
    url_bbox = 'BBOX=' + str(x1) + ',' + str(y1) + ',' + str(x2) + ',' + str(y2) + ',urn:ogc:def:crs:EPSG:4326'

    fullurl = url + '?' + url_service + '&' + url_version + '&' + url_request + '&' + url_format + '&' + url_transparent + '&' + url_width + '&' + url_height + '&' + url_bbox + '&' + url_layers

    with urllib.request.urlopen(fullurl) as response:
        image_byte = response.read()

    bytes = bytearray(image_byte)
    image = Image.open(io.BytesIO(bytes))
    image.save(os.path.join(settings.FILES_ROOT, folder_name, str(payment.id), geoserver_layer + file_ext))

    return {'success': True, 'orientation': size['orientation']}


def _export_image(payment, download_type):

    try:
        layers = PaymentLayer.objects.filter(payment=payment)
        polygon = PaymentPolygon.objects.filter(payment=payment).first()
        folder_name = 'image'

        for layer in layers:
            _create_image_file(payment, layer, polygon, download_type, folder_name)

        _file_to_zip(str(payment.id), folder_name)
        payment.export_file = folder_name + '/' + str(payment.id) + '/export.zip'
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


def _table_json():
    table_col = [
        {
            'width': 10,
            'head_name': 'Д/д',
            'body_name': '',
        },
        {
            'width': 30,
            'head_name': 'Аймгийн нэр',
            'body_name': 'aimag',
        },
        {
            'width': 30,
            'head_name': 'Сумын нэр',
            'body_name': 'sum',
        },
        {
            'width': 30,
            'head_name': 'Цэгийн дугаар',
            'body_name': 'point_id',
        },
        {
            'width': 30,
            'head_name': 'Өргөрөг',
            'body_name': 'sheet2',
        },
        {
            'width': 30,
            'head_name': 'Уртраг',
            'body_name': 'sheet3',
        },
        {
            'width': 30,
            'head_name': 'N_UTM',
            'body_name': 'n_utm',
        },
        {
            'width': 30,
            'head_name': 'E_UTM',
            'body_name': 'e_utm',
        },
        {
            'width': 20,
            'head_name': 'Өндөр',
            'body_name': 'ondor',
        },
    ]
    return table_col


def _text_with_zuruunees_ondor_oloh(idx, point_infos, cell_height, table_col, pdf):
    this_columns = []
    max_height = 0
    for row in range(0, len(table_col)):
        if row != 0:
            cell_width = table_col[row]['width']
            cell_text = str(point_infos[idx][table_col[row]['body_name']])
            zuruu = math.floor(pdf.get_string_width(cell_text) / cell_width)
            if zuruu >= 1:
                max_height = cell_height * (zuruu + 1)
    if max_height < cell_height:
        max_height = cell_height
    return max_height


def _remove_white_spaces(class_name):
    updated_class_name = ''
    class_per_name = class_name.split(" ")
    for per_name in class_per_name:
        if per_name:
            updated_class_name += per_name + ' '
    return updated_class_name[:-1]


def _create_lavlagaa_file(class_infos, path):
    table_col = _table_json()
    point_infos = class_infos['infos']
    class PDF(FPDF):
        def footer(self):
            self.set_y(-15)
            self.add_font(font_name, '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
            self.set_font(font_name, '', 8)
            self.set_x(-40)
            self.cell(0, 8, 'Геопортал', 0, 0, 'C')

        def table_header(self):
            pdf.cell(30)

            pdf.set_font(font_name, '', 11)
            for col in range(0, len(table_col)):
                pdf.cell(table_col[col]['width'], 10, str(table_col[col]['head_name']), 1, 0, 'C')

            pdf.ln()

    pdf = PDF()
    pdf.add_page(orientation='Landscape')
    pdf.image(os.path.join(settings.STATIC_ROOT, 'assets', 'image', 'logo', 'gzbgzzg-logo.jpg'), x=25, y=8, w=37, h=40)
    org_name = class_infos['org_name']
    class_name = _remove_white_spaces(class_infos['class_name'])
    font_name = 'DejaVu'

    pdf.add_font(font_name, '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
    pdf.set_font(font_name, '', 15)
    pdf.cell(0, 8, org_name, 0, 2, 'C')
    pdf.set_font(font_name, '', 5)
    pdf.cell(0, 2, '( ААН-ын нэр )', 0, 2, 'C')

    pdf.ln(10)

    pdf.set_font(font_name, '', 15)
    pdf.cell(0, 8, class_name, 0, 2, 'C')
    pdf.set_font(font_name, '', 5)
    pdf.cell(0, 4, '( мэдээллийн утга )', 0, 2, 'C')

    pdf.ln(5)

    pdf.set_font('Arial', '', 10)
    pdf.set_x(-40)
    pdf.cell(10, 10, date.today().strftime("%Y-%m-%d"))

    pdf.ln(20)
    pdf.table_header()

    end_y = 0
    for idx in range(0, len(point_infos)):
        pdf.cell(30)
        pdf.set_font(font_name, '', 9)
        current_x = pdf.get_x()
        current_y = pdf.get_y()
        cell_height = 5
        calc_cell_height = _text_with_zuruunees_ondor_oloh(idx, point_infos, cell_height, table_col, pdf)
        for row in range(0, len(table_col)):
            cell_width = table_col[row]['width']
            if row == 0:
                pdf.cell(cell_width, calc_cell_height, str(idx + 1), 1, 0, 'C')
                end_y = pdf.get_y()
            else:
                before_cell_width = table_col[row - 1]['width']
                current_x = current_x + before_cell_width
                pdf.set_xy(current_x, current_y)
                cell_text = str(point_infos[idx][table_col[row]['body_name']])

                zuruu = math.floor(pdf.get_string_width(cell_text) / cell_width)
                if zuruu >= 1:
                    pdf.multi_cell(cell_width, cell_height, cell_text, 1, 'C', False)
                else:
                    pdf.cell(cell_width, calc_cell_height, cell_text, 1, 0, 'C', False)

            if pdf.get_y() > end_y:
                end_y = pdf.get_y()
        pdf.set_y(end_y)
        if calc_cell_height == cell_height:
            pdf.ln()

    file_name = class_infos['t_type'] + "_" + class_infos['org_name']
    file_ext = 'pdf'
    pdf.output(os.path.join(path, file_name + "." + file_ext), 'F')


def _list_items(point_info):
    infos = {
        'point_id': point_info['point_id'],
        'ondor': point_info['ondor'],
        'aimag': point_info['aimag'],
        'sum': point_info['sum'],
        'sheet2': point_info['sheet2'],
        'sheet3': point_info['sheet3'],
        'n_utm': point_info['n_utm'],
        'e_utm': point_info['e_utm']
    }
    return infos


def _append_to_item_with_check(class_names, point_info, before_org_name, pdf):
    org_name = point_info['org_name']
    for class_name in class_names:
        if class_name['t_type'] == point_info['t_type'] and org_name == class_name['org_name']:
            if class_name['pdf_id'] != pdf:
                class_name['infos'].append(_list_items(point_info))
        else:
            class_names.append({
                't_type': point_info['t_type'],
                'org_name': org_name,
                'class_name': point_info['class_name'],
                'pdf_id': point_info['pdf_id'],
                'infos': [_list_items(point_info)]
            })
    return class_names


def _class_name_eer_angilah(point_infos):
    class_names = []
    t_type = ''
    before_org_name = None
    for point_info in point_infos:
        org_name = point_info['org_name']
        if not class_names and org_name != before_org_name:
            class_names.append({
                't_type': point_info['t_type'],
                'org_name': org_name,
                'class_name': point_info['class_name'],
                'pdf_id': point_info['pdf_id'],
                'infos': [_list_items(point_info)]
            })
        else:
            class_names = _append_to_item_with_check(class_names, point_info, before_org_name, point_info['pdf_id'])
        t_type = point_info['t_type']
        before_org_name = org_name
    return class_names


def _get_attribute_name_from_file(content):
    att = {}
    for idx in range(0, len(content)):
        if content[idx].lower() == 'aimag':
            att['aimag'] = idx
        if content[idx].lower() == 'sum':
            att['sum_name'] = idx
        if content[idx].lower() == 'point_name':
            att['point_name'] = idx
        if content[idx].lower() == 'pid':
            att['pid'] = idx
        if content[idx].lower() == 'l_degree':
            att['x'] = idx
        if content[idx].lower() == 'b_degree':
            att['y'] = idx
        if content[idx].lower() == 'ondor':
            att['ondor'] = idx
        if content[idx].lower() == 'n_utm':
            att['n_utm'] = idx
        if content[idx].lower() == 'e_utm':
            att['e_utm'] = idx
        if content[idx].lower() == 'org_name':
            att['org_name'] = idx
    return att


def _get_info_from_file(get_type, mpoint, pdf_id):
    found_items = []
    file_list = [f for f in glob.glob(os.path.join(settings.FILES_ROOT, "*.csv"))]
    for a_file in file_list:
        with open(a_file, 'rt') as f:
            contents = csv.reader(f)
            contents = list(contents)
            for idx in range(0, len(contents)):
                if idx == 0:
                    att_names = _get_attribute_name_from_file(contents[idx])
                else:
                    content = contents[idx]
                    # check_pdf_path = '/home/odk/Desktop/pdfs/tseg-personal-file'
                    if str(content[att_names['pid']]) == str(pdf_id):
                        if not get_type:
                            found_items.append(_get_items_with_file(content, mpoint, att_names))
    return found_items


def _get_items_with_file(content, mpoint, att_names):
    point_info = {
        'point_id': content[att_names['point_name']],
        'ondor': content[att_names['ondor']],
        'aimag': content[att_names['aimag']],
        'sum': content[att_names['sum_name']],
        'sheet2': content[att_names['x']],
        'sheet3': content[att_names['y']],
        'n_utm': content[att_names['n_utm']],
        'e_utm': content[att_names['e_utm']],
        't_type': mpoint.t_type,
        'class_name': mpoint.point_class_name,
        'pdf_id': content[att_names['pid']],
        'org_name': content[att_names['org_name']] if _get_key_and_compare(att_names, 'org_name') else 'Геопортал',
    }
    return point_info


def _get_item_from_mpoint_view(mpoint):
    utm = _lat_long_to_utm(mpoint.sheet2, mpoint.sheet3)
    point_info = {
        'point_id': mpoint.point_name,
        'ondor': mpoint.ondor,
        'aimag': mpoint.aimag,
        'sum': mpoint.sum,
        'sheet2': mpoint.sheet2,
        'sheet3': mpoint.sheet3,
        'n_utm': utm[0],
        'e_utm': utm[1],
        't_type': mpoint.t_type,
        'class_name': mpoint.point_class_name,
        'pdf_id': mpoint.pid,
        'org_name': mpoint.org_name if hasattr(mpoint, 'org_name') else 'Геопортал',
    }
    return point_info


def _create_lavlagaa_infos(payment):
    point_infos = []
    points = PaymentPoint.objects.filter(payment=payment)
    for point in points:
        if point.pdf_id:
            mpoint = Mpoint_view.objects.using('postgis_db').filter(pid=point.pdf_id).first()
            if mpoint:
                infos = _get_info_from_file(None, mpoint, point.pdf_id)
                if infos:
                    for info in infos:
                        point_infos.append(info)
                else:
                    info = _get_item_from_mpoint_view(mpoint)
                    point_infos.append(info)

    folder_name = 'tseg-personal-file'
    class_names = _class_name_eer_angilah(point_infos)
    for class_name in class_names:
        if class_name['org_name']:
            path = _create_folder_payment_id(folder_name, payment.id)
            _create_lavlagaa_file(class_name, path)

    _file_to_zip(str(payment.id), folder_name)
    payment.export_file = folder_name + '/' + str(payment.id) + '/export.zip'
    payment.save()
    return True


def _create_pdf(download_type, payment_id, layer_code, infos, image_name, folder_name, orientation):
    path_with_file_name = os.path.join(settings.FILES_ROOT, download_type, str(payment_id), str(layer_code) + '.' + download_type)

    class PDF(FPDF):
        def header(self):
            self.set_font('Arial', '', 8)
            self.cell(10, 10, date.today().strftime("%Y-%m-%d"))
            self.add_font('DejaVu', '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
            self.set_font('DejaVu', '', 15)
            title = "Хэсэгчлэн худалдан авалт"
            self.cell(0, 10, title, 0, 2, 'C')
            self.set_x(-30)
            self.image(os.path.join(settings.STATIC_ROOT, 'assets', 'image', 'logo', 'logo-2.png'), y=5, w=25, h=20)
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

    pdf.add_page(orientation=orientation)
    pdf.image(os.path.join(settings.FILES_ROOT, folder_name, str(payment_id), image_name), x=20, y=28, w=0, h=0)

    pdf.output(path_with_file_name, 'F')
    return path_with_file_name


def _export_pdf(payment, download_type):
    layers = PaymentLayer.objects.filter(payment=payment)
    polygon = PaymentPolygon.objects.filter(payment=payment).first()
    payment_id = payment.id

    image_ext = 'jpeg'
    folder_name = download_type

    for layer in layers:
        infos = _get_pdf_info_from_inspire(payment, layer, polygon)
        _create_folder_payment_id(download_type, payment_id)
        is_created_image = _create_image_file(payment, layer, polygon, image_ext, folder_name)
        if is_created_image['success']:
            image_name = layer.wms_layer.code + '.' + image_ext
            path = _create_pdf(download_type, payment_id, layer.wms_layer.code, infos, image_name, folder_name, is_created_image['orientation'])

    _file_to_zip(str(payment.id), download_type)
    payment.export_file = download_type + '/' + str(payment.id) + '/export.zip'
    payment.save()
    return True


@require_GET
@ajax_required
@login_required
def download_purchase(request, pk, download_type):
    is_created = False
    payment = get_object_or_404(Payment, pk=pk, user=request.user, is_success=True)

    if payment.export_file:
        is_created = True
    else:
        if download_type == 'shp':
            is_created = _export_shp(payment)

        if download_type == 'jpeg' or download_type == 'png' or download_type == 'tiff':
            is_created = _export_image(payment, download_type)

        if download_type == 'pdf':
            is_created = _export_pdf(payment, download_type)

        if download_type == 'point':
            is_created = _create_lavlagaa_infos(payment)

        if is_created:

            subject = 'Худалдан авалт'
            msg = 'Дараах холбоос дээр дарж худалдан авсан бүтээгдэхүүнээ татаж авна уу! http://192.168.10.92/payment/history/api/details/{id}/'.format(id=payment.pk)
            to_email = [payment.user.email]

            send_email(subject, msg, to_email)

    rsp = {
        'success': is_created,
    }

    return JsonResponse(rsp)


def _get_uniq_id(payment):
    check_id = True
    while check_id:
        uniq_id = uuid.uuid4()
        if not payment:
            check_id = False if len(Payment.objects.filter(geo_unique_number=uniq_id)) == 0 else True
        else:
            check_id = False if payment.geo_unique_number == uniq_id else True
    return uniq_id


@require_POST
@ajax_required
@login_required
def purchaseFromCart(request, payload):
    try:
        datas = payload.get('datas')
        uniq_id = _get_uniq_id(None)
        user_id = request.user.id
        total_amount = 0
        payment = Payment.objects.create(
            geo_unique_number=uniq_id,
            bank_unique_number=' ',
            description='Цэг худалдаж авах хүсэлт',
            user_id=user_id,
            kind=2,
            total_amount=total_amount,
            export_kind=1,
            is_success = False,
            message = 'Цэг худалдаж авах хүсэлт',
            code = '',
        )
        pay_id = payment.id
        for data in datas:
            amount = 0
            point_id = data['id']

            if point_id:
                mpoint = Mpoint_view.objects.using('postgis_db').filter(point_id=point_id).first()
                wms_layer = get_object_or_404(WMSLayer, code=data['code'])
                amount = wms_layer.feature_price

                total_amount += amount
                point_name = 'Нэр алга'
                pdf_id = "хоосон"
                if mpoint:
                    point_name = mpoint.point_name if mpoint.point_name else point_name
                    pdf_id = mpoint.pid if mpoint.pid else pdf_id
                PaymentPoint.objects.create(
                    payment_id=pay_id,
                    point_id=point_id,
                    point_name=point_name,
                    amount=amount,
                    pdf_id=pdf_id,
                )

        Payment.objects.filter(id=pay_id).update(total_amount=total_amount)
        rsp = {
            'success': True,
            'msg': 'Амжилттай боллоо',
            'payment_id': pay_id
        }
    except Exception:
        rsp = {
            'success': False,
            'msg': 'Уучлаарай алдаа гарсан байна',
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


def _calc_per_price(area, area_type, layer_length, all_len_property, len_object_in_layer, selected_type):
    amount = None
    price = None
    if area_type == 'km':
        amount = Payment.POLYGON_PER_KM_AMOUNT
    if area_type == 'm':
        amount = Payment.POLYGON_PER_M_AMOUNT
    if selected_type == 'shp' or selected_type == 'pdf':
        price = (((area * amount) + (all_len_property * Payment.PROPERTY_PER_AMOUNT)) * layer_length) * len_object_in_layer
    if selected_type == 'png' or selected_type == 'jpeg' or selected_type == 'tiff':
        price = ((area * amount) * layer_length) * len_object_in_layer
    return price


@require_POST
@ajax_required
def calcPrice(request, payload):
    area = payload.get('area')
    layer_list = payload.get("layer_list")
    feature_info_list = payload.get("feature_info_list")
    selected_type = payload.get('selected_type')

    area_type = area['type']
    area = area['output']

    is_user = request.user
    if str(is_user) != 'AnonymousUser':
        is_user = True
    else:
        is_user = False

    all_len_property = _get_all_property_count(layer_list, feature_info_list)
    total_price = _calc_per_price(area, area_type, len(layer_list), all_len_property, len(feature_info_list), selected_type)

    rsp = {
        'success': True,
        'total_price': total_price,
        'is_user': is_user,
    }

    return JsonResponse(rsp)


def _check_pdf_from_mpoint_view(pdf_id):
    mpoints = []
    mpoints = Mpoint_view.objects.using("postgis_db").filter(pid=pdf_id)
    for mpoint in mpoints:
        mpoint.append(pdf_id)

    return mpoints