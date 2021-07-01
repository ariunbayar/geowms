from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required

from main.decorators import ajax_required
from geoportal_app.models import User
from .models import Payment, PaymentPoint

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
        'start_index': _get_start_index(per_page, page),
    }
    return JsonResponse(rsp)


def _get_start_index(per_page, page):
    return (per_page * (page - 1)) + 1


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
def purchase_all(request, payload):
    purchase_all = list()
    purchase_id = payload.get('purchase_id')
    payment = get_object_or_404(Payment, pk=purchase_id)

    if payment.user == request.user:
        point_list_qs = PaymentPoint.objects
        point_list_qs = point_list_qs.filter(payment_id=purchase_id)
        point_datas = list(point_list_qs.values('point_name', 'amount'))

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
            'user_id': request.user.username,
            'total_amount': payment.total_amount,
            'card_number': payment.card_number,
            'is_success': payment.is_success,
        })

        if point_datas:
            rsp = {
                'success': True,
                'purchase_all': purchase_all,
                'point_data': point_datas,
            }

        else:
            rsp = {
                'success': False,
                'msg': "Уучлаарай цэгийн мэдээлэл олдсонгүй"
            }

    else:
        rsp = {
            'success': False,
            'msg': 'Мэдээлэл олдсонгүй дахин шалгана уу'
        }

    return JsonResponse(rsp)
