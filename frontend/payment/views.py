from zipfile import ZipFile
import os
import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB
from backend.forms.models import Mpoint_view
from backend.payment.models import Payment, PaymentPoint
from geoportal_app.models import User
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
    print(purchase_all['total_amount'])
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
        print("Dsdfsdfsddfgdf")

        return JsonResponse({'success': True, 'xmlmsg': 12})


@require_POST
@ajax_required
@login_required
def purchaseDraw(request, payload):
    user = get_object_or_404(get_user_model(), pk=request.user.id)
    price = payload.get('price')
    description = payload.get('description')
    coodrinatLeftTop = payload.get('coodrinatLeftTop')
    coodrinatRightBottom = payload.get('coodrinatRightBottom')
    count = Payment.objects.all().count()
    payment = Payment.objects.create(geo_unique_number=count,
                                        amount=price,
                                        description=description,
                                        user=user,
                                        is_success=False,
                                        coodrinatLeftTopX=coodrinatLeftTop[0],
                                        coodrinatLeftTopY=coodrinatLeftTop[1],
                                        coodrinatRightBottomX=coodrinatRightBottom[0],
                                        coodrinatRightBottomY=coodrinatRightBottom[1],
                                    )

    return JsonResponse({'payment_id': payment.id})


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


def _export_shp(payment):

    import sys
    sys.path.append('/usr/lib/python3/dist-packages/')
    from qgis.utils import iface
    from qgis.core import \
        QgsVectorLayer, QgsDataSourceUri, QgsVectorFileWriter, QgsFeature, QgsApplication, QgsProject, QgsWkbTypes,  QgsFields, QgsCoordinateReferenceSystem

    fields = QgsFields()
    try:
        qgs = QgsApplication([], False)
        QgsApplication.setPrefixPath("/usr", True)
        QgsApplication.initQgis()
        uri = QgsDataSourceUri()
        db_config = settings.DATABASES['postgis_db']

        uri.setConnection(db_config['HOST'], db_config['PORT'], db_config['NAME'], db_config['USER'], db_config['PASSWORD'])

        sql = """
        SELECT
            *
        FROM (
            SELECT
                 id,
                 st_intersection(st_transform(geom, 4326), st_setsrid(st_polygonfromtext('polygon((103.08984284113619 47.61581843634127, 112.6063853980155 47.61581843634127, 112.6063853980155 47.11072628526145, 103.08984284113619 47.11072628526145, 103.08984284113619 47.61581843634127))'), 4326)) AS geom
            FROM public."Road_MGL"
        ) as t
        WHERE st_geometrytype(geom) != 'ST_GeometryCollection'
        """

        uri.setDataSource('', f'({sql})', 'geom', '', 'id')

        vlayer = QgsVectorLayer(uri.uri(), 'test1', 'postgres')

        if not vlayer.isValid():
            print("Layer failed to load!")
        else:
            print("Layer success to load!")

            path = os.path.join(settings.FILES_ROOT, 'shape', str(payment.id))
            os.mkdir(path)
            filename = os.path.join(path, 'shp2.shp')

            writer = QgsVectorFileWriter.writeAsVectorFormat(vlayer, filename, 'UTF-8', QgsCoordinateReferenceSystem('EPSG:3857'), 'ESRI Shapefile')

            file_paths = get_all_file_paths(path)

            zip_path = os.path.join(path, 'export.zip')
            with ZipFile(zip_path,'w') as zip:
                for file in file_paths:
                    zip.write(file, os.path.basename(file))

            get_all_file_remove(path)
            payment.export_file = 'shape/' + str(payment.id) + '/export.zip'
            payment.save()
            del(writer)

        qgs.exitQgis()

        return True

    except Exception as e:
        return False


@require_GET
@ajax_required
@login_required
def download_purchase(request, pk):

    payment = get_object_or_404(Payment, pk=pk, user=request.user, is_success=True)
    # if payment.export_file:
        # is_created = True
    # else:
        # is_created = _export_shp(payment)
    import time
    time.sleep(1.5)
    is_created = True  # TODO

    rsp = {
        'success': is_created,
        'export_file': payment.export_file,
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
    # mpoint = Mpoint_view.objects.using('postgis_db').filter()
    amount = settings.PURCHASE['point_price']
    total_amount = amount * len(datas)

    try:
        payment = Payment.objects.create(
            geo_unique_number = uniq_id,
            bank_unique_number = '',
            description = 'Цэг худалдаж авах хүсэлт',
            total_amount = total_amount,
            user_id = userID,
            kind=2,
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

        for i in range(len(datas)):
            if pay_id > 0:
                point = PaymentPoint.objects.create(
                    payment_id = pay_id,
                    point_id = uniq_id,
                    point_name = datas[i],
                    amount = amount,
                    pdf_id = 'GPSB00003',
                )
            else:
                rsp = {
                    'success': False,
                    'msg': "Амжилтгүй"
                }
                return JsonResponse(rsp)
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
    payment = get_object_or_404(Payment, user=request.user, pk=pk, is_success=True)

    # generate the file
    src_file = os.path.join(settings.FILES_ROOT, 'tseg-personal-file', 'GPSB00003.pdf')
    response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename="tseg-medeelel.pdf")
    return response


@require_GET
@login_required
def download_zip(request, pk):
    payment = get_object_or_404(Payment, user=request.user, pk=pk)
    # generate the file
    src_file = os.path.join(settings.FILES_ROOT, 'shape', str(payment.id), 'export.zip')
    response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename="export.zip")
    return response
