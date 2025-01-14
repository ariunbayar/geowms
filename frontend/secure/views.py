import requests
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET
from main.auth_api import GeoAuth
from geoportal_app.models import User
from backend.org.models import Employee

from .form import RegisterForm, LoginForm


HEADERS = {
    'accept': 'application/json',
    'Content-type': 'application/json',
}


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]

    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


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

        url = geo_auth.step1_build_redirect_uri(payload)
        return redirect(url)


def check_llc_user(user):
    if user:
        register = user.register
        check_llc = 'https://license.gazar.gov.mn/api/engineer/001/{register}'.format(
            register=register
        )
        rsp = requests.get(check_llc, headers=HEADERS, verify=False)

        if rsp.status_code == 200:
            if rsp.json():
                return True
    return False


def oauth2(request):
    geo_auth = GeoAuth(request)

    if geo_auth.is_step2():
        geo_auth.step2_fetch_access_token()
        data = geo_auth.step3_fetch_service()

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
            auth.login(request, user)
            has_llc = check_llc_user(user)
            if has_llc:
                return render(request, 'llc/dan_user.html')

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
        captcha_check = request.POST.get('captcha_check')
        captcha_main = request.POST.get('captcha_main')

        if captcha_main != captcha_check and not settings.DEBUG:
            messages.warning(request, 'Captcha буруу байна.')
            return redirect('secure:login')

        try:
            b_user = User.objects.get(email=email)
            username = b_user.username

            user = auth.authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    org = Employee.objects.filter(user=user)
                    auth.login(request, user)
                    if user.is_superuser:
                        return redirect(settings.LOGIN_REDIRECT_ADMIN_URL)
                    elif org:
                        return redirect(settings.LOGIN_REDIRECT_ORG_URL)
                    else:
                        return redirect(settings.LOGIN_REDIRECT_URL)
                    return redirect(settings.LOGIN_REDIRECT_URL)
                else:
                    messages.warning(request, 'Таны хаяг идэвхгүй байна.')
                    return redirect('secure:login')
            else:
                messages.warning(request, 'Нэвтрэх оролдлого амжилтгүй боллоо.')
                return redirect('secure:login')

        except Exception:
            messages.warning(request, 'И-мэйл эсвэл нууц үг буруу байна!!!')
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
