from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import user_passes_test

from main.decorators import ajax_required


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
