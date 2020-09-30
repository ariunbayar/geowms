from django import forms
from .models import Bundle

class BundleForm(forms.ModelForm):

    class Meta:

        model = Bundle

        fields = [
                'name',
                'layers',
            ]

        widgets = {'layers': forms.CheckboxSelectMultiple}

        labels = {
                'name': 'Багцийн нэр',
                'layers': 'Давхаргууд',
            }

        error_messages = {
                'name': {'required': 'Оруулна уу!'},
                'layers': {'required': 'Оруулна уу!'},
            }
