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
    count = Payment.objects.all().count()
    payment = Payment.objects.create(number=count, amount=price, description=description, user=user, is_success=False )
    
    return JsonResponse({'payment_id': payment.id})


@require_POST
@ajax_required
def purchaseDraw(request, payload):

    user = get_object_or_404(User, pk=request.user.id)
    price = payload.get('price')
    description = payload.get('description')
    coodrinatLeftTop = payload.get('coodrinatLeftTop')
    coodrinatRightBottom = payload.get('coodrinatRightBottom')
    count = Payment.objects.all().count()
    payment = Payment.objects.create(number=count, amount=price, description=description, user=user, is_success=False, coodrinatLeftTop=coodrinatLeftTop, coodrinatRightBottom=coodrinatRightBottom )
    
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