from django.shortcuts import render, get_object_or_404
from django.db.models import F
from django.contrib.auth.decorators import login_required

from backend.org.models import Org, OrgRole, Employee, InspirePerm
from backend.bundle.models import Bundle
from backend.inspire.models import LThemes, LPackages, LFeatures, MGeoDatas
from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    EmpPerm,
    EmpPermInspire,
    LProperties,
)
from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display2,
)


def _get_properties_by_feature(initial_qs, feature_ids):

    qs = initial_qs
    qs = qs.filter(feature_id__in=feature_ids)
    qs = qs.filter(property_id__isnull=False)

    qs_for_props = qs.values_list('property_id', flat=True)
    properties = {
        prop.property_id: prop
        for prop in LProperties.objects.filter(property_id__in=qs_for_props)
    }

    item_pairs = qs.values_list('feature_id', 'property_id')

    feature_property_ids = {
        feature_id: []
        for feature_id in feature_ids
    }

    for feature_id, property_id in item_pairs:
        feature_property_ids[feature_id].append(
            properties[property_id]
        )

    return feature_property_ids

def _org_role(org):

    properties = []
    property_of_feature = {}
    themes = []
    package_features = []
    gov_perm = GovPerm.objects.filter(org=org).first()
    if gov_perm:
        feature_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm.id).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))

        package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
        theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))

        qs = GovPermInspire.objects.filter(gov_perm=gov_perm, perm_kind=GovPermInspire.PERM_VIEW)
        property_of_feature = _get_properties_by_feature(qs, feature_ids)

        property_ids_of_feature = {}
        for feature_id, props in property_of_feature.items():
            property_ids_of_feature[feature_id] = [prop.property_id for prop in props]

        qs = GovPermInspire.objects.filter(feature_id__in=feature_ids, gov_perm=gov_perm)
        perm_list_all = list(qs.values('geom', 'property_id', 'feature_id', ins_id=F('id'), kind=F('perm_kind')))

        def _get_perm_list(feature_id, property_id, geom):
            perm_list_filtered = []

            for item in perm_list_all:
                if item['feature_id'] == feature_id:
                    if geom == True:
                        if item['geom'] == True:
                            perm_list_filtered.append({
                                'ins_id': item['ins_id'],
                                'kind': item['kind'],
                            })
                    else:
                        if item['property_id'] == property_id:
                            perm_list_filtered.append({
                                'ins_id': item['ins_id'],
                                'kind': item['kind'],
                            })

            return perm_list_filtered

        for feature_id, props in property_of_feature.items():

            # geom
            perm_list = _get_perm_list(feature_id, None, True)
            properties.append(
                get_property_data_display2(perm_list, None, feature_id, True)
            )

            # properties
            for prop in props:
                perm_list = _get_perm_list(feature_id, prop.property_id, False)
                properties.append(
                    get_property_data_display2(perm_list, prop, feature_id, False)
                )

        def _get_package_features_data_display(package_id, feature_ids):

            qs = LFeatures.objects
            qs = qs.filter(package_id=package_id)
            qs = qs.filter(feature_id__in=feature_ids)
            qs = qs.values_list('feature_id', flat=True)

            package_feature_ids = list(qs)

            return get_package_features_data_display(package_id, package_feature_ids, property_ids_of_feature)

        package_features = [
            _get_package_features_data_display(package_id, feature_ids)
            for package_id in package_ids
        ]

        themes = [
            get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)))
            for theme_id in theme_ids
        ]

    return {
        'gov_perm_id': gov_perm.id if gov_perm else '',
        'themes': themes,
        'package_features': package_features,
        'property': properties,
    }


def _emp_role(org, user):
    property_of_feature = {}
    feature_ids = []
    package_features = []
    themes = []

    employee = Employee.objects.filter(org_id=org.id, user__username=user).first()
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
    if emp_perm:
        feature_ids = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, geom=True, perm_kind=EmpPermInspire.PERM_VIEW).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))
        if feature_ids:
            package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
            theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))

            qs = EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id)
            property_of_feature = _get_properties_by_feature(qs, feature_ids)

            property_ids_of_feature = {}
            for feature_id, props in property_of_feature.items():
                property_ids_of_feature[feature_id] = [prop.property_id for prop in props]


            package_features = [
                get_package_features_data_display(
                    package_id,
                    list(
                        LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True)
                    ),
                    property_ids_of_feature
                )
                for package_id in package_ids
            ]

            themes = [
                get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)))
                for theme_id in theme_ids
            ]
    return {
        'themes': themes,
        'package_features': package_features,
    }


# TODO remove during issue#1087
def _get_bundle_permissions():
    return [
        {
            "module_id": 1,
            "module_name": "Түүх, соёлын өв",
            "perm_view": True,
            "perm_create": True,
            "perm_remove": True,
            "perm_revoke": True,
            "perm_review": True,
            "perm_approve": True
        },
        {
            "module_id": 2,
            "module_name": "Геодезийн тулгуур сүлжээ",
            "perm_view": True,
            "perm_create": True,
            "perm_remove": True,
            "perm_revoke": True,
            "perm_review": True,
            "perm_approve": True
        },
        {
            "module_id": 3,
            "module_name": "Тээврийн сүлжээ",
            "perm_view": True,
            "perm_create": True,
            "perm_remove": True,
            "perm_revoke": True,
            "perm_review": True,
            "perm_approve": True
        },
        {
            "module_id": 4,
            "module_name": "Дэд бүтэц",
            "perm_view": True,
            "perm_create": True,
            "perm_remove": True,
            "perm_revoke": True,
            "perm_review": True,
            "perm_approve": True
        },
        {
            "module_id": 5,
            "module_name": "Байр зүйн зураг",
            "perm_view": True,
            "perm_create": True,
            "perm_remove": True,
            "perm_revoke": True,
            "perm_review": True,
            "perm_approve": True
        },
        {
                "module_id": 6,
                "module_name": "Барилга, суурин газар",
                "perm_view": True,
                "perm_create": True,
                "perm_remove": True,
                "perm_revoke": True,
                "perm_review": True,
                "perm_approve": True
        }
    ]


@login_required(login_url='/gov/secure/login/')
def frontend(request):

    org = get_object_or_404(Org, employee__user=request.user)

    context = {
        'org': {
            "org_name": org.name.upper(),
            "org_level": org.level,
            'org_role': _org_role(org),
            'emp_role': _emp_role(org, request.user),
        },
    }

    # TODO remove during issue#1087
    context['org']['perms'] = _get_bundle_permissions()

    return render(request, 'org/index.html', context)
