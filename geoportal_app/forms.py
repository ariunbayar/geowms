from django import forms
from django.db.models.query_utils import Q

from geoportal_app.models import User


class UserForm(forms.ModelForm):

    class Meta:

        model = User

        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'register',
            'gender',
            'is_sso',
            'is_user',
        ]

        error_messages = {
            'username': {
                'required': 'Нэвтрэх нэрийг оруулна уу!',
                'max_length': 'Нэвтрэх нэр %(limit_value)d тэмдэгт байх ёстой!',
                'unique': 'Хэрэглэгч бүртгэлтэй байна!',
            },
            'last_name': {
                'required': 'Овогоо оруулна уу!',
                'max_length': 'Овог %(limit_value)d тэмдэгт байх ёстой!',
            },
            'first_name': {
                'required': 'Нэрээ оруулна уу!',
                'max_length': 'Нэр %(limit_value)d тэмдэгт байх ёстой!',
            },
            'email': {
                'required': 'Мэйлээ оруулна уу!',
                'max_length': 'Мэйл %(limit_value)d тэмдэгт байх ёстой!',
            },
            'gender': {
                'required': 'Хүйсээ оруулна уу!',
                'max_length': 'Хүйс %(limit_value)d тэмдэгт байх ёстой!',
            },
            'register': {
                'required': 'Хоосон байна. Утга оруулна уу!',
                'max_length': 'Регистрийн дугаар %(limit_value)d тэмдэгт байх ёстой!',
            },
        }

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        if self.instance:
            user = User.objects.filter(~Q(username=self.instance), email=email).first()
            if user:
                self.add_error('email', 'Бүртгэлтэй мэйл хаяг байна!')
