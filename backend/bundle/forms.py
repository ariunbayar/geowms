from django import forms
from .models import Bundle

class BundleForm(forms.ModelForm):

    class Meta:

        model = Bundle

        fields = [
                'name',
                # 'price',
                'layers',
            ]

        widgets = {'layers': forms.CheckboxSelectMultiple}

        labels = {
                'name': 'Багцийн нэр',
                # 'price': 'Багцийн үнэ',
                'layers': 'Давхаргууд',
            }

        error_messages = {
                'name': {'required': 'Оруулна уу!'},
                # 'price': {'required': 'Оруулна уу!'},
                'layers': {'required': 'Оруулна уу!'},
            }
