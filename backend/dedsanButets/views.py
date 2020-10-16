from django.shortcuts import render
from backend.inspire.models import LThemes, LPackages, LFeatures
from main.decorators import ajax_required
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse, Http404
from django.contrib.auth.decorators import user_passes_test

# Create your views here.
def _get_package(theme_id):
    package_data = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': list(LFeatures.objects.filter(package_id=package.package_id).extra(select={'id': 'feature_id', 'code': 'feature_code', 'name': 'feature_name'}).values('id', 'code', 'name'))
            })
    return package_data


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    for themes in LThemes.objects.all():
        data.append({
                'id': themes.theme_id,
                'code': themes.theme_code,
                'name': themes.theme_name,
                'package': _get_package(themes.theme_id),
            })
    rsp = {
        'success': True,
        'data': data,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsGetFields(request, name, pk):
    if name == 'feature':
        name = LFeatures
    if name == 'package':
        name = LPackages
    if name == 'theme':
        name = LThemes
    datas = []
    values = name.objects.all()[:10]
    for value in values:
        datas.append({
            value
        })
    print(type(datas))
    rsp = {
        'success': True,
        'fields': [f.name for f in name._meta.get_fields()],
        # 'values': datas,
    }
    return JsonResponse(rsp)