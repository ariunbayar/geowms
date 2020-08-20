from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET
import random
from main.decorators import ajax_required
from datetime import date
import datetime
from backend.payment.models import Payment


def history(request):

    return render(request, 'profile/index.html', {})



def all(request):
    print("wwwwwwwwwwwwwwww")
    print("wwwwwwwwwwwwwwww")
    print("wwwwwwwwwwwwwwww")

    history_all = []
    user=request.user
    for i in range(30):
        Payment.objects.create(
            id=random.randint(0, 10),
            amount=random.randint(0, 10000), 
            description="example description",
            is_success=random.choice([True, False]),
            user_id=user.id
        )
    for payment in Payment.objects.all():
        history_all.append({
            'id': payment.id,
            'amount': payment.amount,
            'description': payment.description,
            'created_at': payment.created_at,
            'is_success': payment.is_success,
            
    })
    print(history_all)
    #render(request, 'profile/index.html', {'payment': history_all})
    return JsonResponse({"payment":history_all })