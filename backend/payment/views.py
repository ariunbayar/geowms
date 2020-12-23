from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, Http404
from django.core.paginator import Paginator
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required

from main.decorators import ajax_required
from geoportal_app.models import User
from .models import Payment, PaymentPoint
from govorg.backend.forms.models import Mpoint_view

from django.contrib.postgres.search import SearchVector

@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def paymentList(request, payload):

    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('perpage')
    sort_name = payload.get('sort_name')

    payment_all = []
    if not sort_name:
        sort_name = 'id'
    payments = Payment.objects.all().annotate(search=SearchVector(
        'user__first_name',
        'geo_unique_number'
        )
    ).filter(search__icontains=query).order_by(sort_name)
    total_items = Paginator(payments, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list

    for payment in page_items:
        if payment.created_at:
            created_date = payment.created_at.strftime('%Y-%m-%d')
        else:
            created_date = None
        if payment.success_at:
            success_date = payment.success_at.strftime('%Y-%m-%d')
        else:
            success_date = None
        if payment.failed_at:
            failed_date = payment.failed_at.strftime('%Y-%m-%d')
        else:
            failed_date = None
        payment_all.append({
            'id':payment.id,
            'geo_unique_number':payment.geo_unique_number,
            'bank_unique_number':payment.bank_unique_number,
            'description':payment.description,
            'total_amount':payment.total_amount,
            'user':payment.user.username,
            'user_id': payment.user_id,
            'user_firstname': payment.user.first_name,
            'user_lastname': payment.user.last_name,
            'is_success':payment.is_success,
            'card_number':payment.card_number,
            'message':payment.message,
            'code':payment.code,
            'created_at':created_date,
            'success_at':success_date,
            'failed_at':failed_date,
        })
    total_page = total_items.num_pages
    rsp = {
        'items': payment_all,
        'page': page,
        'total_page': total_page,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def purchase(request, payload):
    user = get_object_or_404(User, pk=request.user.id)
    price = payload.get('price')
    description = payload.get('description')
    data_id = payload.get('data_id')
    count = Payment.objects.all().count()
    payment = Payment.objects.create(geo_unique_number=count, data_id=data_id, amount=price, description=description, user=user, is_success=False)

    return JsonResponse({'payment_id': payment.id})


@require_POST
@ajax_required
@login_required
def purchaseAll(request, payload):
    purchase_id = payload.get('purchase_id')
    payment = Payment.objects.filter(pk=purchase_id).first()
    if payment.user_id == request.user.id:
        user = User.objects.filter(id=payment.user_id).first()
        pointList = PaymentPoint.objects.filter(payment_id=purchase_id)
        purchase_all = []
        point_data = []
        purchase_all.append({
            'id': payment.id,
            'geo_unique_number': payment.geo_unique_number,
            'description': payment.description,
            'created_at': payment.created_at.strftime('%Y-%m-%d'),
            'message': payment.message,
            'failed_at': payment.failed_at,
            'bank_unique_number': payment.bank_unique_number,
            'success_at': payment.success_at,
            'export_file': payment.export_file,
            'user_id': user.username,
            'total_amount': payment.total_amount,
            'card_number': payment.card_number,
            'is_success': payment.is_success,
        })
        if len(pointList) > 0:
            for point in pointList:
                point_data.append({
                    'name': point.point_name,
                    'amount': point.amount,
                })
        else:
            rsp = {
                'success': False,
                'msg': "Уучлаарай цэгийн мэдээлэл олдсонгүй"
            }
            return JsonResponse(rsp)
        rsp = {
            'success': True,
            'purchase_all': purchase_all,
            'point_data': point_data
        }
        return JsonResponse(rsp)
    else:
        rsp = {
            'success': False,
            'msg': 'Алдаа гарсан байна'
        }
        return JsonResponse(rsp)