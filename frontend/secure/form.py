from django import forms
from django.contrib.auth.forms import UserCreationForm
from geoportal_app.models import User

class RegisterForm(UserCreationForm):
    # email = forms.EmailField(help_text='Зөв имэйл хаяг оруулна уу..')
    class Meta:
        model = User
        fields = ["email", "password1", "password2"]


class LoginForm(forms.ModelForm):
    email = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Е-Мэйл хаяг'}), label='Е-Мэйл хаяг')
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Нууц үг'}), label='Нууц үг')
    # password = forms.CharField(max_length=32, label='Нууц үг')
    class Meta:
        model = User
        fields = ('email', 'password')
