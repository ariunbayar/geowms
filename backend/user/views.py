from django.views.decorators.http import require_GET
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404

from main.decorators import ajax_required
from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.http import JsonResponse
from geoportal_app.models import User
from geoportal_app.models import Role


def _get_user_display(user):
    roles = [_get_role_display(role) for role in user.roles.all()]
    return {
        'id': user.id,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'is_superuser': user.is_superuser,
        'email': user.email,
        'is_active': user.is_active,
        'is_sso': user.is_sso,
        'roles':roles
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
        'success':True
    }

@require_POST
@ajax_required
def all(request,payload):
    last = payload.get('last')
    first = payload.get('first')
    user_list = [_get_user_display(user) for user in User.objects.all()[first:last]]
    rsp = {
        'user_list': user_list,
        'len':User.objects.all().count(),
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def userCount(request):

    user_count = User.objects.all().count()
    rsp = {
        'user_count': user_count,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def дэлгэрэнгүй(request, pk):

    user = get_object_or_404(User, pk=pk)
    all_role= Role.objects.all()
    all_roles=[ _get_role_display(q)for q in all_role]
    roles = [_get_role_display(role) for role in user.roles.all()]
    rsp = {
        'user_detail': _get_user_detail(user),
        'roles': roles,
        'all_role':all_roles,
    }

    return JsonResponse(rsp)

    
@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def userDetailChange(request, payload):
    
    user_id = payload.get('id')
    is_active = payload.get('is_active')
    user = get_object_or_404(User, pk=user_id)
    User.objects.filter(pk=user_id).update(is_active=is_active)
    return JsonResponse({'success': True})
    

@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def roleCreate(request, payload):
    user = get_object_or_404(User, pk=payload.get('id'))
    user_id=payload.get('id')
    roleId = payload.get('roleId')
    role = user.roles.first()
    if role:
        if(roleId==5):
            User.objects.filter(pk=user_id).update(is_superuser=True)
            user.roles.remove(role.id)
            user.roles.add(roleId)
            return JsonResponse({'success': True})
        else:
            User.objects.filter(pk=user_id).update(is_superuser=False)
            user.roles.remove(role.id)
            user.roles.add(roleId) 
            return JsonResponse({'success': True})

    else:
        user.roles.add(roleId)
        return JsonResponse({'success': True})
        
@require_POST
@ajax_required
def userSearch(request, payload):
    query = payload.get('query')
    first = payload.get('first')
    last = payload.get('last')
    userList = []
    users = []
    users = [_get_user_display(user) for user in User.objects.all().annotate(search=SearchVector('last_name','first_name', 'email', 'gender') ).filter(search__contains=query)]
    userList = [_get_user_display(user) for user in User.objects.all().annotate(search=SearchVector('last_name','first_name', 'email', 'gender') ).filter(search__contains=query)[first:last]]
    
    return JsonResponse({'user_list': userList, "len": len(users)})
