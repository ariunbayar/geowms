from django.conf import settings

from backend.config.models import Config


def context_processor(request):

    context = {
            'DEBUG': settings.DEBUG,
            'STATIC_VERSION': '20210121',
        }

    return context


def context_config(request):

    configs = Config.objects.all()

    context = {
            'CONFIGS': {
                conf.name: conf.value for conf in configs
            }
        }

    return context
