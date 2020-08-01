from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test

from main.decorators import ajax_required
from .models import Org


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request, level, payload=dict()):

    level_display = dict((
        (1, '1-р түвшин'),
        (2, '2-р түвшин'),
        (3, '3-р түвшин'),
        (4, '4-р түвшин'),
    ))[int(level)]

    from random import randint

    orgs_display = []
    for i in range(1, randint(2, 13)):
        orgs_display.append({
            'id': i,
            'name': 'Нийслэлийн хот байгуулалт, хөгжлийн газар %s' % i,
            'level': level,
            'level_display': level_display,
        })

    return JsonResponse({'orgs': orgs_display})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employees(request, level, pk, payload=dict()):

    # org = get_object_or_404(Org, pk=pk)

    employees_display = []

    from random import randint

    for i in range(100, randint(105, 120)):
        employees_display.append({
            'id': i,
            'last_name': 'Telmuun%s' % i,
            'first_name': 'Telmuun%s' % i,
            'email': 'user_%s@example.com' % i,
            'is_active': [True, False][randint(0, 1)],
            'is_sso': [True, False][randint(0, 1)],
            'position': 'Газар зохион байгуулалт, төлөвлөлт, газар өмчлөлийн асуудал хариуцсан ахлах мэргэжилтэн %s' % i,
            'created_at': '2020-01-01',
            'updated_at': '2020-04-17',
        })

    return JsonResponse({'employees': employees_display})
