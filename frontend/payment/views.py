import requests
from xml.etree.ElementTree import tostring
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import redirect
from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required

from geoportal_app.models import User
from .MBUtil import xmlConvert
from .PaymentMethod import paymentMethod
from .PaymentMethodMB import paymentMethodMB


def index(request):

    context = {
        'purchase': "purchase"
    }

    return render(request, 'payment/index.html', context)


@require_POST
@ajax_required
def dictionaryRequest(request, payload):

    purchase_all = payload.get('purchase_all')
    amount = purchase_all['amount']
    payment_id = purchase_all['id']
    description = purchase_all['description']
    finalRequest = xmlConvert(amount, description)
    paymentRequest = paymentMethod(finalRequest)

    if not paymentRequest:
        return JsonResponse({'message': "Банкны сервертэй холбогдох үед алдаа гарлаа", "success": False })
    else:
        message = paymentMethodMB(paymentRequest, payment_id)
        if message:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False})
            

def dictionaryResponse(request):
    
    if request.method == 'GET':
        print("Dsdfsdfsddfgdf")

        return JsonResponse({'success': True, 'xmlmsg': 12})


