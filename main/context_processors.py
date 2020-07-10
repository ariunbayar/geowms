from django.conf import settings
from backend.config.models import Config

def context_processor(request):

    context = {
            'DEBUG': settings.DEBUG,
            'STATIC_VERSION': '20200706',
        }

    return context


def context_config(request):

    configs = Config.objects.all()
    context = {}
    for config in configs:
        context[config.name] = config.value

    return context