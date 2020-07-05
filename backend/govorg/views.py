from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST

from main.decorators import ajax_required
from .models import GovOrg


def _get_govorg_display(govorg):

    return {
        'name': govorg.name,
        'token': govorg.token,
    }


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def жагсаалт(request):

    govorg_list = GovOrg.objects.all()

    govorg_list_display = [
        _get_govorg_display(govorg)
        for govorg in govorg_list
    ]

    rsp = {
        'govorg_list': govorg_list_display,
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def үүсгэх(request):

    govorg = GovOrg.objects.create(
        name=payload.get('name'),
    )

    govorg.name = payload.get('name')
    govorg.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def дэлгэрэнгүй(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk)

    rsp = {
        'govorg': _get_govorg_display(govorg),
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def хадгалах(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk)
    govorg.name = payload.get('name')
    govorg.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def усгах(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk)
    govorg.delete()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)
