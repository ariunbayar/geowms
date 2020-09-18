from django import forms
from .models import Bundle

class BundleForm(forms.ModelForm):

    class Meta:

        model = Bundle

        fields = [
                'name',
                'module',
                'layers',
            ]

        widgets = {'layers': forms.CheckboxSelectMultiple}

        labels = {
                'name': 'Багцийн нэр',
                'module': 'Компонент',
                'layers': 'Давхаргууд',
            }

        error_messages = {
                'name': {'required': 'Оруулна уу!'},
                'module': {'required': 'Оруулна уу!'},
                'layers': {'required': 'Оруулна уу!'},
            }
