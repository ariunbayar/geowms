import re

from django.apps import apps
from django.db.models import Q


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


class InspireBaseCodeEntity():



    def __init__(self, code):
        self.code = str(code)

    def __hash__(self):
        return hash(self.code)

    def __eq__(self, other):
        assert isinstance(other, self.__class__)
        return self.code == other.code

    def __str__(self):
        return '<{} ({})>'.format(self.__class__.__name__, self.code)

    def __repr__(self):
        return str(self)


class InspireDataType(InspireBaseCodeEntity):
    pass


class InspireProperty(InspireBaseCodeEntity):

    items_mapped = {}
    items_pending = set()

    def __init__(self, code):
        super().__init__(code)
        if code not in self.items_mapped:
            self.items_pending.add(code)

    @property
    def property_id(self):
        if self.code in self.items_pending:
            self.map_pending_items()
        return self.items_mapped[self.code]


class InspireValue():
    pass


class InspireCodeList(InspireValue, InspireBaseCodeEntity):

    items_mapped = {}
    items_pending = set()

    def __init__(self, code):
        super().__init__(code)
        if code not in self.items_mapped:
            self.items_pending.add(code)

    @classmethod
    def map_pending_items(cls):

        manager = InspireManager.get_instance()
        qs = manager.get_model('LCodeLists').objects
        qs = qs.filter(code_list_code__in=cls.items_pending)
        qs = qs.values_list('code_list_code', 'code_list_id')
        code_list_pairs = list(qs)

        if len(cls.items_pending) != len(code_list_pairs):
            msg = 'Expected {} LCodeLists for {}. Found {}'.format(
                len(cls.items_pending),
                str(cls.items_pending),
                len(code_list_pairs),
            )
            raise Exception(msg)

        cls.items_mapped.update({
            code_list_code: code_list_id
            for code_list_code, code_list_id in code_list_pairs
        })

    @property
    def code_list_id(self):
        if self.code in self.items_pending:
            self.map_pending_items()
        return self.items_mapped[self.code]


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

        self.value_type_map = None
        self.data_type_map = None
        self.property_map = None
        self.code_list_map = None

        self.lookup_data_type_codes = set()
        self.lookup_property_codes = set()
        self.lookup_code_list_codes = set()

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

    def _get_data_type_map(self):

        if self.data_type_map is None:

            qs = self.manager.get_model('LDataTypes').objects
            qs = qs.filter(data_type_code__in=self.lookup_data_type_codes)
            qs = qs.values_list('data_type_code', 'data_type_id')
            data_type_pairs = list(qs)

            if len(self.lookup_data_type_codes) != len(data_type_pairs):
                msg = 'Expected {} LDataTypes for {}. Found {}'.format(
                    len(self.lookup_data_type_codes),
                    str(self.lookup_data_type_codes),
                    len(data_type_pairs),
                )
                raise Exception(msg)

            self.data_type_map = {
                data_type_code: data_type_id
                for data_type_code, data_type_id in data_type_pairs
            }

        return self.data_type_map

    def _get_value_type_map(self):

        if self.value_type_map is None:
            qs = self.manager.get_model('LValueTypes').objects
            qs = qs.all().values_list('value_type_id', 'value_type_name')
            value_type_pairs = list(qs)

            self.value_type_map = {
                value_type_id: value_type_name
                for value_type_id, value_type_name in value_type_pairs
            }

        return self.value_type_map

    def _get_property_map(self):

        if self.property_map is None:

            qs = self.manager.get_model('LProperties').objects
            qs = qs.filter(property_code__in=self.lookup_property_codes)
            qs = qs.values_list('property_code', 'property_id')
            property_pairs = list(qs)

            if len(self.lookup_property_codes) != len(property_pairs):
                msg = 'Expected {} LProperties for {}. Found {}'.format(
                    len(self.lookup_property_codes),
                    str(self.lookup_property_codes),
                    len(property_pairs),
                )
                raise Exception(msg)

            self.property_map = {
                property_code: property_id
                for property_code, property_id in property_pairs
            }

        return self.property_map

    def _get_code_list_map(self):

        if self.code_list_map is None:

            qs = self.manager.get_model('LCodeLists').objects
            qs = qs.filter(code_list_code__in=self.lookup_code_list_codes)
            qs = qs.values_list('code_list_code', 'code_list_id')
            code_list_pairs = list(qs)

            if len(self.lookup_code_list_codes) != len(code_list_pairs):
                msg = 'Expected {} LProperties for {}. Found {}'.format(
                    len(self.lookup_code_list_codes),
                    str(self.lookup_code_list_codes),
                    len(property_pairs),
                )
                raise Exception(msg)

            self.code_list_map = {
                code_list_code: code_list_id
                for code_list_code, code_list_id in code_list_pairs
            }

        return self.code_list_map

    def select(self, select_options):

        self.select_options = select_options

        for inspire_data_type, inspire_properties in select_options.items():

            assert isinstance(inspire_data_type, InspireDataType)
            self.lookup_data_type_codes.add(inspire_data_type.code)

            for inspire_property in inspire_properties:

                assert isinstance(inspire_property, InspireProperty)
                self.lookup_property_codes.add(inspire_property.code)

    def filter(self, filter_options):

        self.filter_options = filter_options

        for inspire_data_type, filter_property_options in filter_options.items():

            assert isinstance(inspire_data_type, InspireDataType)
            self.lookup_data_type_codes.add(inspire_data_type.code)

            for inspire_property, inspire_values in filter_property_options.items():

                assert isinstance(inspire_property, InspireProperty)
                self.lookup_property_codes.add(inspire_property.code)

                if not isinstance(inspire_values, list):
                    inspire_values = [inspire_values]
                for inspire_value in inspire_values:
                    assert isinstance(inspire_value, InspireValue)
                    if isinstance(inspire_value, InspireCodeList):
                        self.lookup_code_list_codes.add(inspire_value.code)
                    else:
                        raise Exception('Undefined InspireValue instance {}'.format(repr(inspire_value)))

    def _get_feature_config_id(self, data_type_id):

        qs = self.manager.get_model('LFeatureConfigs').objects
        qs = qs.filter(
            feature_id=self.feature_id,
            data_type_id=data_type_id,
        )
        qs = qs.values_list('feature_config_id', flat=True)
        feature_config_ids = list(qs)

        if len(feature_config_ids) != 1:
            msg = (
                'Expected 1 LFeatureConfigs.feature_config_id by '
                '"feature_id={}, data_type_id={}"'
            ).format(feature_id, data_type_id)
            raise Exception(msg)

        return feature_config_ids[0]

    def _build_filter_statement_for_code_list(self, i_code_lists):

        for i_code_list in i_code_lists:
            assert isinstance(i_code_list, InspireCodeList)

        code_list_map = self._get_code_list_map()

        code_list_ids = [
            code_list_map[i_code_list.code]
            for i_code_list in i_code_lists
        ]

        if len(i_code_lists) == 1:
            return dict(code_list_id=code_list_ids)
        else:
            return dict(code_list_id__in=code_list_ids)

    def _build_filter_statement(self, feature_config_id, data_type_id, property_id, value_type_name, i_values):

        options = dict(
            feature_config_id=feature_config_id,
            data_type_id=data_type_id,
            property_id=property_id,
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

        if value_type_name in ['single-select', 'multi-select']:
            statement = self._build_filter_statement_for_code_list(i_values)
            options.update(statement)
        else:
            raise Exception('Undefined InspireValue instance {}'.format(repr(inspire_value)))

        return Q(**options)

    def _apply_filter(self, filter_options):

        data_type_map = self._get_data_type_map()
        property_map = self._get_property_map()
        value_type_map = self._get_value_type_map()
        filter_statements = []

        for i_data_type, property_options in filter_options.items():

            data_type_id = data_type_map[i_data_type.code]
            feature_config_id = self._get_feature_config_id(data_type_id)

            print('i_data_type_code:'.rjust(20), i_data_type)
            print('data_type_id:'.rjust(20), data_type_id)
            print('self.feature_id:'.rjust(20), self.feature_id)

            print('feature_config_ids:'.rjust(20), feature_config_id)

            for i_property, i_values in property_options.items():

                property_id = property_map[i_property.code]
                value_type_name = value_type_map[property_id]

                print('property_id:'.rjust(20), property_id)
                print('i_values:'.rjust(20), i_values)

                filter_statement = self._build_filter_statement(
                    feature_config_id,
                    data_type_id,
                    property_id,
                    value_type_name,
                    i_values
                )

                filter_statements.append(filter_statement)

        print('\n\033[92m\033[01m', end=''); import pprint; pprint.pprint(filter_statements); print('\n\033[0m', end='')
        import sys; sys.exit(1)

        qs = self.model.objects
        qs = qs.filter(
            feature_config_id__in=feature_config_ids,
            data_type_id__in=data_type_ids,
            property_id__in=property_id_national_level,
            code_list_id=code_lists_national_level['2ndOrder\n'],
        )
        qs = qs.values_list('geo_id', flat=True)
        geo_ids = list(qs)

    def _apply_select(self, select_options):
        pass

    def fetch(self):

        self._apply_filter(self.filter_options)
        self._apply_select(self.select_options)


isinstance(InspireCodeList('asdf'), InspireValue)


table_au_au_au = InspireFeature('au-au-au')

table_au_au_au.select(
    {
        InspireDataType('AdministrativeUnit'): [
            InspireProperty('nationalCode'),
        ],
    },
)

table_au_au_au.filter(
    {
        InspireDataType('AdministrativeUnit'): {
            InspireProperty('NationalLevel'): [
                InspireCodeList('2ndOrder\n'),
                InspireCodeList('3rdOrder\n'),
                InspireCodeList('4thOrder\n'),
            ],
        }
    }
)

results = table_au_au_au.fetch()
