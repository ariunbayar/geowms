from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from main.decorators import ajax_required
from django.http import JsonResponse, Http404
from geoportal_app.models import User
from django.contrib.auth.decorators import user_passes_test
from .models import Payment


@require_GET
@ajax_required
def all(request):
    payment_all = []
    created_at = Payment.objects.all().order_by('created_at')
    for payment in Payment.objects.all():
          payment_all.append({
            'id': payment.id,
            'amount': payment.amount,
            'description': payment.description,
            'created_at': payment.created_at.strftime('%Y-%m-%d'),
            'is_success': payment.is_success,
            'success_at': payment.success_at.strftime('%Y-%m-%d'),
            'user_id': payment.user_id,
            'bank_unique_number': payment.bank_unique_number,
            'data_id': payment.data_id,
            'error_code': payment.error_code,
            'error_message': payment.error_message,
            'failed_at': payment.failed_at.strftime('%Y-%m-%d'),
            'geo_unique_number': payment.geo_unique_number,
        })
    return JsonResponse({'payment_all': payment_all,
            'payment_all': payment_all,
            'len': Payment.objects.filter().count()

    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
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
@user_passes_test(lambda u: u.is_superuser)
def purchaseDraw(request, payload):
    user = get_object_or_404(User, pk=request.user.id)
    price = payload.get('price')
    description = payload.get('description')
    data_id = payload.get('data_id')
    coodrinatLeftTop = payload.get('coodrinatLeftTop')
    coodrinatRightBottom = payload.get('coodrinatRightBottom')
    count = Payment.objects.all().count()
    payment = Payment.objects.create(geo_unique_number=count, data_id=data_id, amount=price, description=description, user=user, is_success=False, coodrinatLeftTop=coodrinatLeftTop, coodrinatRightBottom=coodrinatRightBottom )

    return JsonResponse({'payment_id': payment.id})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def purchaseAll(request, payload):
    user = get_object_or_404(User, pk=request.user.id)

    purchase_id = payload.get('purchase_id')
    payment = Payment.objects.filter(pk=purchase_id).first()
    if payment.user_id == request.user.id:
        purchase_all=[]
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
    else:
        raise Http404

