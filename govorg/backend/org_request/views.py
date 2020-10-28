import json
from geojson import Feature, FeatureCollection

from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required

import random
from backend.org.models import Org, Employee
from govorg.backend.org_request.models import OrgRequest
from geoportal_app.models import User
from backend.inspire.models import LThemes, LPackages, LFeatures


def _get_org_request(ob):
    user = get_object_or_404(User,  employee__id=ob.employee_id)
    org = get_object_or_404(Org, employee__user=user)
    feature_name = LFeatures.objects.filter(feature_id= ob.feature_id).first().feature_name
    package_name = LPackages.objects.filter(package_id= ob.package_id).first().package_name
    theme_name = LThemes.objects.filter(theme_id= ob.theme_id).first().theme_name
    user = user.first_name 
    org = org.name
    choice = ob.state
    for i in ob.STATE_CHOICES:
        if i[0] == choice:
            choice = i[1]

    return {
        'id':ob.id,
        'theme_name':theme_name,
        'package_name':package_name,
        'feature_name':feature_name,
        'state':choice,
        'form_json':ob.form_json,
        'geo_json':ob.geo_json,
        'created_at':ob.created_at.strftime('%Y-%m-%d'),
        'employee':user,
        'org':org,
    }

@require_GET
@ajax_required
def getAll(request):
    org_request = []
    org_request_list = OrgRequest.objects.all() 

    if org_request_list:
        org_request = [_get_org_request(ob) for ob in org_request_list]
    
    rsp = {
        'org_request': org_request,
    }

    return JsonResponse(rsp)

