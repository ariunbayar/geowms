from django.apps import apps


class GEoIdGenerator():

    def __init__(self, feature_id, feature_code):
        self.feature_id = feature_id
        self.feature_code = feature_code

    @property
    def model(self):
        if not hasattr(self, '_model'):
            self._model = apps.get_model('backend_inspire', 'MGeoDatas')
        return self._model

    @property
    def qs(self):
        if not hasattr(self, '_qs'):
            self._qs = self.model.objects
        return self._qs

    def code_generator(self):
        feature_code = self.feature_code
        feature_code = feature_code.replace('-', '_')
        feature_code = feature_code.upper()
        feature_code = feature_code + '__'
        self.feature_code = feature_code

    def get_last_geo_id_of_feature(self):
        qs = self.qs
        qs = qs.filter(feature_id=self.feature_id)
        qs = qs.filter(geo_id__contains=self.feature_code)
        qs = qs.order_by('-geo_id')
        qs = qs.first()
        return qs

    def str_to_int(self, geo_id):
        return int(geo_id[-9:])

    def int_to_str(self, number):
        return str(number).zfill(9)

    def get(self):
        self.code_generator()
        last_geo_id = self.get_last_geo_id_of_feature()
        if last_geo_id:
            last_geo_id = self.str_to_int(last_geo_id.geo_id)
            last_geo_id = last_geo_id + 1
            geo_id = self.feature_code + self.int_to_str(last_geo_id)
        else:
            geo_id = self.feature_code + self.int_to_str(1)

        return geo_id
