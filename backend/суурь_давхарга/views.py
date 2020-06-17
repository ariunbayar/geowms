import json

from django.contrib.auth.decorators import user_passes_test
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import JsonResponse
from django.shortcuts import render

from geoportal.utils import resize_b64_to_sizes
from .models import СуурьДавхарга


def _get_base_layer_display(base_layer):
    return {
            'id': base_layer.pk,
            'name': base_layer.name,
            'url': base_layer.url,
            'thumbnail_1x': base_layer.thumbnail_1x.url,
            'thumbnail_2x': base_layer.thumbnail_2x.url,
        }


@user_passes_test(lambda u: u.is_superuser)
def жагсаалт(request):

    display_items = [_get_base_layer_display(o) for o in СуурьДавхарга.objects.all()]

    rsp = {
        'items': display_items,
    }

    return JsonResponse(rsp)


@user_passes_test(lambda u: u.is_superuser)
def үүсгэх(request):

    try:
        payload = json.loads(request.body)

        base_layer = СуурьДавхарга()

        sizes = [
            (128 * 2, 72 * 2),
            (128 * 1, 72 * 1),
        ]

        base_layer.name = payload.get('name')
        base_layer.url = payload.get('url')

        [thumbnail_2x, thumbnail_1x] = resize_b64_to_sizes(payload.get('thumbnail'), sizes)
        base_layer.thumbnail_1x = SimpleUploadedFile('thumbnail.png', thumbnail_1x)
        base_layer.thumbnail_2x = SimpleUploadedFile('thumbnail.png', thumbnail_2x)

        base_layer.save()

    except Exception as e:
        raise e
        rsp = {'success': False}
    else:
        rsp = {'success': True}

    return JsonResponse(rsp)


@user_passes_test(lambda u: u.is_superuser)
def detail(request, pk):

    base_layer = get_object_or_404(СуурьДавхарга, pk=pk)
    display_item = _get_base_layer_display(base_layer)

    return JsonResponse(display_item)


@user_passes_test(lambda u: u.is_superuser)
def устгах(request, pk):

    base_layer = get_object_or_404(СуурьДавхарга, pk=pk)

    try:
        base_layer.thumbnail_1x.delete(save=False)
        base_layer.thumbnail_2x.delete(save=False)
        base_layer.delete()

    except Exception as e:
        raise e
        rsp = {'success': False}
    else:
        rsp = {'success': True}

    return JsonResponse(rsp)