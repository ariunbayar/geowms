from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render


@user_passes_test(lambda u: u.is_superuser)
def index(request):
    return render(request, "backend/webapp.html", {})

def access(request):
    return render(request, 'backend/access.html')

def huulga(request):
    return render(request, 'backend/huulga.html')

def log(request):
    return render(request, 'backend/log.html')