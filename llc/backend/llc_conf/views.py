import requests
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from main.decorators import ajax_required, llc_required
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import get_object_or_404
from geoportal_app.models import User

from main.utils import (
    datetime_to_string,
    json_load
)

HEADERS = {
    'accept': 'application/json',
    'Content-type': 'application/json',
}


@llc_required(lambda u: u)
def llc_frontend(request, content):
    content = {"company_name": content.get('company_name').upper() or ''}
    return render(request, 'llc/index.html', content)


#llc-ийг шууд дуудаж үзэх
def llc_frontend_test(request):
    return render(request, 'llc/dan_user.html')


@require_GET
@ajax_required
@llc_required(lambda u: u)
def get_tool_datas(request, content):
    regis_number = content.get('register_number')
    tool_datas = []
    token_url = 'http://192.168.10.54/api/token?email=api@gazar.gov.mn&password=hXzWneQ3vf6fkaFY'
    rsp = requests.post(token_url, headers=HEADERS, verify=False)

    if rsp.status_code == 200:
        access_token = rsp.json().get('access_token')
        bagaj_url = 'http://192.168.10.54/api/holder?regnum={registration_number}&token={access_token}'.format(
            registration_number=regis_number, access_token=access_token
        )
        rsp_bagaj = requests.post(bagaj_url, headers=HEADERS, verify=False)
        tool_datas = rsp_bagaj.json()
        tool_datas = json_load(tool_datas)
        if tool_datas:
            for tool_data in tool_datas:
                expired_date = datetime.strptime(tool_data['expired_date'], "%Y-%m-%d %H:%M:%S")
                confirmed_date = datetime.strptime(tool_data['confirmed_date'], "%Y-%m-%d %H:%M:%S")
                tool_data['expired_date'] = datetime_to_string(expired_date)
                tool_data['confirmed_date'] = datetime_to_string(confirmed_date)

    return JsonResponse({
        'tool_datas': tool_datas
    })

