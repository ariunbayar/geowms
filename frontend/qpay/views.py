import requests

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from geoportal_app.models import User
from .qpay import Qpay
from backend.payment.models import Payment
from datetime import datetime


# Create your views here.


@require_POST
@ajax_required
def create(request, payload):

    price = payload.get('price')
    purchase_id = payload.get('purchase_id')
    purhcase = Payment.objects.filter(id=purchase_id).first()
    try:
        qpay = Qpay(request, price, purhcase)
        #Токен үүсгэж байна.
        qpay.authenticate()
        data = qpay.create()
    except Exception:
        rsp = {
            'success': False,
            'msg': "Алдаа гарсан тул дахин оролдоно уу"
        }
    json_data = data.json()
    if data.status_code == 200:
        rsp = {
            'qPay_QRimage': json_data['qPay_QRimage'],
            "error_message": '',
            'success': False,
        }
    else:
        if json_data['name'] == 'INVOICE_PAID':
            rsp = {
                'qPay_QRimage': '',
                "error_message": json_data['message'],
                'success': True,
            }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def check(request, payload):

    purchase_id = payload.get('purchase_id')
    purhcase = Payment.objects.filter(id=purchase_id).first()
    if purhcase:
        qpay = Qpay(request, 0, purhcase)
        try:
            #Токен үүсгэж байна.
            qpay.authenticate()
            data = qpay.check()
            if data:
                if data['payment_info']['payment_status'] == 'PAID':
                    pay_info = data['payment_info']
                    if pay_info['transaction_id']:
                        customer_id = pay_info['transaction_id']
                    else:
                        customer_id = ' '
                    if data['payment_info']['transactions'][0]['beneficiary_account_number']:
                        card_number = data['payment_info']['transactions'][0]['beneficiary_account_number']
                    else:
                        card_number = ' '
                    if not purhcase.is_success:
                        Payment.objects.filter(id=purchase_id).update(is_success=True, success_at=datetime.now(),bank_unique_number=customer_id , card_number=card_number , code=0, message="Худалдан авалт амжилттай болсон.", qpay_rsp=data)
                    rsp = {
                        'success': True,
                        'msg':'Төлөгдсөн төлбөрийн дугаар'
                    }
                else:
                    rsp = {
                        'success': False,
                        'msg': 'Мэдээлэл олдсонгүй'
                    }
            else:
                rsp = {
                    'success': False,
                }
        except Exception:
            rsp = {
                'success': False,
                'msg': "Хүсэлт амжилтгүй болсон"
            }
        except ConnectionError:
            rsp = {
                'success': False,
                'msg': "Шалгах явцад алдаа гарсан тул Дахин оролдоно уу"
            }
    else:
        rsp = {
            'success': False,
            'msg': 'Мэдээлэл олдсонгүй'
        }
    return JsonResponse(rsp)

