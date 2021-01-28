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
            'order_at': {'required': 'Тушаалын огноог оруулна уу!'},
            'order_no': {
                'required': 'Тушаалын дугаарыг оруулна уу!',
                'max_length': 'Тушаалын дугаарын тэмдэгт %(limit_value)d байх ёстой! (Таных %(show_value)d байна)'
            },
        }
