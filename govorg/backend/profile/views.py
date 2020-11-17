from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required


def _get_meta_data_display(user):
    return {
            'username': user.username,
            'last_name': user.last_name,
            'first_name': user.first_name,
            'email': user.email,
            'gender': user.gender,
            'register': user.register,
        }


@require_GET
@ajax_required
def detail(request):

    rsp = {
        'success': True,
        'user_detail': _get_meta_data_display(request.user),
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def update_password(request, payload):

    old_password = payload.get("old_password")
    new_password = payload.get("new_password")
    user = request.user

    if old_password is None:
        return JsonResponse({'success': False, 'error': 'Хуучин нууц хоосон байна.'})

    if new_password is None:
            return JsonResponse({'success': False, 'error': 'Шинэ нууц хоосон байна.'})

    if not user.check_password(old_password):
        return JsonResponse({'success': False, 'error': 'Хуучин нууц үг буруу байна.'})

    if old_password in new_password:
        return JsonResponse({'success': False, 'error': 'Хуучин нууц үг болон шинэ нууц үг ижил байна.'})

    try:
        user.set_password(new_password)
        user.save()
        return JsonResponse({'success': True, 'msg': 'Нууц үг амжилттай хадгалаа.'})
    except Exception as e:
        raise
        return JsonResponse({'success': False, 'error': 'Нууц үг солиход алдаа гарлаа.'})
