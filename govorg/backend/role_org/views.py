from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse


@require_GET
@ajax_required
def views(request):
    return JsonResponse({'success': True})
