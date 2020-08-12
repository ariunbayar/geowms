from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from geoportal_app.models import User
from .models import Payment

# Create your views here.
@require_POST
@ajax_required
def purchase(request, payload):
    user = get_object_or_404(User, pk=request.user.id)
    price = payload.get('price')
    description = payload.get('description')
    data_id = payload.get('data_id')
    count = Payment.objects.all().count()
    payment = Payment.objects.create(geo_unique_number=count, data_id=data_id, amount=price, description=description, user=user, is_success=False )
    
    return JsonResponse({'payment_id': payment.id})


@require_POST
@ajax_required
def purchaseAll(request, payload):
    user = get_object_or_404(User, pk=request.user.id)

    purchase_id = payload.get('purchase_id')
    purchase_all=[] 
    payment = Payment.objects.filter(pk=purchase_id).first()
    purchase_all.append({
        'id': payment.id,
        'geo_unique_number': payment.geo_unique_number,
        'data_id': payment.data_id,
        'description': payment.description,
        'amount': payment.amount,
        'created_at': payment.created_at.strftime('%Y-%m-%d'),
        'error_message': payment.error_message,
        'failed_at': payment.failed_at,
        'bank_unique_number': payment.bank_unique_number,
        'success_at': payment.success_at.strftime('%Y-%m-%d'),
        'user': user.username,
    })
    return JsonResponse({'purchase_all': purchase_all})