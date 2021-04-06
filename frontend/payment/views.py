import os
import io
import urllib.request
import uuid
import json
import math
import subprocess
import glob
import csv
import PIL.Image as Image

from datetime import date
from fpdf import FPDF
from pyproj import Transformer

from django.conf import settings
from django.db import transaction, connections

from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import Polygon
from django.contrib.gis.gdal import DataSource
from django.shortcuts import get_object_or_404, get_list_or_404
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, FileResponse, Http404

from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB

from govorg.backend.forms.models import Mpoint_view
from backend.payment.models import Payment, PaymentPoint, PaymentLayer, PaymentPolygon
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import Bundle
from backend.dedsanbutets.models import ViewNames
from backend.dedsanbutets.models import ViewProperties
from backend.inspire.models import (
    LFeatureConfigs,
    LDataTypeConfigs,
    LFeatures,
    LProperties,
    LValueTypes,
    LCodeLists,
    MDatas,
    MGeoDatas,
)

from main.decorators import ajax_required
from main import utils

from zipfile import ZipFile

from geojson import FeatureCollection

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


def _get_layer_ids(feature_info_list):
    layer_ids = list()
    for geoms in feature_info_list:
        if 'layer_id' in geoms:
            layer_ids.append(geoms['layer_id'])
    return layer_ids


@require_POST
@ajax_required
@login_required
def purchase_draw(request, payload):

    coodrinatLeftTop = payload.get('coodrinatLeftTop')
    coodrinatRightBottom = payload.get('coodrinatRightBottom')
    bundle_id = payload.get('bundle_id')
    area = payload.get('area')
    area_type = payload.get('area_type')
    layer_list = payload.get('layer_list')
    feature_info_list = payload.get('feature_info_list')
    selected_type = payload.get('selected_type')

    bundle = get_object_or_404(Bundle, pk=bundle_id)
    layer_ids = _get_layer_ids(feature_info_list)
    layers = get_list_or_404(WMSLayer, pk__in=layer_ids)

    layer_prices = {}
    for layer in layers:
        all_len_property = _get_all_property_count(feature_info_list)
        layer_prices[layer.id] = _calc_per_price(area, area_type, all_len_property, len(feature_info_list), selected_type)

    with transaction.atomic():

        payment = Payment()
        payment.geo_unique_number = uuid.uuid4()
        payment.bank_unique_number = ' '
        payment.description = 'Хэсэгчлэн худалдаж авах хүсэлт'
        payment.user = request.user
        payment.bundle = bundle
        payment.kind = Payment.KIND_QPAY
        payment.total_amount = sum(layer_prices.values())
        payment.export_kind = Payment.EXPORT_KIND_POLYGON
        payment.is_success = False
        payment.message = 'Хэсэгчлэн худалдаж авах хүсэлт'
        payment.code = ''
        payment.ext_type = selected_type
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
            payment_layer.amount = layer_prices[layer.id]
            payment_layer.save()

    return JsonResponse({
        'success': True,
        'payment_id': payment.id,
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


def _get_code_list_name(code_list_id):
    code_list_name = None
    code_list = LCodeLists.objects.filter(code_list_id=code_list_id)
    if code_list:
        code_list_name = code_list.first().code_list_name
    return code_list_name


def _create_field_and_insert_to_shp(feature_infos, feature_id, geo_id, path, gml_id, table_name):
    filter_value = None
    for info in feature_infos:
        for property in info['data_types']:
            property_code = property['property_code']
            mdata_value = MDatas.objects.filter(geo_id=geo_id, property_id=property['property_id'])
            if mdata_value:
                mdata_value = mdata_value.first()
                for value_type in property['value_types']:
                    value_type = value_type['value_type_id']
                    if value_type == 'double':
                        value_type = 'number'
                    if 'select' in value_type:
                        value_type = 'code_list_id'
                if value_type != 'boolean':
                    if 'code' in value_type:
                        filter_value = value_type
                    else:
                        filter_value = "value_" + value_type

                    if filter_value:
                        value = getattr(mdata_value, filter_value)

                    if filter_value == 'value_date' and value:
                        value = value.strftime('%m/%d/%Y, %H:%M:%S')
                    if filter_value == 'value_number' and value:
                        value = str(value)
                    if 'code_list' in filter_value and value:
                        value = _get_code_list_name(value)
                    if value and filter_value:
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
    subprocess.run([
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


def get_all_file_paths(directory):

    file_paths = []

    for root, directories, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(root, filename)
            file_paths.append(filepath)

    return file_paths


def get_all_file_remove(directory, not_zip_files):

    for root, directories, files in os.walk(directory):
        for filename in files:
            if filename != 'export.zip':
                filepath = os.path.join(root, filename)
                if not not_zip_files:
                    os.remove(filepath)
                else:
                    if filepath not in not_zip_files:
                        os.remove(filepath)


def _file_to_zip(payment_id, folder_name, not_zip_files=[]):
    path = os.path.join(settings.FILES_ROOT, folder_name, payment_id)
    file_paths = get_all_file_paths(path)
    zip_path = os.path.join(path, 'export.zip')
    with ZipFile(zip_path, 'w') as zip:
        for file in file_paths:
            if folder_name == 'pdf':
                if '.jpeg' not in str(file):
                    zip.write(file, os.path.basename(file))
            else:
                if len(not_zip_files) > 0:
                    if file not in not_zip_files:
                        zip.write(file, os.path.basename(file))
                else:
                    zip.write(file, os.path.basename(file))

    get_all_file_remove(path, not_zip_files)


def _export_shp(payment):

    layers = PaymentLayer.objects.filter(payment=payment)
    polygon = PaymentPolygon.objects.filter(payment=payment).first()

    for layer in layers:
        _create_shp_file(payment, layer.wms_layer, polygon)

    _file_to_zip(str(payment.id), 'shape')
    payment.export_file = 'shape/' + str(payment.id) + '/export.zip'
    payment.save()

    return True


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

    return str(height), str(width), orientation


def _create_image_file(payment, layer, polygon, download_type, folder_name):
    orientation = ''
    geoserver_layer = layer.wms_layer.code
    has_layer = utils.check_view_name(geoserver_layer)
    if has_layer:
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

        height, width, orientation = _get_size_from_extent(x1, y1, x2, y2)

        path = _create_folder_payment_id(folder_name, payment.id)

        file_ext = '.' + download_type
        filename = os.path.join(path, str(geoserver_layer) + file_ext)

        url = layer.wms_layer.wms.url
        url_service = 'SERVICE=WMS'
        url_version = 'VERSION=1.1.0'
        url_request = 'REQUEST=GetMap'
        url_format = 'FORMAT=image/' + download_type
        url_transparent = 'TRANSPARENT=true'
        url_width = 'WIDTH=' + width
        url_height = 'HEIGHT=' + height
        url_layers = 'LAYERS=' + geoserver_layer
        url_bbox = 'BBOX=' + str(x1) + ',' + str(y1) + ',' + str(x2) + ',' + str(y2) + ',urn:ogc:def:crs:EPSG:4326'

        fullurl = url + '?' + url_service + '&' + url_version + '&' + url_request + '&' + url_format + '&' + url_transparent + '&' + url_width + '&' + url_height + '&' + url_bbox + '&' + url_layers

        with urllib.request.urlopen(fullurl) as response:
            image_byte = response.read()

        if image_byte:
            bytes = bytearray(image_byte)
            image = Image.open(io.BytesIO(bytes))
            image.save(os.path.join(settings.FILES_ROOT, folder_name, str(payment.id), geoserver_layer + file_ext))
        success = True
    else:
        success = False

    return success, orientation


def _export_image(payment, download_type):

    layers = PaymentLayer.objects.filter(payment=payment)
    polygon = PaymentPolygon.objects.filter(payment=payment).first()
    folder_name = 'image'

    for layer in layers:
        _create_image_file(payment, layer, polygon, download_type, folder_name)

    _file_to_zip(str(payment.id), folder_name)
    payment.export_file = folder_name + '/' + str(payment.id) + '/export.zip'
    payment.save()
    return True


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
    if '?' not in url:
        url = url + "?"
    service = 'WFS'
    version = '1.1.0'
    request = 'GetFeature'
    code = layer.wms_layer.code
    trans_srs = 'EPSG:4326'
    property_name = 'feature_id'
    out_format = 'JSON'

    full_url = url + 'service=' + service + '&version=' + version + '&request=' + request + '&typeName=' + code + '&bbox=' + str(x1) +  ',' + str(y1) + ',' + str(x2) + ',' + str(y2) + ',' + trans_srs + '&PropertyName=' + property_name + '&outputFormat=' + out_format

    with urllib.request.urlopen(full_url) as response:
        get_features = response.read().decode("utf-8")
        get_features = json.loads(get_features)
        for feature in get_features['features']:
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
        for info in lfeatures:
            for property in info['data_types']:
                property_code = property['property_code']
                property_name = property['property_name']
                mdata_value = MDatas.objects.filter(geo_id=geo_id, property_id=property['property_id'])
                if mdata_value:
                    mdata_value = mdata_value.first()
                    for value_type in property['value_types']:
                        value_type = value_type['value_type_id']
                        if value_type == 'double':
                            value_type = 'number'
                        if value_type == 'single-select':
                            value_type = 'code_list_id'
                        if value_type == 'link':
                            value_type = 'text'

                    if 'code' in value_type:
                        filter_value = value_type
                    else:
                        filter_value = "value_" + value_type
                    if hasattr(mdata_value, filter_value):
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
            'body_name': 'PointNumber',
        },
        {
            'width': 30,
            'head_name': 'Өргөрөг',
            'body_name': 'sheet3',
        },
        {
            'width': 30,
            'head_name': 'Уртраг',
            'body_name': 'sheet2',
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
            'body_name': 'elevationValue',
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
    table_start_gap = 30
    class PDF(FPDF):
        def footer(self):
            self.set_y(-15)
            self.add_font(font_name, '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
            self.set_font(font_name, '', 8)
            self.set_x(-40)
            self.cell(0, 8, 'Геопортал', 0, 0, 'C')

        def table_header(self):
            pdf.cell(table_start_gap)

            pdf.set_font(font_name, '', 11)
            for col in range(0, len(table_col)):
                pdf.cell(table_col[col]['width'], 10, str(table_col[col]['head_name']), 1, 0, 'C')

            pdf.ln()

    pdf = PDF()
    pdf.add_page(orientation='Landscape')
    pdf.image(os.path.join(settings.STATIC_ROOT, 'assets', 'image', 'logo', 'gzbgzzg-logo.jpg'), x=25, y=8, w=37, h=40)
    org_name = _check_none(class_infos, 'CompanyName')

    class_name = _check_none(class_infos, 'GeodeticalNetworkPointTypeValue')
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
        pdf.cell(table_start_gap)
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

    file_name = class_name + "_" + org_name
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
    att = dict()
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


def _get_info_from_file(get_type, mpoint, pdf_id, geo_id=None):
    found_items = list()
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
                        if get_type == 'check':
                            found_items.append(pdf_id)
                        if not get_type and not mpoint:
                            found_items.append(_get_items_with_file(content, None, att_names))
                    if geo_id and str(content[att_names['point_name']]) == str(geo_id):
                        if get_type == 'check':
                            found_items.append(content[att_names['pid']])
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
        't_type': mpoint.t_type if mpoint else '',
        'class_name': str(mpoint.point_class_name) if mpoint else '',
        'pdf_id': content[att_names['pid']],
        'org_name': content[att_names['org_name']] if utils.get_key_and_compare(att_names, 'org_name') else 'Геопортал',
    }
    return point_info


def _filter_Model(filters, Model=MDatas, initial_qs=[]):
    if not initial_qs:
        initial_qs = Model.objects
    for search in filters:
        initial_qs = initial_qs.filter(**search)
    return initial_qs


def _append_to_list(values, add_values):
    has_already = False
    for before_value in values:
        if before_value['CompanyName'] == add_values['CompanyName'] and before_value['GeodeticalNetworkPointTypeValue'] == add_values['GeodeticalNetworkPointTypeValue']:
            has_already = True
    if has_already:
        before_value['infos'].append(add_values['infos'][0])
    else:
        values.append(add_values)
    return values


def _round_float(value, round_n=4):
    value = round(value, round_n)
    return value


def _get_geom_info(mdata, value):
    mgeo_datas_qs = _filter_Model([{'geo_id': mdata['geo_id']}], Model=MGeoDatas)
    geo_json = []
    mgeo = mgeo_datas_qs.first()
    geo = mgeo.geo_data
    geo_json = json.loads(geo.json)

    latlongy = geo_json['coordinates'][0][0]
    latlongx = geo_json['coordinates'][0][1]
    value['sheet2'] = latlongy
    value['sheet3'] = latlongx

    utm = utils.lat_long_to_utm(latlongy, latlongx)
    value['n_utm'] = _round_float(utm[1])
    value['e_utm'] = _round_float(utm[0])

    return value


def _check_undur(value):
    undur = 'elevationValue'
    if undur not in value.keys():
        value[undur] = 'Хоосон'
    return value


def _make_property_code_value(mdata):
    mdata_qs = _filter_Model([{ 'geo_id': mdata.geo_id }])
    value = dict()
    for mdata in mdata_qs.values():
        lprop_qs = LProperties.objects
        lprop_qs = lprop_qs.filter(property_id=mdata['property_id'])
        for prop in lprop_qs.values():
            for item in utils.value_types():
                if prop['value_type_id'] in item['value_names']:
                    dict_value = mdata[item['value_type']]
                    if 'date' in item['value_type']:
                        dict_value = utils.datetime_to_string(dict_value)
                    if item['value_type'] == 'code_list_id':
                        code_qs = _filter_Model([{'code_list_id': dict_value}], Model=LCodeLists)
                        if code_qs:
                            code = code_qs.first()
                            if prop['value_type_id'] == 'multi-select':
                                code_qs = _filter_Model([{'code_list_id': code.top_code_list_id}], Model=LCodeLists)
                                if code_qs:
                                    top_code = code_qs.first()
                                    value['aimag'] = top_code.code_list_name
                                    value['sum'] = code.code_list_name
                                else:
                                    value['aimag'] = code.code_list_name
                            else:
                                dict_value = code.code_list_name
                    if prop['property_code'] == 'Nomenclature':
                        value = _get_geom_info(mdata, value)
                    if prop['property_code'] == 'CompanyName':
                        if not dict_value:
                            dict_value = 'Хоосон'
                    value[prop['property_code']] = dict_value
    return value


def _class_name_bolon_orgoor_angilah(points, folder_name):
    data, filter_value_type = utils.get_filter_dicts()
    values = list()
    tseg_pdfs = list()

    for point in points:

        filter_value = dict()
        geo_id = point.point_id
        mdata_geo_id_qs = _filter_Model([{'geo_id': geo_id}])
        value = point.pdf_id.zfill(4)
        filter_value[filter_value_type] = value
        mdata_qs = _filter_Model([data, filter_value], initial_qs=mdata_geo_id_qs)
        if not mdata_qs:
            value = point.pdf_id
            filter_value[filter_value_type] = value
            mdata_qs = _filter_Model([data, filter_value], initial_qs=mdata_geo_id_qs)
            mdata = mdata_qs.first()
        else:
            mdata = mdata_qs.first()

        value = _make_property_code_value(mdata)
        value['geo_id'] = geo_id

        for_angilah = ['CompanyName', 'GeodeticalNetworkPointClassValue', 'GeodeticalNetworkPointTypeValue']
        value = _check_undur(value)

        path = _create_folder_payment_id(folder_name, point.payment.id)
        pdf_name = value['PointNumber'] + ".pdf"
        src_file = os.path.join(path, pdf_name)
        pdf = createPdf(value)
        pdf.output(src_file, 'F')
        tseg_pdfs.append(src_file)

        infos = dict()
        for_pdf = dict()
        for_pdf['infos'] = list()

        for key, val in value.items():
            if key in for_angilah:
                if key == 'GeodeticalNetworkPointTypeValue' and 'GeodeticalNetworkPointClassValue' not in value:
                    code_qs = _filter_Model([{'code_list_name': value['GeodeticalNetworkPointTypeValue']}], Model=LCodeLists)
                    if code_qs:
                        code = code_qs.first()
                        top_code_qs = _filter_Model([{'top_code_list_id': code.top_code_list_id}], Model=LCodeLists)
                        if top_code_qs:
                            top_code = top_code_qs.first()
                            val = top_code.code_list_name
                            for_pdf['GeodeticalNetworkPointClassValue'] = val
                for_pdf[key] = val
            else:
                infos[key] = val
        for_pdf['infos'].append(infos)
        values = _append_to_list(values, for_pdf)
    return values, tseg_pdfs


def _create_lavlagaa_infos(payment, folder_name):
    is_true = False
    points = PaymentPoint.objects.filter(payment=payment)
    if points:
        filtered_points, tseg_pdfs = _class_name_bolon_orgoor_angilah(points, folder_name)
        if filtered_points:
            for f_point in filtered_points:
                path = _create_folder_payment_id(folder_name, payment.id)
                _create_lavlagaa_file(f_point, path)
            _file_to_zip(str(payment.id), folder_name, tseg_pdfs)
            payment.export_file = folder_name + '/' + str(payment.id) + '/export.zip'
            payment.save()
            is_true = True

    return is_true


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
        success, orientation = _create_image_file(payment, layer, polygon, image_ext, folder_name)
        if success:
            image_name = layer.wms_layer.code + '.' + image_ext
            path = _create_pdf(download_type, payment_id, layer.wms_layer.code, infos, image_name, folder_name, orientation)

    _file_to_zip(str(payment.id), download_type)
    payment.export_file = download_type + '/' + str(payment.id) + '/export.zip'
    payment.save()
    return True


def _check_none(values, code):
    data = 'Хоосон'
    if code in values:
        if values[code]:
            data = values[code]
    return data


def createPdf(values):
    if values['sheet2'] and values['sheet3']:
        L = float(values['sheet3'])
        B = float(values['sheet2'])
        LA = int(L)
        LB = int((L-LA)*60)
        LC = float((L-LA-LB/60)*3600)
        LC = "%.6f" % LC
        BA = int(B)
        BB = int((B-BA)*60)
        BC = float((B-BA-BB/60)*3600)
        BC = "%.6f" % BC
        Bchar = str(BA) + '°' + str(BB) + "'" + str(_round_float(float(BC)))  + '"'
        Lchar = str(LA) + '°' + str(LB) + "'" + str(_round_float(float(LC)))  + '"'
        transformer = Transformer.from_crs(4326, 26917)
        transformer = Transformer.from_crs("EPSG:4326", 'EPSG:3857')
        L = float("%.6f" % L)
        B = float("%.6f" % B)
        val1 = transformer.transform(float(L), float(B))
        utmx = val1[0]
        utmx = str(_round_float(utmx, round_n=6))
        utmy = val1[1]
        utmy = str(_round_float(utmy, round_n=6))
    else:
        Bchar = ''
        Lchar = ''
        utmx = ''
        utmy = ''
    pdf = FPDF()
    pdf.add_page()
    pdf.set_xy(0, 0)
    pdf.add_font('DejaVu', '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
    pdf.set_font('DejaVu', '', 10)
    pdf.ln(10)
    pdf.cell(50)
    pdf.cell(75, 8, "ГЕОДЕЗИЙН БАЙНГЫН ЦЭГ ТЭМДЭГТИЙН ХУВИЙН ХЭРЭГ", 0, 2, 'D')
    pdf.cell(75, 8, "", 0, 2, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')

    # tseg ner ehni mor
    pdf.cell(-50)
    pdf.cell(10, 8, '1.', 1, 0, 'C')
    pdf.cell(41, 8, 'Цэгийн нэр', 1, 0, 'C')
    pdf.cell(43, 8, _check_none(values, 'PointNumber'), 1, 0, 'C')

    pdf.cell(10, 8, '2.', 1, 0, 'C')
    pdf.cell(41, 8, 'Цэгийн дугаар', 1, 0, 'C')
    tseg_dugaar = values['PointNumber']
    if 'localId' in values:
        tseg_dugaar = values['localId']
    pdf.cell(43, 8, tseg_dugaar, 1, 0, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')
    pdf.cell(-188)

    pdf.ln(0)
    pdf.cell(10, 8, '3.', 1, 0, 'C')
    pdf.cell(84, 8, 'Трапецийн дугаар', 1, 0, 'C')
    pdf.cell(94, 8,  _check_none(values, 'Nomenclature'), 1, 1, 'C')
    pdf.ln(0)

    # mor 3
    pdf.ln(0)
    pdf.cell(10, 8, '4.', 1, 0, 'C')
    pdf.cell(84, 8, 'Сүлжээний төрөл', 1, 0, 'C')
    pdf.cell(94, 8, _check_none(values, 'GeodeticalNetworkPointTypeValue'), 1, 1, 'C')
    pdf.ln(0)

    pdf.cell(10, 8, '5.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байршил (Аймаг, сум, дүүрэг)', 1, 0, 'C')
    pdf.cell(94, 8, values['aimag'] + ' ' + values['sum'], 1, 1, 'C')
    pdf.ln(0)

    pdf.cell(10, 8, '6.', 1, 0, 'C')
    pdf.cell(33, 8, 'Цэгийн солбилцол', 1, 0, 'C')
    pdf.cell(33, 8, 'B= ' + Bchar, 1, 0, 'C')
    pdf.cell(33, 8, 'L= ' + Lchar, 1, 0, 'C')
    pdf.cell(40, 8, 'X= ' + utmx, 1, 0, 'C')
    pdf.cell(39, 8, 'Y= ' + utmy, 1, 0, 'C')
    # mor 5
    pdf.ln(0)
    pdf.cell(10, 8, '', 1, 1, 'C')
    pdf.cell(188, 8, '7. Цэгийн фото зураг', 1, 1, 'C')
    # mor 6
    pdf.cell(94, 8, 'Холоос', 1, 0, 'C')
    pdf.cell(94, 8, 'Ойроос', 1, 0, 'C')
    pdf.ln(0)
    pdf.cell(94, 70, '', 1, 0, 'C')
    pdf.cell(94, 70, '', 1, 0, 'C')
    pdf.ln(70)
    if 'PointNearPhoto' in values:
        if values['PointNearPhoto']:
            pdf.image(os.path.join(settings.MEDIA_ROOT, values['PointNearPhoto']), x = 11, y = 91, w = 92, h = 60, type = '', link = '')
    if 'PointFarPhoto' in values:
        if values['PointFarPhoto']:
            pdf.image(os.path.join(settings.MEDIA_ROOT, values['PointFarPhoto']), x = 105, y = 91, w = 92, h = 60, type = '', link = '')
    # mor 6
    pdf.ln(0)
    pdf.cell(188, 8, '8. Байршлийн тухай', 1, 0, 'C')
    pdf.ln(8)
    pdf.multi_cell(188, 5, _check_none(values, 'PointLocationDescription'), 1, 0, 'C')
    newH = pdf.get_y()
    # mor 6
    if 'LocationOverviewMap' in values or 'PointCenterType' in values:
        pdf.cell(94, 8, '9. Байршлын тойм зураг.', 1, 0, 'C')
        pdf.cell(94, 8, '10. Төв цэгийн хэлбэр', 1, 0, 'C')
        pdf.ln(8)
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.ln(62)
        if 'PointCenterType' in values:
            if values['PointCenterType']:
                pdf.image(os.path.join(settings.MEDIA_ROOT, values['PointCenterType']), x = 11, y = newH + 8, w = 92, h =60, type = '', link = '')
        if 'LocationOverviewMap' in values:
            if values['LocationOverviewMap']:
                pdf.image(os.path.join(settings.MEDIA_ROOT, values['LocationOverviewMap']), x = 105, y = newH + 8, w = 92, h =60, type = '', link = '')
    else:
        pdf.ln(0)
    # mor 6
    pdf.cell(10, 8, '11.', 1, 0, 'C')
    pdf.cell(84, 8, 'Судалгаа: ' + _check_none(values, 'sudalga_or_shine'), 1, 0, 'C')
    pdf.cell(10, 8, '12.', 1, 0, 'C')
    pdf.cell(84, 8, 'Огноо: ' +  _check_none(values, 'beginLifespanVersion'), 1, 0, 'C')

    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '13.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хөрсний шинж байдал:', 1, 0, 'C')
    pdf.cell(94, 8, _get_hurs(values['geo_id']), 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '14.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хувийн хэрэг хөтөлсөн:', 1, 0, 'C')
    pdf.cell(94, 8, _check_none(values, 'EmployeeName'), 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '15.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байгууллага', 1, 0, 'C')
    pdf.cell(94, 8, _check_none(values, 'CompanyName'), 1, 0, 'C')
    return pdf


def _get_hurs(geo_id):
    mdatas_qs = _filter_Model([{'geo_id': geo_id}, {'property_id': 0}])
    if mdatas_qs:
        return mdatas_qs.first().value_text
    else:
        return 'Хоосон'


@require_GET
@login_required
def download_purchase(request, pk):
    is_created = False
    payment = get_object_or_404(Payment, pk=pk, user=request.user, is_success=True)
    download_type = payment.ext_type
    if payment.export_file:
        is_created = True
    else:
        if payment.export_kind == Payment.EXPORT_KIND_POLYGON:
            if download_type == 'shp':
                is_created = _export_shp(payment)

            if download_type == 'jpeg' or download_type == 'png' or download_type == 'tiff':
                is_created = _export_image(payment, download_type)

            if download_type == 'pdf':
                is_created = _export_pdf(payment, download_type)

        if payment.export_kind == Payment.EXPORT_KIND_POINT:
                folder_name = 'tseg-personal-file'
                is_created = _create_lavlagaa_infos(payment, folder_name)

        if is_created:

            subject = 'Худалдан авалт'
            msg = 'Дараах холбоос дээр дарж худалдан авсан бүтээгдэхүүнээ татаж авна уу!'
            host_name = utils.get_config('EMAIL_HOST_NAME')
            msg = '{msg} http://{host_name}/payment/history/api/details/{id}/'.format(id=payment.pk, msg=msg, host_name=host_name)
            to_email = [payment.user.email]

            utils.send_email(subject, msg, to_email)

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
def purchase_from_cart(request, payload):

    with transaction.atomic():

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
            is_success=False,
            message='Цэг худалдаж авах хүсэлт',
            code='',
        )
        pay_id = payment.id
        for data in datas:
            amount = 0
            pdf_id = data['pdf_id']

            if pdf_id:
                wms_layer = get_object_or_404(WMSLayer, code=data['code'])

                amount = wms_layer.feature_price
                total_amount += amount

                PaymentPoint.objects.create(
                    payment_id=pay_id,
                    point_id=data['id'],
                    point_name=data['name'],
                    amount=amount,
                    pdf_id=data['pdf_id'],
                )

        Payment.objects.filter(id=pay_id).update(total_amount=total_amount)

        rsp = {
            'success': True,
            'msg': 'Амжилттай боллоо',
            'payment_id': pay_id
        }

    return JsonResponse(rsp)


@require_GET
@login_required
def download_pdf(request, pk, pdf_id):
    payment = get_object_or_404(Payment, user=request.user, id=pk, is_success=True)
    point = get_object_or_404(PaymentPoint, payment=payment, pdf_id=pdf_id)
    # generate the file
    file_name = pdf_id + '.pdf'
    src_file = os.path.join(settings.FILES_ROOT, 'tseg-personal-file', str(payment.id), file_name)
    response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename=file_name)
    return response


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


def _get_all_property_count(feature_info_list):
    count = 0
    for feature in feature_info_list:
        if 'feature_id' in feature:
            fconfig_count = _lfeature_config_count(feature['feature_id'])
            count += fconfig_count
    return count


def _calc_per_price(area, area_type, all_len_property, len_object_in_layer, selected_type):
    amount = None
    price = None
    if area_type == 'km':
        amount = float(utils.get_config('POLYGON_PER_KM_AMOUNT'))
    if area_type == 'm':
        amount = float(utils.get_config('POLYGON_PER_M_AMOUNT'))
    if selected_type == 'shp' or selected_type == 'pdf':
        price = ((area * amount) + (all_len_property * float(utils.get_config('PROPERTY_PER_AMOUNT')))) * len_object_in_layer
    if selected_type == 'png' or selected_type == 'jpeg' or selected_type == 'tiff':
        price = (area * amount) * len_object_in_layer
    return price


@require_POST
@ajax_required
@login_required
def calc_price(request, payload):
    area = payload.get('area')
    layer_list = payload.get("layer_list")
    feature_info_list = payload.get("feature_info_list")
    selected_type = payload.get('selected_type')

    area_type = area['type']
    area = area['output']

    all_len_property = _get_all_property_count(feature_info_list)
    total_price = _calc_per_price(area, area_type, all_len_property, len(feature_info_list), selected_type)

    rsp = {
        'success': True,
        'total_price': total_price,
    }

    return JsonResponse(rsp)


def _check_pdf_from_mpoint_view(pdf_id):
    has_pdf = False
    pdf_id = None
    mpoints = Mpoint_view.objects.using("postgis_db")
    mpoints = mpoints.filter(pid=pdf_id)
    if mpoints:
        pdf_id = mpoints.first().pid
        has_pdf = True

    return has_pdf, pdf_id


def _check_pdf_in_folder(pdf_id):
    file_ext = 'pdf'
    path = os.path.join(settings.FILES_ROOT, 'tseg-personal-file')
    pdf_full_name = pdf_id + "." + file_ext
    file_paths = []

    for root, directories, files in os.walk(path):
        for filename in files:
            if filename == pdf_full_name:
                filepath = os.path.join(root, filename)
                file_paths.append(filepath)
                break

    return file_paths


@require_POST
@ajax_required
@login_required
def check_button_ebable_pdf(request, payload):
    is_enable = False
    pdf_id = payload.get('pdf_id')

    has_csv = _get_info_from_file('check', None, pdf_id, None)
    has_pdf = _check_pdf_in_folder(pdf_id)
    if len(has_pdf) > 0:
        if len(has_csv) > 0:
            is_enable = True
        else:
            has_pdf_in_mpoint, pid = _check_pdf_from_mpoint_view(pdf_id)
            if has_pdf_in_mpoint:
                is_enable = True

    rsp = {
        'success': True,
        'is_enable': is_enable
    }

    return JsonResponse(rsp)


def _check_in_inspire(geo_id, pdf_id):
    mdatas_qs = _filter_Model([{'geo_id': geo_id}])
    data, value_type = utils.get_filter_dicts()
    search = dict()
    search[value_type] = pdf_id
    mdatas_qs = _filter_Model([data, search], initial_qs=mdatas_qs)
    return mdatas_qs


@require_POST
@ajax_required
@login_required
def check_button_ebable_pdf_geo_id(request, payload):
    is_enable = False
    geo_id = payload.get('geo_id')
    pdf_id = payload.get('pdf_id')
    if geo_id:
        has_pdf = _check_in_inspire(geo_id, pdf_id)
        if has_pdf:
            is_enable = True

    rsp = {
        'success': True,
        'is_enable': is_enable,
        'geo_id': geo_id
    }

    return JsonResponse(rsp)


def _get_properties_qs(view_qs):
    viewproperties_qs = ViewProperties.objects
    viewproperties_qs = viewproperties_qs.filter(view=view_qs)
    viewproperty_ids = viewproperties_qs.values_list('property_id', flat=True)

    property_qs = LProperties.objects
    property_qs = property_qs.filter(property_id__in=viewproperty_ids)

    return viewproperty_ids, property_qs


def _radius_formula(radius):
    radius = radius / 5 # солих шаардлагатай
    return radius


@require_POST
@ajax_required
@login_required
def get_popup_info(request, payload):
    layers_code = payload.get('layers_code')
    coordinate = payload.get('coordinate')
    radius = int(payload.get('scale_value'))
    radius = _radius_formula(radius)

    value_type = None
    property_name = None
    property_code = None
    infos = list()

    views_qs = ViewNames.objects
    views_qs = views_qs.filter(
        view_name__in=[
            utils.remove_text_from_str(layer_code)
            for layer_code in layers_code
        ]
    )

    geo_id_name = 'geo_id'

    for view_qs in views_qs:
        view_name = view_qs.view_name
        viewproperty_ids, property_qs = _get_properties_qs(view_qs)
        properties = property_qs.values("property_code", "property_name")

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    {geo_id_name}, {properties}
                FROM
                    {view_name}
                WHERE (
                    ST_DistanceSphere(
                        geo_data,
                        ST_SetSRID(
                            ST_MakePoint({x}, {y})
                        ,4326)
                    )
                    <= {radius}
                )
            """.format(
                view_name=view_name,
                properties=",".join([prop_code['property_code'] for prop_code in properties]),
                x=coordinate[0],
                y=coordinate[1],
                radius=radius,
                geo_id_name=geo_id_name,
            )
            cursor.execute(sql)
            results = [dict((cursor.description[i][0], value)
                for i, value in enumerate(row)) for row in cursor.fetchall()[:5]]

            for result in results:
                datas = list()
                datas.append('gp_layer_' + view_qs.view_name)
                datas.append(list())
                for key, value in result.items():
                    if key == geo_id_name:
                        datas[1].append([key, value, key])
                    for prop in properties:
                        if prop['property_code'].lower() == key and value:
                            datas[1].append([prop['property_name'], value, key])
                if datas:
                    infos.append(datas)
    rsp = {
        'datas': infos,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def get_feature_info(request, payload):
    datas = list()
    layer_codes = payload.get('layer_codes')
    coordinates = payload.get('coordinates')
    main_layer_name = 'gp_layer_'

    polygon = Polygon(coordinates, srid=4326).json

    for layer_code in layer_codes:
        data = dict()
        layer_code = utils.remove_text_from_str(layer_code, main_layer_name)
        geom_ids = utils.get_inside_geoms_from_view(polygon, layer_code, ['geo_id'])
        data['geom_ids'] = geom_ids

        view_qs = ViewNames.objects.filter(view_name=layer_code).first()
        feature_id = view_qs.feature_id
        data['feature_id'] = feature_id

        layer_code = main_layer_name + layer_code
        data['layer_code'] = layer_code
        datas.append(data)

    rsp = {
        'datas': datas,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def get_geom(request, payload):
    feature = ''
    geo_id = payload.get('geo_id')

    geom = utils.get_geom(geo_id, 'MultiPolygon')
    if geom:
        geo_json = geom.json
        feature = utils.get_feature_from_geojson(geo_json)

    rsp = {
        'feature': feature
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def get_contain_geoms(request, payload):
    features = list()
    layers_changed_code = list()
    feature_collection = list()
    buffer = ''
    success = False

    main_layer_name = 'gp_layer_'

    layers_code = payload.get('layers_code')
    geometry = payload.get('geometry')
    km_scale = payload.get('km_scale')
    km_scale = km_scale / 10 if km_scale else None


    if len(layers_code) > 0:
        for layer_code in layers_code:

            layer_code = utils.remove_text_from_str(layer_code, main_layer_name)

            if km_scale:
                point = utils.get_geom_for_filter_from_coordinate(geometry, 'Point')
                buffer = utils.get_feature_from_geojson(point.buffer(km_scale + 0.1).json)
                geoms = utils.get_geoms_with_point_buffer_from_view(geometry, layer_code, km_scale)

            else:
                geoms = utils.get_inside_geoms_from_view(geometry, layer_code)

            if geoms:
                for geom in geoms:
                    feature = utils.get_feature_from_geojson(geom)
                    features.append(feature)

            changed_code = main_layer_name + layer_code
            layers_changed_code.append(changed_code)

        feature_collection = FeatureCollection(features)
        success = True

    rsp = {
        'features': feature_collection,
        'layers_code': layers_changed_code,
        'buffer': buffer,
        'success': success or False,
    }

    return JsonResponse(rsp)
