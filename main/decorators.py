import json
from functools import wraps

from django.conf import settings
from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404, get_list_or_404

from django.apps import apps


def ajax_required(f):

    def wrap(request, *args, **kwargs):

        if request.is_ajax():

            try:
                payload = json.loads(request.body)
            except:
                pass
            else:
                args = [payload, *args]

            try:
                return f(request, *args, **kwargs)
            except Http404 as e:
                return HttpResponseBadRequest('{"success": false}')

        if settings.DEBUG:
            return HttpResponse('Missing HTTP_X_REQUESTED_WITH header '
            'or finding \'XMLHttpRequest\' string '
            'in HTTP_X_REQUESTED_WITH header', status=412)
        else:
            raise Http404

    wrap.__doc__ = f.__doc__
    wrap.__name__ = f.__name__

    return wrap


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


def gov_bundle_required(module):

    def inner(f):

        def wrap(request, *args, **kwargs):

            if request.user.is_authenticated:

                Org = apps.get_model('backend_org', 'Org')
                org = get_object_or_404(Org, employee__user=request.user)

                Bundle = apps.get_model('backend_bundle', 'Bundle')
                bundle = get_list_or_404(Bundle, module=module)[0]

                request.org = org
                request.bundle = bundle

                return f(request, *args, **kwargs)

            raise Http404

        wrap.__doc__ = f.__doc__
        wrap.__name__ = f.__name__

        return wrap

    return inner


def gov_org_required(module):
    def inner(f):

        def wrap(request, *args, **kwargs):

            if request.user.is_authenticated:

                Org = apps.get_model('backend_org', 'Org')
                org = get_object_or_404(Org, employee__user=request.user)

                Org_Inspire = apps.get_model('backend_org', 'OrgInspireRoles')
                org_inspire = get_list_or_404(Org_Inspire, module=module, perm_create=True, perm_update=True, perm_remove=True)
                request.org = org
                request.org_inspire = org_inspire

                return f(request, *args, **kwargs)

            raise Http404

        wrap.__doc__ = f.__doc__
        wrap.__name__ = f.__name__

        return wrap

    return inner