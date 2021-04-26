from django.apps import apps
from django.contrib.postgres.search import SearchVector


class InspireSearchValue():

    def __init__(self, zovhon_feature_id=[], busad_feature_id=[], search_value='', limit=5, search_field='value_text'):
        self.zovhon_feature_id = zovhon_feature_id
        self.busad_feature_id = busad_feature_id
        self.search_value = search_value
        self.search_field = search_field
        self.limit = limit
        self.search_qs = None
        self.values = [None]

    def get_model(self, model_name):
        if model_name:
            Model = apps.get_model('backend_inspire', model_name)
        return Model.objects

    @property
    def qs(self):
        if not hasattr(self, '_qs'):
            self._qs = self.model.objects
        return self._qs

    def get_feture_configs(self):
        qs = self.get_model('LFeatureConfigs')
        if self.zovhon_feature_id:
            qs = qs.filter(feature_id__in=self.zovhon_feature_id).values_list('feature_config_id', flat=True)
            return qs
        else:
            qs = qs.exclude(feature_id__in=self.busad_feature_id).values_list('feature_config_id', flat=True)
            return qs

    def get_values(self):
        values = []
        for i in self.search_qs:
            values.append({
                'geo_id': i['geo_id'],
                'value': i[self.search_field]
            })

        self.values = values

    def search(self):
        qs = self.get_model('MDatas')
        feature_config_ids = self.get_feture_configs()
        qs = qs.filter(feature_config_id__in=feature_config_ids).order_by('geo_id')
        search_qs = qs.annotate(search=SearchVector(self.search_field))
        search_qs = search_qs.filter(search__icontains=self.search_value)[:self.limit]
        self.search_qs = search_qs.values()

    def get(self):
        self.search()
        self.get_values()
        return self.values

