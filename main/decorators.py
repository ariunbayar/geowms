import json
from functools import wraps

from django.apps import apps
from django.conf import settings
from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.http import JsonResponse


def ajax_required(f):

    @wraps(f)
    def inner(request, *args, **kwargs):

        if request.is_ajax():

            try:
                payload = json.loads(request.body)
            except Exception:
                pass
            else:
                args = [payload, *args]

            try:
                return f(request, *args, **kwargs)
            except Http404:
                return HttpResponseBadRequest('{"success": false}')

        if settings.DEBUG:
            return HttpResponse(
                (
                    'Missing HTTP_X_REQUESTED_WITH header '
                    'or finding \'XMLHttpRequest\' string '
                    'in HTTP_X_REQUESTED_WITH header'
                ),
                status=412
            )
        else:
            raise Http404

    return inner


def gov_required(f):

    def wrap(request, *args, **kwargs):

        if request.user.is_authenticated:
            Org = apps.get_model('backend_org', 'Org')
            org = get_object_or_404(Org, employee__user=request.user)
            request.org = org
            return f(request, *args, **kwargs)

        raise Http404

    wrap.__doc__ = f.__doc__
    wrap.__name__ = f.__name__

    return wrap


def api_inspire_perm(perm_kind):

    def inner(f):

        def wrap(request, *args, **kwargs):
            EmpPermInspire = apps.get_model('backend_inspire', 'EmpPermInspire')
            EmpPerm = apps.get_model('backend_inspire', 'EmpPerm')
            LFeatures = apps.get_model('backend_inspire', 'LFeatures')
            Employee = apps.get_model('backend_org', 'Employee')
            payload = json.loads(request.body)
            feature_id = payload.get('feature_id')
            if not feature_id:
                rsp = {
                    'success': False,
                    'info': "Feature_id алга",
                }
                return JsonResponse(rsp)

            get_object_or_404(LFeatures, feature_id=feature_id)
            employee = get_object_or_404(Employee, user=request.user)
            emp_perm = EmpPerm.objects.filter(employee=employee).first()
            qs = EmpPermInspire.objects
            qs = qs.filter(feature_id=feature_id)
            qs = qs.filter(perm_kind=perm_kind)
            qs = qs.filter(emp_perm=emp_perm)
            qs = qs.first()
            if not qs:
                rsp = {
                    'success': False,
                    'info': "Ажилтанд эрх алга байна",
                }
                return JsonResponse(rsp)

            args = [payload, *args]

            try:
                return f(request, *args, **kwargs)
            except Http404:
                return HttpResponseBadRequest('{"success": false}')

        wrap.__doc__ = f.__doc__
        wrap.__name__ = f.__name__

        return wrap

    return inner
