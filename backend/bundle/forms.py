from django import forms
from .models import Bundle

class BundleForm(forms.ModelForm):
    class Meta:

        model = Bundle

        fields = [
                'name',
                'layers',
            ]

        labels = {
                'name': 'Багцийн нэр',
                'layers': 'Давхаргууд',
        }

        error_messages = {
                'name': {'required': 'Оруулна уу!'},
        }
