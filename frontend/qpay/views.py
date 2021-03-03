import os
import time

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_POST
from django.conf import settings

from main.decorators import ajax_required
from backend.payment.models import Payment
from .qpay import Qpay


@require_POST
@ajax_required
@login_required
def create(request, payload):

    purchase_id = payload.get('purchase_id')
    purhcase = Payment.objects.filter(id=purchase_id).first()

    if request.user == purhcase.user:
        qpay = Qpay(request, purhcase)

        #Токен үүсгэж байна.
        qpay.authenticate()
        data = qpay.create()
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
    else:
        rsp =  {
            'error': True,
            'error_message': 'Та энэ худалдан авалтыг үүсгээгүй байна'
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def check(request, payload):

    success = False
    msg = ''

    purchase_id = payload.get('purchase_id')
    purhcase = Payment.objects.filter(id=purchase_id).first()

    if purhcase:
        qpay = Qpay(request, purhcase)
        try:
            #Токен үүсгэж байна.
            qpay.authenticate()
            data = qpay.check()

            # XXX Debug payment code
            if settings.DEBUG and os.getenv('QPAY_FAKE') == '1':
                data = {
                    'payment_info': {
                        'payment_status': 'PAID',
                        'transaction_id': 'fake_%d' % int(time.time()),
                        'transactions': [
                            {
                                'beneficiary_account_number': ' ',
                            },
                        ]
                    }
                }

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

                        msg = 'Худалдан авалт амжилттай болсон.'
                        success = True

                        payment = Payment.objects
                        payment = payment.filter(id=purchase_id)
                        payment = payment.update(
                            is_success=success,
                            success_at=localtime(now()),
                            bank_unique_number=customer_id,
                            card_number=card_number,
                            code=0,
                            message=msg,
                            qpay_rsp=data
                        )

                else:
                    success = False
                    msg = 'Мэдээлэл олдсонгүй'

            else:
                success = False
                msg = 'Мэдээлэл олдсонгүй'

        except Exception:
            success = False
            msg = "Хүсэлт амжилтгүй болсон"

        except ConnectionError:
            success = False
            msg = "Шалгах явцад алдаа гарсан тул Дахин оролдоно уу"

    else:
        success = False
        msg = 'Мэдээлэл олдсонгүй'

    rsp = {
        'success': success,
        'msg': msg
    }
    return JsonResponse(rsp)

