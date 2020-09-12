import requests

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from geoportal_app.models import User
from .qpay import Qpay
from backend.payment.models import Payment



# Create your views here.


@require_POST
@ajax_required
def create(request, payload):

    price = payload.get('price')
    purchase_id = payload.get('purchase_id')

    purhcase = Payment.objects.filter(id=purchase_id).first()

    qpay = Qpay(request, price, purhcase)
    #Токен үүсгэж байна.
    qpay.authenticate()
    data = qpay.create()
    json_data = data.json()
    if data.status_code == 200:
        return JsonResponse({'qPay_QRimage': json_data['qPay_QRimage'], "error_message": '', 'success': False})
    else:
        if json_data['name'] == 'INVOICE_PAID':
            return JsonResponse({'qPay_QRimage': '', "error_message": json_data['message'], 'success': True})


@require_POST
@ajax_required
def check(request, payload):

    purchase_id = payload.get('purchase_id')
    purhcase = Payment.objects.filter(id=purchase_id).first()
    qpay = Qpay(request, 0, purhcase)
    #Токен үүсгэж байна.
    qpay.authenticate()
    data = qpay.check()
    if data['payment_info']['payment_status'] == 'PAID':
        return JsonResponse({'success': True, 'error_message':'Төлөгдсөн төлбөрийн дугаар'})
    else:
        return JsonResponse({'success': False, 'error_message':' '})



