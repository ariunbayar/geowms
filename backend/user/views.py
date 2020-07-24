from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404

from main.decorators import ajax_required
from django.http import JsonResponse
from geoportal_app.models import User


def _get_user_display(user):
    return {
        'id': user.id,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'is_superuser': user.is_superuser,
        'email': user.email,
        'is_active': user.is_active,
        'is_sso': user.is_sso,
    }

def _get_user_detail(user):
    return {
        'id': user.id,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'gender': user.gender,
        'is_superuser': user.is_superuser,
        'email': user.email,
        'is_active': user.is_active,
        'is_sso': user.is_sso,
        'username': user.username,
        'is_active': user.is_active,
        'last_login': user.last_login.strftime('%Y-%m-%d'),
        'date_joined': user.date_joined.strftime('%Y-%m-%d'),
    }



@require_GET
@ajax_required
def all(request):

    user_list = [_get_user_display(user) for user in User.objects.all()]

    rsp = {
        'user_list': user_list,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def дэлгэрэнгүй(request, pk):

    user = get_object_or_404(User, pk=pk)

    rsp = {
        'user_detail': _get_user_detail(user),
        'success': True,
    }

    return JsonResponse(rsp)