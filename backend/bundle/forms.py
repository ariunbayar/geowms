from django import forms
from .models import Bundle

class BundleForm(forms.ModelForm):
    class Meta:

        model = Bundle

        fields = [
                'layers',
            ]

        labels = {
                'layers': 'Давхаргууд',
        }

