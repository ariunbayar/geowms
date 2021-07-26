from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from django.contrib.postgres.search import SearchVector

from geoportal_app.models import User
from .models import Payment, PaymentPoint

from main.components import Datatable
from main.decorators import ajax_required
from main.utils import get_start_index


def _get_user(user_id, item):
    user = User.objects.filter(id=user_id).first()
    return user.username if user else ''


def _get_user_firstname(user_id, item):
    user = User.objects.filter(id=user_id).first()
    return user.first_name if user else ''


def _get_user_lastname(user_id, item):
    user = User.objects.filter(id=user_id).first()
    return user.last_name if user else ''


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def paymentList(request, payload):
    qs = Payment.objects.all()
    qs = qs.annotate(search=SearchVector(
        'user__first_name',
        'geo_unique_number'
        )
    )

    qs = qs.filter(search__icontains=payload.get('query'))
    if not qs:
        rsp = {
            'items': [],
            'page': payload.get('page'),
            'total_page': 1,
        }
        return JsonResponse(rsp)

    оруулах_талбарууд = ['id', 'user_id', 'geo_unique_number', 'bank_unique_number', 'description', 'total_amount', 'is_success', 'card_number', 'message', 'code', 'created_at']
    хувьсах_талбарууд = [
        {"field": "user_id", "action": _get_user, "new_field": "user"},
        {"field": "user_id", "action": _get_user_firstname, "new_field": "user_firstname"},
        {"field": "user_id", "action": _get_user_lastname, "new_field": "user_lastname"},
    ]

    datatable = Datatable(
        model=Payment,
        payload=payload,
        initial_qs=qs,
        оруулах_талбарууд=оруулах_талбарууд,
        хувьсах_талбарууд=хувьсах_талбарууд,
        has_search=False,
    )

    items, total_page, start_index = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
        'start_index': start_index
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
