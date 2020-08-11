from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET

from main.decorators import ajax_required

from backend.payment.models import Payment

def history(request):
    return render(request, 'profile/index.html')