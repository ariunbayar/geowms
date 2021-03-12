from django.http import JsonResponse

from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required

from main.decorators import ajax_required
from main import utils
from backend.inspire.models import (
    LThemes,
    LPackages,
    LFeatures,
    MGeoDatas,
    MDatas,
)

print("hahahaha")
print("hahahaha")
print("hahahaha")

@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tseg_personal(request, payload):

    fields = []

    rsp = {
        'success': True,
        'fields': fields,
    }
    return JsonResponse(rsp)


def _get_package(search):
    package_qs = LPackages.objects
    package_qs = package_qs.filter(**search)

    return package_qs


def _get_feature(search):
    feature_qs = LFeatures.objects
    feature_qs = feature_qs.filter(**search)

    return feature_qs

package_code_search = {'package_code': 'gnp-gp'}
package_qs = _get_package(package_code_search)

package_id_search = {'package_id': package_qs.first().package_id}
feature_qs = _get_feature(package_id_search)

for feat in feature_qs:
    print(feat)
