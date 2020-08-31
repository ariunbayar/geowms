from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from main.decorators import ajax_required

from .MBUtil import MBUtil
from .PaymentMethod import PaymentMethod
from .PaymentMethodMB import PaymentMethodMB


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
