from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET, require_POST
from django.core.mail import EmailMessage
from django.core.mail import EmailMultiAlternatives
from main.auth_api import GeoAuth
from geoportal_app.models import User, Role
from django.template.loader import get_template
from django.template.loader import render_to_string
import requests
from django.http import JsonResponse, HttpResponse

from .form import RegisterForm, LoginForm
from .MBUtil import *


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()

        return redirect('secure:login')
    else:
        form = RegisterForm()
    return render(request, 'secure/register.html', {"form": form})


def login_dan(request):

    geo_auth = GeoAuth(request)

    if geo_auth.is_step1():

        payload = [
            {
                # Оролтын параметргүй дуудагддаг сервис
                'services': [
                    "WS100101_getCitizenIDCardInfo",                                    # сервис код
                ],
                'wsdl': "https://xyp.gov.mn/citizen-1.3.0/ws?WSDL",                    # wsdl зам
            },
        ]

        geo_auth.step1_generate_state()
        geo_auth.step1_set_scope(payload)
        url = geo_auth.step1_build_redirect_uri()
        return redirect(url)

    if geo_auth.is_step2():
        if not geo_auth.step2_is_state_valid():
            raise Http404
        geo_auth.step2_fetch_access_token()

    if geo_auth.is_step3():
        data = geo_auth.step3_fetch_scope_data()

        services_data = data[1]

        personal_info = services_data.get('services').get('WS100101_getCitizenIDCardInfo').get('response')
        regnum = personal_info.get('regnum')
        firstname = personal_info.get('firstname')
        lastname = personal_info.get('lastname')
        civil_id = personal_info.get('civilId')
        gender = personal_info.get('gender')

        if regnum and firstname and lastname and civil_id:

            regnum = regnum.upper()
            user = User.objects.filter(register=regnum).first()
            firstname = firstname.capitalize()
            lastname = lastname.capitalize()
            if not user:
                user = User.objects.create(
                    username='civilId_{}'.format(civil_id),
                    register=regnum,
                    first_name=firstname,
                    last_name=lastname,
                    gender=gender,
                    is_sso=True,
                )
                user.roles.add(2)

            auth.login(request, user)
            if request.user_agent.is_mobile:
                return redirect(settings.LOGIN_REDIRECT_URL_MOBILE)
            else:
                return redirect(settings.LOGIN_REDIRECT_URL)

    raise Http404


def loginUser(request):
    return render(request, 'secure/loginUser.html')


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password')
        try:
            b_user = User.objects.get(email=email)
            username = b_user.username

            user = auth.authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    auth.login(request, user)
                    return redirect(settings.LOGIN_REDIRECT_URL)
                else:
                    messages.warning(request, 'Таны хаяг идэвхгүй байна.')
                    return redirect('secure:login')
            else:
                messages.warning(request, 'Нэвтрэх оролдлого амжилтгүй боллоо.')
                return redirect('secure:login')
        except Exception:
            messages.warning(request, 'Буруу и-мэйл оруулсан байна!!!')
            return redirect('secure:login')
    form = LoginForm()
    return render(request, 'secure/login.html', {'form': form})


@require_GET
@login_required
def logout(request):
    auth.logout(request)

    if request.user_agent.is_mobile:
        return redirect(settings.LOGIN_REDIRECT_URL_MOBILE)
    else:
        return redirect(settings.LOGOUT_REDIRECT_URL)


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
        encryptedKey = signKey("encAccounts")
        encKey = bytesToHex(encryptedKey)
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
            email.attach_file('/home/pc1/geo/geoWMS/frontend/secure/templates/secure/mongolbank.html')

            email.send()
            return redirect(settings.ORDER_SUCCESS)
        else:
            return redirect(settings.ORDER_FAIL)


def dictionaryResponse(request):

    if request.method == 'GET':
        return JsonResponse({'success': True})

