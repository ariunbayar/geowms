from .inspire_feature import InspireFeature
from .inspire_data_type import InspireDataType
from .inspire_property import InspireProperty
from .inspire_code_list import InspireCodeList


if 1:

    a = InspireCodeList('2ndOrder\n')
    print(a.code_list_id)

    a = InspireProperty('NationalLevel')
    print(a.property_id)

    table_au_au_au = InspireFeature('au-au-au')

    table_au_au_au.filter(
        {
            InspireDataType('AdministrativeUnit'): {
                InspireProperty('NationalLevel'): [
                    InspireCodeList('2ndOrder\n'),
                    # InspireCodeList('3rdOrder\n'),
                    # InspireCodeList('4thOrder\n'),
                ],
            }
        }
    )

    table_au_au_au.select(
        {
            InspireDataType('AdministrativeUnit'): [
                InspireProperty('nationalCode'),
                # InspireProperty('beginLifespanVersion'),
                # InspireProperty('ExternalId'),
                # InspireProperty('NationalLevel'),
                # InspireProperty('nationalCode'),
                # InspireProperty('nationalLevelName'),
                # InspireProperty('Country'),
                # InspireProperty('endLifespanVersion'),
            ],
        },
    )

    results = table_au_au_au.fetch()

    from pprint import pprint
    for result in results:
        pprint(result)

# select * from l_properties where property_id in (2,22,26,27,3,4,24);
