from django import forms
from .models import WMS

class WMSForm(forms.ModelForm):

    class Meta:

        model = WMS


        fields = [
                'name',
                'url'
            ]

        widgets = {}

        labels = {
                'name': 'WMS',
                'url': 'URL',
            }

        error_messages = {
                'name': {'required': 'Оруулна уу!'},
                'url': {'required': 'Оруулна уу!'},
            }
