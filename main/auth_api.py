from datetime import timedelta
from os import urandom
from urllib.parse import urlencode
import base64
import json
import requests

from django.utils import timezone
from django.conf import settings


class GeoAuth():

    SESSION_STATE_NAME = 'xyp_dan_state'
    BASE_HEADERS = {
            'User-Agent': 'geoportal 1.0'
        }

    def __init__(self, request):
        self.request = request
        self.access_token = None
        self.access_token_expire_at = None


    def is_step1(self):
        return not self.is_step2()

    def step1_build_redirect_uri(self, payload):

        state = urandom(32).hex()
        self.request.session[self.SESSION_STATE_NAME] = state

        self.scope = base64.b64encode(json.dumps(payload).encode()).decode()

        base_uri = settings.SSO_GOV_MN['ENDPOINTS']['AUTHORIZE']

        if not base_uri.endswith('?'):
            base_uri += '?'

        params = {
                'response_type': 'code',
                'client_id': settings.SSO_GOV_MN['CLIENT_ID'],
                'redirect_uri': settings.SSO_GOV_MN['CALLBACK_URI'],
                'scope': self.scope,
                'state': state,
            }

        return base_uri + urlencode(params)

    def is_step2(self):
        state = self.request.GET.get('state')
        auth_code = self.request.GET.get('code')
        return auth_code and state

    def step2_is_state_valid(self):
        state = self.request.GET.get('state')
        session_state = self.request.session.get(self.SESSION_STATE_NAME)
        return state == session_state

    def step2_fetch_access_token(self):

        BASE_HEADERS = {
            'User-Agent': 'nsdi.gov.mn/oauth2 1.0'
        }

        base_uri = settings.SSO_GOV_MN['ENDPOINTS']['TOKEN']
        if not base_uri.endswith('?'):
            base_uri += '?'

        params = {
                'grant_type': 'authorization_code',
                'code': self.request.GET.get('code'),
                'client_id': settings.SSO_GOV_MN['CLIENT_ID'],
                'client_secret': base64.b64encode(settings.SSO_GOV_MN['CLIENT_SECRET'].encode()),
                'redirect_uri': settings.SSO_GOV_MN['CALLBACK_URI'],
            }

        rsp = requests.post(base_uri,  data=params, headers=self.BASE_HEADERS)

        token_info = rsp.json()

        self.access_token = token_info['access_token']


    def step3_fetch_service(self):

        BASE_HEADERS = {
            'User-Agent': 'nsdi.gov.mn/oauth2 1.0'
        }

        base_uri = settings.SSO_GOV_MN['ENDPOINTS']['SERVICE']

        headers = {
                **self.BASE_HEADERS,
                'Authorization': 'Bearer %s' % self.access_token,
            }
        rsp = requests.post(base_uri, headers=headers)
        if rsp.status_code == 200:
            return rsp.json()

        return '{"success": false}'
