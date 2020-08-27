from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET, require_POST
import random
from main.decorators import ajax_required
from datetime import date
import datetime
from backend.payment.models import Payment
from geoportal_app.models import User


def history(request):

    return render(request, 'profile/index.html', {"profile": "profile"})


@require_POST
@ajax_required
def all(request,payload):
    last = payload.get('last')
    first = payload.get('first')
    history_all = []
    for payment in Payment.objects.all()[first:last]:
        if(payment.created_at):
            created_at = payment.created_at.strftime('%Y-%m-%d')
        else:
            created_at = datetime.datetime(1, 1, 1, 0, 0).strftime('%Y-%m-%d')

        if(payment.success_at):
            success_at = payment.success_at.strftime('%Y-%m-%d')
        else:
            success_at =  datetime.datetime(1, 1, 1, 0, 0).strftime('%Y-%m-%d')
        history_all.append({
            'id': payment.id,
            'amount': payment.amount,
            'description': payment.description,
            'created_at': created_at,
            'is_success': payment.is_success,
            'user_id':payment.user_id,
            'bank_unique_number':payment.bank_unique_number,
            'data_id':payment.data_id,
            'geo_unique_number':payment.geo_unique_number,
            'success_at':success_at,
    })

    return JsonResponse({
        "payment":history_all,
        'len':Payment.objects.all().count()
    })
