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
        self.feature_code = feature_code

    def geo_id_check(self, geo_id):
        qs = self.qs
        qs = qs.filter(geo_id=geo_id)
        qs = qs.first()
        return True if qs else False

    def count_feature(self):
        qs = self.qs
        qs = qs.filter(feature_id=self.feature_id)
        qs = qs.count()
        return qs

    def create_geo_id(self, plus=0):
        feature_count = self.count_feature()
        feature_count = feature_count + plus
        geo_id = self.feature_code + '_' + str(feature_count)
        check = self.geo_id_check(geo_id)
        if check:
            self.create_geo_id(plus+1)
        return geo_id

    def get(self):
        self.code_generator()
        geo_id = self.create_geo_id()
        return geo_id
