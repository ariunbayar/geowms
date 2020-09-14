import os

from django.http import JsonResponse, FileResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.decorators import login_required

from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB
from backend.payment.models import Payment, PaymentPoint
from geoportal_app.models import User
from backend.forms.models import Mpoint_view
from backend.wmslayer.models import WMSLayer


import uuid

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


def _export_shp(payment):
    import os # This is is needed in the pyqgis console also
    from qgis.utils import iface
    from qgis.core import \
        QgsVectorLayer, QgsDataSourceUri, QgsVectorFileWriter, QgsFeature, QgsApplication, QgsProject, QgsWkbTypes,  QgsFields, QgsCoordinateReferenceSystem

    fn = '../shpfile/shpLine.shp'

    fields = QgsFields()

    qgs = QgsApplication([], False)
    QgsApplication.setPrefixPath("/usr", True)
    QgsApplication.initQgis()

    uri = QgsDataSourceUri()
    uri.setConnection("localhost", "5432", "geoportal", "postgres", "geo")

    sql = """
    select
     *
    from (
        SELECT
             id,
             st_intersection(st_transform(geom,4326), st_setsrid(st_polygonfromtext('polygon((103.08984284113619 47.61581843634127, 112.6063853980155 47.61581843634127, 112.6063853980155 47.11072628526145, 103.08984284113619 47.11072628526145, 103.08984284113619 47.61581843634127))'), 4326)) AS geom
        FROM public."Road_MGL"

    ) as t
    where st_geometrytype(geom) != 'ST_GeometryCollection'

    """

    uri.setDataSource('', f'({sql})', 'geom', '', 'id')

    vlayer = QgsVectorLayer(uri.uri(), 'test1', 'postgres')

    import pprint
    if not vlayer.isValid():
        print("Layer failed to load!")
    else:
        print("Layer success to load!")

        for field in vlayer.fields():
            print(field.name(), field.typeName())
        writer = QgsVectorFileWriter.writeAsVectorFormat(vlayer, fn, 'UTF-8', QgsCoordinateReferenceSystem('EPSG:3857'), 'ESRI Shapefile')

        del(writer)

    qgs.exitQgis()


@require_GET
@ajax_required
@login_required
def download_purchase(request, pk):

    payment = get_object_or_404(Payment, pk=pk)

    _export_shp(payment)

    download_url = 'dfgjjgjgjgjgjgj'

    return JsonResponse({'download_url': download_url})


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
    payment = get_object_or_404(Payment, user=request.user, pk=pk, is_success=True)

    # generate the file
    src_file = os.path.join(settings.FILES_ROOT, 'tseg-personal-file', 'GPSB00003.pdf')
    response = FileResponse(open(src_file, 'rb'), as_attachment=True, filename="tseg-medeelel.pdf")
    return response
