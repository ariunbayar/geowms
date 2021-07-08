import json
import requests
from functools import wraps

from django.apps import apps
from django.conf import settings
from django.shortcuts import redirect
from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
import main.geoserver as geoserver

from main import utils
from django.core.cache import cache


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


def get_conf_geoserver_base_url(url_nemelt):

    def inner(f):

        def wrap(request, *args, **kwargs):
            base_url = cache.get('{}'.format(url_nemelt))
            if not base_url:
                conf_geoserver = utils.geo_cache('', 'geoserver_config', geoserver.get_connection_conf(), 86400)

                if not conf_geoserver['geoserver_host'] and not conf_geoserver['geoserver_port']:
                    raise Http404

                if not conf_geoserver['geoserver_host'] == '192.168.10.15':
                    base_url = '{protocol}://{host}:{port}/geoserver/{url_nemelt}'.format(
                        host=conf_geoserver['geoserver_host'],
                        port=conf_geoserver['geoserver_port'],
                        protocol=conf_geoserver['geoserver_protocol'],
                        url_nemelt=url_nemelt
                    )
                else:
                    base_url = '{protocol}://{host}:{port}/{url_nemelt}'.format(
                        host=conf_geoserver['geoserver_host'],
                        port=conf_geoserver['geoserver_port'],
                        protocol=conf_geoserver['geoserver_protocol'],
                        url_nemelt=url_nemelt
                    )
                cache.set('{}'.format(url_nemelt), base_url, 86400)
            args = [base_url, *args]

            try:
                return f(request, *args, **kwargs)
            except Http404:
                return HttpResponseBadRequest('{"success": false}')

        wrap.__doc__ = f.__doc__
        wrap.__name__ = f.__name__

        return wrap

    return inner


def get_conf_geoserver(f):

    def wrap(request, *args, **kwargs):

        if request.user.is_authenticated:
            conf_geoserver = utils.geo_cache('', 'geoserver_config', geoserver.get_connection_conf(), 86400)
            if not conf_geoserver['geoserver_host'] and not conf_geoserver['geoserver_port']:
                raise Http404
            args = [conf_geoserver, *args]
            return f(request, *args, **kwargs)

        raise Http404

    wrap.__doc__ = f.__doc__
    wrap.__name__ = f.__name__

    return wrap


def llc_required(f):

    def inner(f):

        def wrap(request, *args, **kwargs):
            HEADERS = {
                'accept': 'application/json',
                'Content-type': 'application/json',
            }

            if request.user.is_authenticated:
                user_data = request.user
                if not user_data.is_sso:
                    raise Http404

                register = user_data.register
                token_url = 'https://license.gazar.gov.mn/api/engineer/001/{register}'.format(
                    register=register
                )
                rsp = requests.get(token_url, headers=HEADERS, verify=False)
                content = {}
                content['llc_detail'] = []
                if rsp.status_code == 200:
                    content['llc_detail'] = rsp.json()
                    if content['llc_detail']:
                        content['company_name'] = content['llc_detail'][0]['company_name']
                        content['register_number'] = content['llc_detail'][0]['company_register_number']
                    args = [content, *args]
                return f(request, *args, **kwargs)
            else:
                return redirect(settings.LOGIN_REDIRECT_URL)
        wrap.__doc__ = f.__doc__
        wrap.__name__ = f.__name__

        return wrap

    return inner
