from django.conf import settings
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_GET
from backend.user.models import User

from geoportal.auth_api import MohsAuth


def _get_user_redir(request, user):

    return redirect('bundle')


@csrf_protect
def login(request):
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if username and password:
            user = auth.authenticate(request, username=username, password=password)
            if user:  # Login is success
                auth.login(request, user)
                track_stat('login_success')
                return _get_user_redir(request, user)
            else:
                # login fails
                context['error'] = 'Нэвтрэх нэр, нууц үг буруу байна'
        else:
            context['error'] = 'Нэвтрэх нэр, нууц үгээ оруулна уу'
        context['username'] = username
        track_stat('login_fail')
    return render(request, 'secure/login.html', context)


def login_api(request):

    mohs_auth = MohsAuth(request)


    if mohs_auth.is_step1():

        payload = [
            {
                # Оролтын параметргүй дуудагддаг сервис
                'services' : [
                    "WS100101_getCitizenIDCardInfo",                                    # сервис код
                ],
                'wsdl' : "https://xyp.gov.mn/citizen-1.3.0/ws?WSDL",                    # wsdl зам
            },
            # {
                # 'services' : [
                    # "WS100201_getPropertyInfo",                                         # сервис код
                # ],
                # 'wsdl' : "https://xyp.gov.mn/property-1.2.0/ws?WSDL",                   # wsdl зам
                # 'params': {                                                             # Оролтын параметртэй дуудагддаг сервис бол
                    # "WS100201_getPropertyInfo": {                                       # сервис код
                        # 'propertyNumber': 'value',                                      # Оролтын параметрууд
                    # },
                # }
            # }
        ]

        mohs_auth.step1_generate_state()
        mohs_auth.step1_set_scope(payload)
        url = mohs_auth.step1_build_redirect_uri()
        return redirect(url)

    if mohs_auth.is_step2():
        print("is_step2")
        if not mohs_auth.step2_is_state_valid():
            raise Http404
        mohs_auth.step2_fetch_access_token()

    if mohs_auth.is_step3():
        data = mohs_auth.step3_fetch_scope_data()

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
                )

            auth.login(request, user)
            return redirect('bundle:all')

    raise Http404


@require_GET
@login_required
def logout(request):
    auth.logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)
