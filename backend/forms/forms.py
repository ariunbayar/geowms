from django import forms
from .models import TsegPersonal

class TsegPersonalForm(forms.ModelForm):

    class Meta:

        model = TsegPersonal

        fields = [
                'tesgiin_ner',
                'toviin_dugaar',
                'trapetsiin_dugaar',
                'suljeenii_torol',
                'aimag_name',
                'sum_name',
                'utmx',
                'utmy',
                'latlongx',
                'latlongy',
                'barishil_tuhai',
                'sudalga_or_shine',
                'hors_shinj_baidal',
                'hotolson',
                'alban_tushaal',
                'alban_baiguullga',
            ]

        error_messages = {
                'tesgiin_ner': {'required': 'Оруулна уу!'},
                'toviin_dugaar': {'required': 'Оруулна уу!'},
                'trapetsiin_dugaar': {'required': 'Оруулна уу!'},
                'suljeenii_torol': {'required': 'Оруулна уу!'},
                'aimag_name': {'required': 'Оруулна уу!'},
                'sum_name': {'required': 'Оруулна уу!'},
                'utmx': {'required': 'Оруулна уу!'},
                'utmy': {'required': 'Оруулна уу!'},
                'latlongx': {'required': 'Оруулна уу!'},
                'latlongy': {'required': 'Оруулна уу!'},
                'barishil_tuhai': {'required': 'Оруулна уу!'},
                'sudalga_or_shine': {'required': 'Оруулна уу!'},
                'hors_shinj_baidal': {'required': 'Оруулна уу!'},
                'hotolson': {'required': 'Оруулна уу!'},
                'alban_tushaal': {'required': 'Оруулна уу!'},
                'alban_baiguullga': {'required': 'Оруулна уу!'},
            }
