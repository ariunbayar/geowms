from django.shortcuts import render


def service(request):
    return render(request, 'page/service.html')


def help(request):
    return render(request, 'page/help.html')


def statistics(request):
    return render(request, 'page/statistics.html')
