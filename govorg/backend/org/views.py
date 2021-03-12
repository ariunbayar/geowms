from django.shortcuts import render, get_object_or_404
from django.db.models import F
from django.contrib.auth.decorators import login_required
from backend.org.models import Org, Employee
from main.decorators import ajax_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from backend.inspire.models import GovPerm
from backend.inspire.models import GovPermInspire
from backend.inspire.models import EmpPerm
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import LProperties
from backend.inspire.models import LThemes
from backend.inspire.models import LPackages
from backend.inspire.models import LFeatures
from backend.inspire.models import MGeoDatas

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display2,
    count_property_of_feature,
    get_perm_kind_name,
    get_perm_list
)

from main import utils

def _get_properties_by_feature(initial_qs, feature_ids):

    qs = initial_qs
    qs = qs.filter(feature_id__in=feature_ids)
    qs = qs.filter(property_id__isnull=False)

    qs_for_props = qs.values_list('property_id', flat=True)
    properties = {
        prop.property_id: prop
        for prop in LProperties.objects.filter(property_id__in=qs_for_props)
    }

    item_pairs = qs.values_list('feature_id', 'property_id', 'perm_kind')

    feature_property_ids = {
        feature_id: []
        for feature_id in feature_ids
    }

    for feature_id, property_id, perm_kind in item_pairs:
        feature_property_ids[feature_id].append({
            "perm_kind":perm_kind, "prop_obj": properties[property_id]
        })

    return feature_property_ids


def _org_role(org):

    properties = []
    property_of_feature = {}
    themes = []
    package_features = []
    gov_perm = GovPerm.objects.filter(org=org).first()
    property_ids_of_feature = {}

    if gov_perm:
        feature_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm.id).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))

        package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
        theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))

        qs = GovPermInspire.objects.filter(gov_perm=gov_perm)
        property_of_feature = _get_properties_by_feature(qs, feature_ids)

        qs = GovPermInspire.objects.filter(feature_id__in=feature_ids, gov_perm=gov_perm)
        perm_list_all = list(qs.values('geom', 'property_id', 'feature_id', ins_id=F('id'), kind=F('perm_kind')))

        for feature_id, props in property_of_feature.items():
            # geom
            perm_list = get_perm_list(feature_id, None, True, perm_list_all)
            properties.append(
                get_property_data_display2(perm_list, None, feature_id, True)
            )
            property_perm_count = count_property_of_feature(props)

            for perm in perm_list:
                kind_name = get_perm_kind_name(perm['kind'])
                property_perm_count[kind_name] = property_perm_count[kind_name] + 1

            property_ids_of_feature[feature_id] = property_perm_count
            # property давхардал арилгах
            check_list = []
            # properties
            for prop in props:
                if not prop['prop_obj'] in check_list:
                    perm_list = get_perm_list(feature_id, prop['prop_obj'].property_id, False, perm_list_all)
                    properties.append(
                        get_property_data_display2(perm_list, prop['prop_obj'], feature_id, False)
                    )
                    check_list.append(prop['prop_obj'])


        def _get_package_features_data_display(package_id, feature_ids):

            qs = LFeatures.objects
            qs = qs.filter(package_id=package_id)
            qs = qs.filter(feature_id__in=feature_ids)
            qs = qs.values_list('feature_id', flat=True)

            package_feature_ids = list(qs)
            return  get_package_features_data_display(package_id, package_feature_ids, property_ids_of_feature)


        package_features = []
        for package_id in package_ids:
            package_obj = _get_package_features_data_display(package_id, feature_ids)
            package_features.append(package_obj)

        themes = [
            get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)), package_features)
            for theme_id in theme_ids
        ]

    return {
        'gov_perm_id': gov_perm.id if gov_perm else '',
        'themes': themes,
        'package_features': package_features,
        'property': properties,
    }


def _emp_role(org, user):

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

            for package_id in package_ids:
                package = LPackages.objects.filter(package_id=package_id).first()
                feature_objs = LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids)
                features = []
                for feature_obj in feature_objs:
                    count = MGeoDatas.objects.filter(feature_id=feature_obj.feature_id).count()
                    features.append({
                            'id': feature_obj.feature_id,
                            'name': feature_obj.feature_name,
                            'parent_id': feature_obj.package_id,
                            'count': count,
                        })

                package_features.append({
                    'id': package.package_id,
                    'name': package.package_name,
                    'parent_id': package.theme_id,
                    'features': features,
                })

            for theme_id in theme_ids:
                theme = LThemes.objects.filter(theme_id=theme_id).first()
                themes.append({
                    'id': theme.theme_id,
                    'name': theme.theme_name,
                })
    return {
        'themes': themes,
        'package_features': package_features,
    }


@login_required(login_url='/gov/secure/login/')
def frontend(request):

    employee = get_object_or_404(Employee, user=request.user)
    org = get_object_or_404(Org, employee=employee)
    geom = utils.get_geom(org.geo_id, 'MultiPolygon')
    context = {
        'org': {
            "org_name": org.name.upper(),
            "org_level": org.level,
            'org_role': _org_role(org),
            'employee': {
                'is_admin': employee.is_admin,
                'username': employee.user.username
            },
            'allowed_geom': geom.json if geom else None
        },
    }

    return render(request, 'org/index.html', context)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def emp_role(request):

    org = get_object_or_404(Org, employee__user=request.user)
    rsp = {
        'success': True,
        'emp_role': _emp_role(org, request.user)
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_approve_and_revoke(request):
    employee = get_object_or_404(Employee, user=request.user)
    emp_perm = EmpPerm.objects.filter(employee=employee).first()

    approve = EmpPermInspire.objects.filter(emp_perm=emp_perm, perm_kind=EmpPermInspire.PERM_APPROVE).first()
    revoke = EmpPermInspire.objects.filter(emp_perm=emp_perm, perm_kind=EmpPermInspire.PERM_REVOKE).first()

    rsp = {
        'approve': True if approve else False,
        'revoke': True if revoke else False,
    }
    return JsonResponse(rsp)
