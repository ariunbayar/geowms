import requests

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import redirect
from django.http import JsonResponse

from geoportal_app.models import User

from .MBUtil import (
        objectToXmlAccount,
        objectToXmlAccounts,
        PaymentVerifyRequestMB,
        bytesToHex,
        encrypts,
    )


class Orders():
    pass


def dictionaryRequest(request):
    if request.method == 'GET':
        allLesson = Orders()
        allLesson.bank = 910000
        allLesson.accountId = 900012408
        allLesson.accountName = "Tuguldur"
        allLesson.description = "Газар зарсан"
        allLesson.amount = 2000
        # Account xml
        account = objectToXmlAccount(allLesson)
        # Accounts xml
        accounts = objectToXmlAccounts(account)
        #encrypt accounts and convert to hex
        encryptedAccounts = encrypts(accounts)
        encAccounts = bytesToHex(encryptedAccounts)
        #encrypt Desede key of payment request and convert to hex

        ##encryptedKey = signKey("encAccounts")
        ##encKey = bytesToHex(encryptedKey)
        encKey = encAccounts
        #create request xml
        finalRequest = PaymentVerifyRequestMB(allLesson.amount, encAccounts, encKey)
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
