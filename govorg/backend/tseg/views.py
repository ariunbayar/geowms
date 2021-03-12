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
    LProperties,
    MGeoDatas,
    MDatas,
    LFeatureConfigs,
    LDataTypeConfigs,
)


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


def _get_model_qs(Model, search):
    qs = Model.objects
    qs = qs.filter(**search)
    return qs


def _search_model_values(search_keys, values, Model):
    search = dict()
    searchs = list()
    for key in search_keys:
        for value in values:
            search[key] = value[key]
            qs = _get_model_qs(Model, search)
            qs_valuies = qs.values()
            for qs_value in qs_valuies:
                searchs.append(qs_value)

    return searchs


def _check_len(array):
    print(len(list(array)))


values = [{
    'package_code' :'gnp-gp'
}]
keys = ['package_code']
package_values = _search_model_values(keys, values, LPackages)
keys = ['package_id']
feature_values = _search_model_values(keys, package_values, LFeatures)
keys = ['feature_id']
feature_config_values = _search_model_values(keys, feature_values, LFeatureConfigs)
keys = ['data_type_id']
data_type_config_values = _search_model_values(keys, feature_config_values, LDataTypeConfigs)
keys = ['property_id']
property_values = _search_model_values(keys, data_type_config_values, LProperties)


for property_value in property_values:
    print(property_value)

_check_len(property_values)


