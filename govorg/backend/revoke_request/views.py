from django.shortcuts import render, get_object_or_404
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required

@require_GET
@ajax_required
def all(request):
    pass


@require_GET
@ajax_required
def delete(request, pk):
    pass
