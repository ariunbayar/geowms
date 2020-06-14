from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import render


@user_passes_test(lambda u: u.is_superuser)
def жагсаалт(request):

    rsp = {
        'items': [
            {
                'id': 22,
                'name': 'Google Map Hybrid',
                'order': 7,
                'url': 'https://b.tile.openstreetmap.org/{x}/{y}/{z}.png',
                'thumbnail_1x': '/media/дэд-сан/icon_40eb3gu.png',
                'thumbnail_2x': '/media/дэд-сан/icon_fOSGhXt.png',
            },
            {
                'id': 23,
                'name': 'TopoMap',
                'order': 8,
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{x}/{y}/{z}',
                'thumbnail_1x': '/media/дэд-сан/icon_40eb3gu.png',
                'thumbnail_2x': '/media/дэд-сан/icon_fOSGhXt.png',
            },
            {
                'id': 24,
                'name': 'Bing Map',
                'order': 9,
                'url': 'http://ecn.t3.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1',
                'thumbnail_1x': '/media/дэд-сан/icon_40eb3gu.png',
                'thumbnail_2x': '/media/дэд-сан/icon_fOSGhXt.png',
            },
        ],
    }

    return JsonResponse(rsp)


@user_passes_test(lambda u: u.is_superuser)
def үүсгэх(request):

    # TODO
    rsp = {
            'success': False,
        }

    return JsonResponse(rsp)


@user_passes_test(lambda u: u.is_superuser)
def устгах(request):

    # TODO
    rsp = {
            'success': False,
        }

    return JsonResponse(rsp)
