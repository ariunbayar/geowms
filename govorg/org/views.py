from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from main.decorators import ajax_required
from backend.payment.models import Payment


@require_GET
@login_required
def all(request):
    return render(request, 'org/index.html', {"org": "govorg"})
