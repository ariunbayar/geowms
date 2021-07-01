from django import forms

from .models import ChangeRequest


class ChangeRequestForm(forms.ModelForm):

    class Meta:

        model = ChangeRequest

        fields = [
            'theme_id',
            'package_id',
            'feature_id',
        ]

        error_messages = {
            'theme_id': {'required': '"THEME" тохируулна уу!'},
            'package_id': {'required': '"PACKAGE" тохируулна уу!'},
            'feature_id': {'required': '"FEATURE" тохируулна уу!'},
        }
