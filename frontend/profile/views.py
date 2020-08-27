from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET

from main.decorators import ajax_required
from backend.payment.models import Payment


@require_GET
@login_required
def history(request):

    return render(request, 'profile/index.html', {"profile": "profile"})

def _datetime_display(dt):
    return dt.strftime('%Y-%m-%d') if dt else None

def _get_payment_display(payment):


    return {
        'id': payment.id,
        'amount': payment.amount,
        'description': payment.description,
        'created_at': _datetime_display(payment.created_at),
        'is_success': payment.is_success,
        'user_id': payment.user_id,
        'bank_unique_number': payment.bank_unique_number,
        'data_id': payment.data_id,
        'geo_unique_number': payment.geo_unique_number,
        'success_at': _datetime_display(payment.success_at),
    }


@require_POST
@ajax_required
@login_required
def all(request, payload):

    last = payload.get('last')
    first = payload.get('first')

    payment_list_display = [
        _get_payment_display(payment)
        for payment in Payment.objects.all()[first:last]
    ]

    return JsonResponse({
        "payment": payment_list_display,
        'len': Payment.objects.all().count()
    })
