from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from main.decorators import ajax_required
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB
from backend.payment.models import Payment

def index(request):

    context = {
        'purchase': "purchase"
    }

    return render(request, 'payment/index.html', context)


@require_POST
@ajax_required
def dictionaryRequest(request, payload):
    purchase_all = payload.get('purchase_all')
    # Хүсэлт илгээх xml датаг бэлтгэх
    mbutil = MBUtil(purchase_all['amount'], purchase_all['description'])
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
