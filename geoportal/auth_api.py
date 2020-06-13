from datetime import timedelta
from os import urandom
from urllib.parse import urlencode
import base64
import json
import requests

from django.utils import timezone
from django.conf import settings


class GeoAuth():

    SESSION_STATE_NAME = 'geo_sso_state'
    BASE_HEADERS = {
            'User-Agent': 'tz.mohs.mn 1.0'
        }

    def __init__(self, request):
        self.request = request
        self.access_token = None
        self.access_token_expire_at = None

    def is_step1(self):
        return not self.is_step2()

    def step1_generate_state(self):
        state = urandom(32).hex()
        self.request.session[self.SESSION_STATE_NAME] = state

    def step1_set_scope(self, payload):
        self.scope = base64.b64encode(json.dumps(payload).encode()).decode()

    def step1_build_redirect_uri(self):
        params = {
                'client_key': settings.GEO_SSO['CLIENT_KEY'],
                'redirect_uri': settings.GEO_SSO['REDIRECT_URI'],
                'state': self.request.session[self.SESSION_STATE_NAME],
                'scope': self.scope,
            }
        url = settings.GEO_SSO['ENDPOINTS']['LOGIN'] + urlencode(params)
        return url

    def is_step2(self):
        state = self.request.GET.get('state')
        auth_code = self.request.GET.get('auth_code')
        return auth_code and state

    def step2_is_state_valid(self):
        state = self.request.GET.get('state')
        session_state = self.request.session.get(self.SESSION_STATE_NAME)
        return state == session_state

    def step2_fetch_access_token(self):
        params = {
                'client_key': settings.GEO_SSO['CLIENT_KEY'],
                'client_secret': settings.GEO_SSO['CLIENT_SECRET'],
                'redirect_uri': settings.GEO_SSO['REDIRECT_URI'],
                'auth_code': self.request.GET.get('auth_code'),
            }
        url = settings.GEO_SSO['ENDPOINTS']['AUTHORIZE'] + urlencode(params)
        rsp = requests.post(url, data={}, headers=self.BASE_HEADERS)
        if rsp.status_code == 200:
            token_info = rsp.json()
            is_valid = all([
                # TODO validate token_info['scope']?
                token_info['token_type'] == 'Bearer',
                len(token_info['access_token']) <= 128,
            ])
            if is_valid:
                self.access_token = token_info['access_token']
                self.access_token_expire_at = timezone.now() + timedelta(seconds=token_info['expires_in'])

    def is_step3(self):
        print("step3")
        return self.access_token is not None

    def step3_fetch_scope_data(self):
        is_expired = timezone.now() > self.access_token_expire_at
        if not is_expired:
            url = settings.GEO_SSO['ENDPOINTS']['SERVICE']
            headers = {
                    **self.BASE_HEADERS,
                    'Authorization': 'Bearer %s' % self.access_token
                }
            rsp = requests.post(url, headers=headers)
            if rsp.status_code == 200:
                return rsp.json()

        return None
