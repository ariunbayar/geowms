from django.apps import apps


class InspireManager():

    INSPIRE_APP_LABEL = 'backend_inspire'

    instance = None

    def __init__(self):
        self.models = dict()

    def get_model(self, model_name):
        if model_name not in self.models:
            Model = apps.get_model(self.INSPIRE_APP_LABEL, model_name)
            self.models[model_name] = Model
        return self.models[model_name]

    @classmethod
    def get_instance(cls):
        if cls.instance is None:
            cls.instance = cls()
        return cls.instance
