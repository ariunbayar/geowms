
import requests
import json
from django.conf import settings

class Qpay():

    BASE_HEADERS = {
            'User-Agent': 'geoportal 1.0'
    }


    def __init__(self, request, purhcase):
        self.request = request
        self.purhcase = purhcase

        self.access_token = None
        self.token_type = None
        self.token_data = None
        self.token_url = 'https://api.qpay.mn/v1/payment/token'
        self.create_url = 'https://api.qpay.mn/v1/bill/create'
        self.check_url = 'https://api.qpay.mn/v1/bill/check'
        self.create_transaction_url = 'https://api.qpay.mn/v1/bill/create_with_transaction'

        self.create_data = None

    def authenticate(self):

        headers = {
                **self.BASE_HEADERS,
        }

        body = {
            "client_id": settings.QPAY['CLIENT_ID'],
            "client_secret": settings.QPAY['CLIENT_SECRET'],
            "grant_type": "client",
            "refresh_token":""
        }

        rsp = requests.post(self.token_url, body, headers=headers)

        if rsp.status_code == 200:
            self.token_data = rsp.json()
            self.access_token = self.token_data['access_token']
            self.token_type = self.token_data['token_type']

        return self.access_token

    def create(self):
        headers = {
                **self.BASE_HEADERS,
                'Authorization': 'Bearer %s' % self.access_token
        }
        # data = {
        #         "id": "CUST_001",
        #         "register_no": "ddf",
        #         "name": "Central brnach",
        #         "email": "info@info.mn",
        #         "phone_number":"99888899",
        #         "note" : "davaa"
        # }
        body = {
            "template_id": settings.QPAY['TEMPLATE_ID'],
            "merchant_id": settings.QPAY['MERCHANT_ID'],
            "branch_id": "1",
            "pos_id": "1",
            "receiver": json.dumps(data),
            "bill_no": self.purhcase.geo_unique_number,
            "date":"2019-11-22 14:30",
            "description":self.purhcase.description,
            "amount": self.purhcase.total_amount,
            "btuk_code":"",
            "vat_flag": "0"
        }

        rsp = requests.post(self.create_url, data=body, headers=headers)

        self.create_data = rsp
        return self.create_data


    def check(self):

        headers = {
                **self.BASE_HEADERS,
                'Authorization': 'Bearer %s' % self.access_token
        }
        body = {
            "merchant_id": settings.QPAY['MERCHANT_ID'],
            "bill_no": self.purhcase.geo_unique_number
        }

        rsp = requests.post(self.check_url, body, headers=headers)
        if rsp.status_code == 200:
            return rsp.json()
