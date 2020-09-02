from django.shortcuts import render


def all(request):
    return render(request, 'org/index.html', {"org": "govorg"})
