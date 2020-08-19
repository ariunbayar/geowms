import requests
from xml.etree.ElementTree import tostring
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import redirect
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from main.decorators import ajax_required

from geoportal_app.models import User
from .MBUtil import (
        objectToXmlAccount,
        objectToXmlAccounts,
        PaymentVerifyRequestMB,
        bytesToHex,
        encrypts,
        signKey
    )

    
def index(request):

    context = {
        'purchase': "purchase"
    }

    return render(request, 'payment/index.html', context)


@require_POST
@ajax_required
def dictionaryRequest(request, payload):

    price = payload.get('price')

    # Account xml
    account = objectToXmlAccount(price)
    # Accounts xml
    accounts = objectToXmlAccounts(account)
    # encrypt accounts and convert to hex
    encryptedAccounts = encrypts(accounts)
    encAccounts = bytesToHex(encryptedAccounts)
    # encrypt Desede key of payment request and convert to hex

    encryptedKey = signKey(encAccounts)
    encKey = bytesToHex(encryptedKey)
    # create request xml
    finalRequest = PaymentVerifyRequestMB(price, encAccounts, encKey)
    for i in finalRequest:
        print(tostring(i))
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    headers = {**BASE_HEADERS}

    base_url = 'http://localhost:8000/dictionaryResponse'

    rsp = requests.get(base_url, data={"order": finalRequest}, headers=headers)

    if rsp.status_code == 200:
        # send mail
        user = User.objects.filter(username=request.user).first()
        mail_subject = 'Өдрийн мэнд.'
        message = "amjilt husiidaa"
        email = EmailMultiAlternatives(mail_subject, message, to=[user.email])
        email.attach_file(settings.MONGOL_BANK_SUCCESS_HTML)

        email.send()
        return redirect(settings.PAYMENT_SUCCESS_REDIRECT_URL)
    else:
        return redirect(settings.PAYMENT_FAIL_REDIRECT_URL)


def dictionaryResponse(request):

    if request.method == 'GET':
        return JsonResponse({'success': True})
