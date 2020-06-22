from django.conf import settings


def context_processor(request):

    context = {
            'DEBUG': settings.DEBUG,
        }

    return context
