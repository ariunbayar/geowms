import json
from functools import wraps

from django.conf import settings
from django.http import HttpResponse, Http404, HttpResponseBadRequest


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
            except Http404:
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
