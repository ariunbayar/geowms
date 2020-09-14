from zipfile import ZipFile
import os
import uuid

from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB
from backend.forms.models import Mpoint_view
from backend.payment.models import Payment, PaymentPoint, PaymentPolygon, PaymentLayer
from geoportal_app.models import User
from backend.forms.models import Mpoint_view
from backend.wmslayer.models import WMSLayer
from main.decorators import ajax_required


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


@require_POST
@ajax_required
@login_required
def purchaseDraw(request, payload):

    user = request.user

    price = payload.get('price')
    description = payload.get('description')
    coodrinatLeftTop = payload.get('coodrinatLeftTop')
    coodrinatRightBottom = payload.get('coodrinatRightBottom')
    layer_ids = payload.get('layer_ids')
    bundle_id = payload.get('bundle_id')

    with transaction.atomic():

        payment = Payment()
        payment.geo_unique_number = uuid.uuid4()
        payment.bank_unique_number = ' '
        payment.description = 'Хэсэгчлэн худалдаж авах хүсэлт'
        payment.user = user
        payment.kind = Payment.KIND_QPAY
        payment.total_amount = 0
        payment.export_kind = Payment.EXPORT_KIND_POLYGON
        payment.is_success = False
        payment.message = 'Хэсэгчлэн худалдаж авах хүсэлт'
        payment.code = ''
        payment.save()

        payment_polygon = PaymentPolygon()
        payment_polygon.payment = payment
        payment_polygon.data_id = ''
        payment_polygon.pdf_id = ''
        payment_polygon.amount = 1  # TODO
        payment_polygon.coodrinatLeftTopX = coodrinatLeftTop[0]
        payment_polygon.coodrinatLeftTopY = coodrinatLeftTop[1]
        payment_polygon.coodrinatRightBottomX = coodrinatRightBottom[0]
        payment_polygon.coodrinatRightBottomY = coodrinatRightBottom[1]
        payment_polygon.save()

        for layer_id in layer_ids:
            payment_layer = PaymentLayer()
            payment_layer.payment = payment
            payment_layer.wms_layer = get_object_or_404(WMSLayer, pk=layer_id)
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


# def create_shp_file(layer, polygon):
#     import sys
#     sys.path.append('/usr/lib/python3/dist-packages/')
#     from qgis.utils import iface
#     from qgis.core import \
#         QgsVectorLayer, QgsDataSourceUri, QgsVectorFileWriter, QgsFeature, QgsApplication, QgsProject, QgsWkbTypes,  QgsFields, QgsCoordinateReferenceSystem

#     try:
#         qgs = QgsApplication([], False)
#         QgsApplication.setPrefixPath("/usr", True)
#         QgsApplication.initQgis()
#         uri = QgsDataSourceUri()
#         db_config = settings.DATABASES['postgis_db']

#         uri.setConnection(db_config['HOST'], db_config['PORT'], db_config['NAME'], db_config['USER'], db_config['PASSWORD'])

#         sql = """
#         SELECT
#             *
#         FROM (
#             SELECT
#                  id,
#                  st_intersection(st_transform(geom, 4326), st_setsrid(st_polygonfromtext('polygon((103.08984284113619 47.61581843634127, 112.6063853980155 47.61581843634127, 112.6063853980155 47.11072628526145, 103.08984284113619 47.11072628526145, 103.08984284113619 47.61581843634127))'), 4326)) AS geom
#             FROM public."Road_MGL"
#         ) as t
#         WHERE st_geometrytype(geom) != 'ST_GeometryCollection'
#         """

#         uri.setDataSource('', f'({sql})', 'geom', '', 'id')

#         vlayer = QgsVectorLayer(uri.uri(), 'test1', 'postgres')

#         if not vlayer.isValid():
#             print("Layer failed to load!")
#         else:
#             print("Layer success to load!")

#             path = os.path.join(settings.FILES_ROOT, 'shape', str(payment.id))
#             os.mkdir(path)
#             filename = os.path.join(path, 'shp2.shp')

#             writer = QgsVectorFileWriter.writeAsVectorFormat(vlayer, filename, 'UTF-8', QgsCoordinateReferenceSystem('EPSG:3857'), 'ESRI Shapefile')
#             del(writer)

#             qgs.exitQgis()


def _export_shp(payment):
    pass
    # layers = PaymentLayer.objects.filter(payment=payment)
    # polygon = PaymentPolygon.objects.filter(payment=payment).first()

    # for layer in layers:
    #     create_shp_file(layer, polygon)
        
    # file_paths = get_all_file_paths(path)

    # zip_path = os.path.join(path, 'export.zip')
    # with ZipFile(zip_path,'w') as zip:
    #     for file in file_paths:
    #         zip.write(file, os.path.basename(file))

    # get_all_file_remove(path)
    # payment.export_file = 'shape/' + str(payment.id) + '/export.zip'
    # payment.save()


    #     return True

    # except Exception as e:
    #     return False


@require_GET
@ajax_required
@login_required
def download_purchase(request, pk):

    payment = get_object_or_404(Payment, pk=pk, user=request.user, is_success=True)
    if payment.export_file:
        is_created = True
    else:
        is_created = _export_shp(payment)

    rsp = {
        'success': is_created,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def purchaseFromCart(request, payload):

    datas = payload.get('data')
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
        for i in range(len(datas)):
            if pay_id > 0:
                mpoint = Mpoint_view.objects.using('postgis_db').filter(id = datas[i][1]).first()
                amount=0
                if datas[i][0]:
                   wms_layer = WMSLayer.objects.filter(code = datas[i][0]).first()
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
                    point_id = datas[i][1],
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
                'msg': "Алдаа гарсан тул цуцлагдлаа"
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
        point = get_object_or_404(PaymentPoint, point_id=mpoint.id)
        payment = get_object_or_404(Payment, user=request.user, id=point.payment_id, is_success=True)
        # generate the file
        file_name = pk + '.pdf'
        src_file = os.path.join(settings.FILES_ROOT, 'tseg-personal-file', file_name)
        response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename=file_name)
        return response
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
