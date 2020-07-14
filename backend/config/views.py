from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET

from main.decorators import ajax_required
from .models import Config


def _get_config_display(config):
    return {
        'id': config.id,
        'name': config.name,
        'value': config.value,
        'updated_at': config.updated_at.strftime('%Y-%m-%d'),
    }


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request):

    config_list = [_get_config_display(ob) for ob in Config.objects.all()]

    return JsonResponse({'config_list': config_list})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def detail(request, pk):

    config = get_object_or_404(Config, pk=pk)
    rsp = {
        'config': _get_config_display(config),
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def update(request, payload, pk):

    config = get_object_or_404(Config, pk=pk)
    config.name = payload.get('name')
    config.value = payload.get('value')
    config.save()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create(request, payload):

    name = payload.get('name')
    value = payload.get('value')
    Config.objects.create(name=name, value=value)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def delete(request, pk):
    config = get_object_or_404(Config, pk=pk)
    config.delete()
    return JsonResponse({'success': True})
