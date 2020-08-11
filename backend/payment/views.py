from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from geoportal_app.models import User
from .models import Payment

@require_POST
@ajax_required
def paymentAll(request, payload):
    last=payload.get("last")
    first=payload.get("first")
    payment_display = []
    #layers = Payment.objects.all().order_by('success_at'))
    for payment in Payment.objects.all()[first:last]:
        payment_display.append({
            'number': payment.number,
            'amount': payment.amount,
            'description': payment.description,
            'is_success':payment.is_success,
            'success_at':payment.success_at,
            'user_id': payment.user_id,
            'created_at': payment.created_at,
        })
    return JsonResponse({
    'payment':  payment_display,
    'len':Payment.objects.all().count()
    })

@require_POST
@ajax_required
def purchase(request, payload):

    user = get_object_or_404(User, pk=request.user.id)
    price = payload.get('price')
    description = payload.get('description')
    count = Payment.objects.all().count()
    payment = Payment.objects.create(number=count, amount=price, description=description, user=user, is_success=False )
    
    return JsonResponse({'payment_id': payment.id})


@require_POST
@ajax_required
def purchaseAll(request, payload):
    
    purchase_id = payload.get('purchase_id')
    purchase_all=[] 
    for payment in Payment.objects.filter(pk=purchase_id):
        purchase_all.append({
            'number': payment.id,
            'amount': payment.amount,
            'description': payment.description,
            'user': payment.user,
            'created_at': payment.created_at,
        })

    return JsonResponse({'purchase_all': purchase_all})