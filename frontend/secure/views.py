from django.conf import settings
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import redirect
from django.views.decorators.http import require_GET
from geoportal_app.models import User

from main.auth_api import GeoAuth


def login_dan(request):

    geo_auth = GeoAuth(request)

    if geo_auth.is_step1():

        payload = [
            {
                # Оролтын параметргүй дуудагддаг сервис
                'services' : [
                    "WS100101_getCitizenIDCardInfo",                                    # сервис код
                ],
                'wsdl' : "https://xyp.gov.mn/citizen-1.3.0/ws?WSDL",                    # wsdl зам
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
                    is_superuser=True,
                )

            auth.login(request, user)
            return redirect(settings.LOGIN_REDIRECT_URL)

    raise Http404


@require_GET
@login_required
def logout(request):
    auth.logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)
