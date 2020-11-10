from django.apps import AppConfig


class ConfigConfig(AppConfig):
    name = 'backend.config'
    label = 'backend_config'

    def ready(self):
        import backend.config.signals.got_request_exception