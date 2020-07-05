from django.views.decorators.http import require_GET

from main.decorators import ajax_required
from django.http import JsonResponse
from geoportal_app.models import User


def _get_bundle_display(user):
    return {
        'is': user.id,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'gender': user.gender,
        'is_superuser': '',
    }


@require_GET
@ajax_required
def all(request):

    user_list = [_get_bundle_display(user) for user in User.objects.all()]

    rsp = {
        'user_list': user_list,
    }

    return JsonResponse(rsp)
