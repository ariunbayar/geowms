from django import forms

from .models import EmployeeAddress
from .models import Employee


class EmployeeAddressForm(forms.ModelForm):

    class Meta:

        model = EmployeeAddress

        fields = [
            'level_1',
            'level_2',
            'level_3',
            'street',
            'apartment',
            'door_number',
            'point'
        ]


class EmployeeForm(forms.ModelForm):

    class Meta:

        model = Employee

        fields = [
            'token',
            'phone_number',
            'state',
        ]

        error_messages = {
            'token': {
                'required': 'Токен оруулна уу!',
            },
            'phone_number': {
                'required': 'Утасны дугаар оруулна уу!',
                'max_length': 'Утасны дугаар %(limit_value)d тэмдэгт байх ёстой!',
            },
            'state': {
                'required': 'Ажилтны төлөв оруулна уу!',
            },
        }
