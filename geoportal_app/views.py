from django.conf import settings
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.shortcuts import render, redirect
from django.urls import reverse
from .form import RegisterForm, LoginForm
from django.contrib import messages
from .models import *
from geoportal_app.models import User


def register(response):
    if response.method == "POST":
        form = RegisterForm(response.POST)
        if form.is_valid():
            form.save()

        return HttpResponseRedirect(reverse('login'))
    else:
        form = RegisterForm()
    return render(response, "register.html", {"form": form})
#
# def login(request):
#     form = LoginForm()
#     return render(request, 'login.html', {"form": form})

def loginUser(request):
    return render(request, 'loginUser.html')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password')
        try:
            b_user = User.objects.get(email=email)
            username = b_user.username

            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)
                    return redirect(settings.LOGIN_REDIRECT_URL)
                else:
                    messages.warning(request, 'Таны хаяг идэвхгүй байна.')
                    return HttpResponseRedirect(reverse('login'))
            else:
                messages.warning(request, 'Нэвтрэх оролдлого амжилтгүй боллоо.')
                return HttpResponseRedirect(reverse('login'))
        except:
            messages.warning(request, 'Буруу и-мэйл оруулсан байна!!!')
            return HttpResponseRedirect(reverse('login'))
    form = LoginForm()
    return render(request, 'login.html', {'form': form})


def logout(request):
    auth_logout(request)
    return redirect('login')
