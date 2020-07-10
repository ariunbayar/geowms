from django.shortcuts import render, reverse, get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse, HttpResponse

from .models import Config

# Create your views here.


def _get_config_display(request, config):
    return {
        'id': config.id,
        'name': config.name,
        'value': config.value,
        'updated_at': config.updated_at,
    }

@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request):

    config_list = [_get_config_display(request, ob) for ob in Config.objects.all()]
    return JsonResponse({'config_list': config_list})

@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def update(request, payload):
    
    ids = payload.get('id')
    name = payload.get('name')
    value = payload.get('value')

    config = get_object_or_404(Config, pk=ids)
    Config.objects.filter(id=ids).update(id=ids, name=name, value=value)
    
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
def delete(request, payload):

    ids = payload.get('id')

    config = get_object_or_404(Config, pk=ids)
    config.delete()
    
    return JsonResponse({'success': True})
