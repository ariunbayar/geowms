from django import forms

from .models import RequestFilesShape


class RequestFilesShapeForm(forms.ModelForm):

    class Meta:

        model = RequestFilesShape

        fields = [
            'theme_id',
            'package_id',
            'feature_id',
            'order_no',
            'order_at',
        ]

        error_messages = {
            'theme_id': {'required': '"THEME" тохируулна уу!'},
            'package_id': {'required': '"PACKAGE" тохируулна уу!'},
            'feature_id': {'required': '"FEATURE" тохируулна уу!'},
            'order_no': {'required': 'Тушаалын дугаар оруулна уу!'},
            'order_at': {'required': 'Тушаал гаргасан огноог оруулна уу!'},
        }
