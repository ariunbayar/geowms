from django import forms

from govorg.backend.org_request.models import ChangeRequest as Order


class OrderForm(forms.ModelForm):

    class Meta:

        model = Order

        fields = [
            'order_at',
            'order_no',
        ]

        error_messages = {
            'order_at': {'required': 'Оруулна уу!'},
            'order_no': {'required': 'Оруулна уу!'},
        }
