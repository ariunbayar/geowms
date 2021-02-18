from django import forms

from .models import EmployeeAddress


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
