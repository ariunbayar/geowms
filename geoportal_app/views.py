from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.shortcuts import render, redirect
from django.urls import reverse
from .form import RegisterForm, LoginForm
from django.contrib import messages
from .models import *
from geoportal_app.models import User

# Create your views here.


def index(request):
    return render(request, 'index.html')

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
            print(email,password)
            b_user = User.objects.get(email=email)
            print(b_user)
            username = b_user.username

            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)
                    return HttpResponseRedirect(reverse('index'))
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
    return render(request, 'webapp.html', {'form': form})

def logout(request):
    auth_logout(request)
    return redirect('login')


# pages
def service(request):
    return render(request, 'page/service.html')

def metaData(request):
    return render(request, 'page/meta-data.html')

def help(request):
    return render(request, 'page/help.html')

def statistics(request):
    return render(request, 'page/statistics.html')



# subs
def sub1(request):
    return render(request, "sub/sub1.html")

def sub2(request):
    return render(request, "sub/sub2.html")

def sub3(request):
    return render(request, "sub/sub3.html")

def sub4(request):
    return render(request, "sub/sub4.html")

def sub5(request):
    return render(request, "sub/sub5.html")

def sub6(request):
    return render(request, "sub/sub6.html")

def sub7(request):
    return render(request, "sub/sub7.html")

def sub8(request):
    return render(request, "sub/sub9.html")

def sub9(request):
    return render(request, "sub/sub9.html")

def sub10(request):
    return render(request, "sub/sub10.html")

def sub11(request):
    return render(request, "sub/sub11.html")

def sub12(request):
    return render(request, "sub/sub12.html")

def sub13(request):
    return render(request, "sub/sub13.html")

def sub14(request):
    return render(request, "sub/sub14.html")

def sub15(request):
    return render(request, "sub/sub15.html")

def sub16(request):
    return render(request, "sub/sub16.html")
