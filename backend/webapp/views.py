from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render


@user_passes_test(lambda u: u.is_superuser)
def index(request):
    return render(request, "backend/webapp.html", {})

@user_passes_test(lambda u: u.is_superuser)
def access(request):
    return render(request, 'backend/access.html')

@user_passes_test(lambda u: u.is_superuser)
def huulga(request):
    return render(request, 'backend/huulga.html')

@user_passes_test(lambda u: u.is_superuser)
def log(request):
    return render(request, 'backend/log.html')