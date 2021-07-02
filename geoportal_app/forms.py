
from frontend.secure import form
from django import forms
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
                'required': 'Регистрээ оруулна уу!',
                'max_length': 'Регистр %(limit_value)d тэмдэгт байх ёстой!',
            },
        }

    def __init__(self, *args, **kwargs):
        self.has_username = kwargs.pop('has_username')
        super(UserForm, self).__init__(*args, **kwargs)
        self.fields['check'].widget = forms.TextInput(attrs={'size':has_username})

    def clean_username(self):
        print(self.has_username)
        print(self.has_username)
        print(self.has_username)
        # if self.has_username:
        #     if "username" not in self.errors:
        #         errors = self.errors['username']
        #         print(errors)
                # for error in errors:
                    # print
                    # if error == 'Ийм хэрэглэгчийн нэртэй хэрэглэгч өмнө нь бүртгүүлсэн байна.':
        pass
