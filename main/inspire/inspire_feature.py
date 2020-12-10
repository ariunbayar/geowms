import functools
import operator
import re

from django.db.models import Q

from .inspire_code_list import InspireCodeList
from .inspire_data_type import InspireDataType
from .inspire_manager import InspireManager
from .inspire_property import InspireProperty
from .inspire_value import InspireValue



class StatementSingleSelect():

    def __init__(self, code_lists):
        pass


class StatementMultiSelect(StatementSingleSelect):
    pass


class InspireFeature():

    """ Table == LFeatures """

    THEME_CODE_TO_DATA_MODEL = {
        'au': 'MDatasBoundary',
        'bu': 'MDatasBuilding',
        'cp': 'MDatasCadastral',
        'gn': 'MDatasGeographical',
        'hg': 'MDatasHydrography',
    }

    def __init__(self, feature_code):

        self.manager = InspireManager.get_instance()

        self.feature_config_map = None

        self.select_options = []
        self.filter_options = []

        self.feature_id = self._get_feature_id(feature_code)

        model_name = self._get_data_model_name(feature_code)
        self.model = self.manager.get_model(model_name)

    def _get_feature_id(self, feature_code):
        qs = self.manager.get_model('LFeatures').objects
        qs = qs.filter(feature_code=feature_code)
        qs = qs.values_list('feature_id', flat=True)
        feature_ids = list(qs)
        assert len(feature_ids) == 1, 'Expected 1 LFeatures.feature_id by "feature_code={}"'.format(feature_code)
        return feature_ids[0]

    def _get_data_model_name(self, feature_code):
        theme_code = re.split(r'[^a-zA-Z]+', feature_code, 1)[0]
        assert theme_code in self.THEME_CODE_TO_DATA_MODEL, 'Data model for "{}" is undefined'.format(theme_code)
        return self.THEME_CODE_TO_DATA_MODEL[theme_code]

    def select(self, select_options):

        self.select_options = select_options

        for i_data_type, i_properties in select_options.items():
            if i_data_type == 'geo_id':
                continue
            assert isinstance(i_data_type, InspireDataType)
            for i_property in i_properties:
                assert isinstance(i_property, InspireProperty)

    def filter(self, filter_options):

        self.filter_options = filter_options

        for filter_key, filter_property_options in filter_options.items():

            if filter_key == 'geo_id':
                continue

            assert isinstance(filter_key, InspireDataType)

            for i_property, i_values in filter_property_options.items():

                assert isinstance(i_property, InspireProperty)

                if not isinstance(i_values, list):
                    i_values = [i_values]
                for i_value in i_values:
                    assert isinstance(i_value, InspireValue)
                    if not isinstance(i_value, InspireCodeList):
                        raise Exception('Undefined InspireValue instance {}'.format(repr(i_value)))

    def _get_feature_config_id(self, i_data_type):

        if self.feature_config_map is None:

            qs = self.manager.get_model('LFeatureConfigs').objects
            qs = qs.filter(feature_id=self.feature_id)
            items = qs.values_list('feature_config_id', 'data_type_id')

            self.feature_config_map = {
                data_type_id: feature_config_id
                for feature_config_id, data_type_id in items
            }

        if i_data_type.data_type_id not in self.feature_config_map:
            msg = (
                'LFeatureConfigs.feature_config_id not found by '
                '"feature_id={}, data_type_id={}"'
            ).format(self.feature_id, i_data_type.data_type_id)
            raise Exception(msg)

        return self.feature_config_map[i_data_type.data_type_id]

    def _build_filter_statement_for_code_list(self, i_code_lists):

        for i_code_list in i_code_lists:
            assert isinstance(i_code_list, InspireCodeList)

        if len(i_code_lists) == 1:
            return dict(code_list_id=i_code_lists[0].code_list_id)
        else:
            code_list_ids = [v.code_list_id for v in i_code_lists]
            return dict(code_list_id__in=code_list_ids)

    def _build_filter_statement(self, feature_config_id, i_data_type, i_property, i_values):

        options = dict(
            feature_config_id=feature_config_id,
            data_type_id=i_data_type.data_type_id,
            property_id=i_property.property_id,
        )

        # TODO value_type_name: text
        # TODO value_type_name: multi-text
        # TODO value_type_name: number
        # TODO value_type_name: double
        # TODO value_type_name: date
        # TODO value_type_name: link
        # TODO value_type_name: boolean

        if not isinstance(i_values, list):
            i_values = [i_values]

        if i_property.value_type_id in ['single-select', 'multi-select']:
            statement = self._build_filter_statement_for_code_list(i_values)
            options.update(statement)
        else:
            raise Exception('Undefined InspireValue instance {}'.format(i_property.value_type_id))

        return Q(**options)


    def _build_filter_geo_id_statement(self, values):
        if isinstance(values, list):
            return Q(geo_id__in=values)
        else:
            return Q(geo_id=values)

    def _apply_filter(self, qs, filter_options):

        statements = []

        for key, values in filter_options.items():

            if key == 'geo_id':

                statement = self._build_filter_geo_id_statement(values)
                statements.append(statement)

            else:

                i_data_type = key
                property_options = values
                feature_config_id = self._get_feature_config_id(i_data_type)

                for i_property, i_values in property_options.items():

                    statement = self._build_filter_statement(
                        feature_config_id,
                        i_data_type,
                        i_property,
                        i_values
                    )

                    statements.append(statement)

        final_statement = functools.reduce(operator.and_, statements)

        return qs.filter(final_statement)

    def _apply_select(self, qs, select_options):

        statements = []

        for i_data_type, i_properties in select_options.items():

            if i_data_type == 'geo_id':
                continue

            feature_config_id = self._get_feature_config_id(i_data_type)

            for i_property in i_properties:

                statement = Q(
                    feature_config_id=feature_config_id,
                    data_type_id=i_data_type.data_type_id,
                    property_id=i_property.property_id,
                )

                statements.append(statement)

        final_statement = functools.reduce(operator.or_, statements)

        return qs.filter(final_statement)

    def _iterate_data_results(self, qs):

        last_geo_id = None
        row = dict()

        for cell_value in qs:

            if cell_value.geo_id != last_geo_id:

                if last_geo_id is not None:
                    yield row

                row = dict(geo_id=cell_value.geo_id)
                last_geo_id = cell_value.geo_id

            key = (
                cell_value.feature_config_id,
                cell_value.data_type_id,
                cell_value.property_id,
            )

            row[key] = cell_value

        yield row

    def fetch(self):

        # TODO optimize when it filters only by geo_id
        qs_geo_ids = self._apply_filter(self.model.objects, self.filter_options)
        qs_geo_ids = qs_geo_ids.values_list('geo_id', flat=True)

        qs = self.model.objects.filter(geo_id__in=qs_geo_ids)
        qs = self._apply_select(qs, self.select_options)
        qs = qs.order_by('geo_id')

        data_results = self._iterate_data_results(qs)

        for data_result in data_results:

            row = dict()

            for i_data_type, i_properties in self.select_options.items():

                if i_data_type == 'geo_id':
                    row['geo_id'] = data_result['geo_id']
                    continue

                feature_config_id = self._get_feature_config_id(i_data_type)
                for i_property in i_properties:

                    key = (
                        feature_config_id,
                        i_data_type.data_type_id,
                        i_property.property_id,
                    )

                    row[i_data_type] = row.get(i_data_type, dict())

                    if i_property.value_type_id in ['text', 'multi-text']:
                        value = data_result[key].value_text
                    elif i_property.value_type_id == 'date':
                        value = data_result[key].value_date
                    elif i_property.value_type_id in ['single-select', 'multi-select']:
                        value = data_result[key].code_list_id
                    else:
                        raise Exception('***\n' * 20)
                    row[i_data_type][i_property] = value

            yield row
