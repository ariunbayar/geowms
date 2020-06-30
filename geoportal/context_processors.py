from django.conf import settings


def context_processor(request):

    context = {
            'DEBUG': settings.DEBUG,
            'STATIC_VERSION': '20200630',
        }

    return context
