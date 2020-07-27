from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404

from main.decorators import ajax_required
from django.http import JsonResponse
from geoportal_app.models import User
from geoportal_app.models import Role


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


def _get_role_display(role):
    return {
        'id': role.id,
        'name': role.get_id_display(),
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

    roles = [_get_role_display(role) for role in user.roles.all()]

    rsp = {
        'user_detail': _get_user_detail(user),
        'roles': roles,
        'success': True,
    }

    return JsonResponse(rsp)