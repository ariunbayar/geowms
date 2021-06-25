import requests
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from main.decorators import ajax_required, llc_required
from django.contrib.auth.decorators import login_required
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


@login_required(login_url='/secure/login/')
def llc_frontend(request):
    is_sso_user = get_object_or_404(User, username=request.user, is_sso=True)
    register = is_sso_user.register
    token_url = 'https://license.gazar.gov.mn/api/engineer/001/{register}'.format(
        register=register
    )
    rsp = requests.get(token_url, headers=HEADERS, verify=False)
    content = {}
    if rsp.status_code == 200:
        content['llc_detail'] = rsp.json()

    return render(request, 'llc/index.html', content)


@require_POST
@ajax_required
def get_tool_datas(request, payload):
    regis_number = payload.get('regis_number') or 2841134
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
        for tool_data in tool_datas:
            expired_date = datetime.strptime(tool_data['expired_date'], "%Y-%m-%d %H:%M:%S")
            confirmed_date = datetime.strptime(tool_data['confirmed_date'], "%Y-%m-%d %H:%M:%S")
            tool_data['expired_date'] = datetime_to_string(expired_date)
            tool_data['confirmed_date'] = datetime_to_string(confirmed_date)

    return JsonResponse({
        'tool_datas': tool_datas
    })
