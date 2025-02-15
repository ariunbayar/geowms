from django import forms
from django.contrib.auth.forms import UserCreationForm
from geoportal_app.models import User

class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ["email", "password1", "password2"]


class LoginForm(forms.ModelForm):
    email = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'И-Мэйл хаяг'}), label='И-Мэйл хаяг')
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Нууц үг'}), label='Нууц үг')
    class Meta:
        model = User
        fields = ('email', 'password')


class ApproveForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Нууц үг'}), label='Нууц үг')
    re_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Нууц үгийг давтаж оруулна уу'}), label='')
    class Meta:
        model = User
        fields = ('password', 're_password')
