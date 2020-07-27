from django.shortcuts import render
from django.conf import settings
from django.contrib import auth, messages
from django.http import Http404
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET, require_POST
from django.core.mail import EmailMessage
from django.core.mail import EmailMultiAlternatives
from geoportal_app.models import User, Role
from django.template.loader import get_template
from django.template.loader import render_to_string
import requests
from django.http import JsonResponse, HttpResponse

from .MBUtil import *


class Orders():
    pass

def dictionaryRequest(request):
    if request.method == 'GET':
        allLesson = Orders()
        allLesson.bank= 910000
        allLesson.accountId=900012408
        allLesson.accountName="Tuguldur"
        allLesson.description="Газар зарсан"
        allLesson.amount=2000
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

        queryargs = request.GET
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

