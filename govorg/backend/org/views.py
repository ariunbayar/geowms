from django.shortcuts import render, get_object_or_404
from backend.org.models import Org, OrgRole, Employee, InspirePerm
from backend.bundle.models import Bundle
from backend.inspire.models import LThemes, LPackages, LFeatures, MGeoDatas
from django.contrib.auth.decorators import login_required

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display
)

from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    EmpPerm,
    EmpPermInspire,
)

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

        for feature_id in feature_ids:
            property_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True))
            property_of_feature[feature_id] = property_ids
            properties.append(get_property_data_display(None, feature_id, gov_perm, GovPermInspire, True))
            for property_id in property_ids:
                properties.append(get_property_data_display(property_id, feature_id, gov_perm, GovPermInspire, False))

        def _get_package_features_data_display(package_id, feature_ids):

            qs = LFeatures.objects
            qs = qs.filter(package_id=package_id)
            qs = qs.filter(feature_id__in=feature_ids)
            qs = qs.values_list('feature_id', flat=True)

            package_feature_ids = list(qs)

            return get_package_features_data_display(package_id, package_feature_ids, property_of_feature)

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
    properties = []
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
            for feature_id in feature_ids:
                property_ids = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True))
                property_of_feature[feature_id] = property_ids
                for property_id in property_ids:
                    properties.append(get_property_data_display(property_id, feature_id, emp_perm, EmpPermInspire, False))

            package_features = [
                get_package_features_data_display(package_id, list(LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True)), property_of_feature)
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


@login_required(login_url='/gov/secure/login/')
def frontend(request):
    org = get_object_or_404(Org, employee__user=request.user)
    perms = []

    # TODO remove
    # context = {'org': {'org_name': 'ГАЗАР ЗОХИОН БАЙГУУЛАЛТЫН ХЭЛТЭС', 'org_level': 3, 'perms': [{'module_id': 1, 'module_name': 'Түүх, соёлын өв', 'perm_view': False, 'perm_create': False, 'perm_remove': False, 'perm_revoke': False, 'perm_review': False, 'perm_approve': False}, {'module_id': 2, 'module_name': 'Геодезийн тулгуур сүлжээ', 'perm_view': True, 'perm_create': True, 'perm_remove': True, 'perm_revoke': True, 'perm_review': True, 'perm_approve': True}, {'module_id': 3, 'module_name': 'Тээврийн сүлжээ', 'perm_view': True, 'perm_create': False, 'perm_remove': False, 'perm_revoke': False, 'perm_review': False, 'perm_approve': False}, {'module_id': 4, 'module_name': 'Дэд бүтэц', 'perm_view': True, 'perm_create': False, 'perm_remove': False, 'perm_revoke': False, 'perm_review': False, 'perm_approve': False}, {'module_id': 5, 'module_name': 'Байр зүйн зураг', 'perm_view': True, 'perm_create': False, 'perm_remove': False, 'perm_revoke': False, 'perm_review': False, 'perm_approve': False}, {'module_id': 6, 'module_name': 'Барилга, суурин газар', 'perm_view': True, 'perm_create': False, 'perm_remove': False, 'perm_revoke': False, 'perm_review': False, 'perm_approve': False}], 'org_role': {'gov_perm_id': 1, 'themes': [{'id': 1, 'name': 'Хил, зааг', 'perm_child_ids': [6], 'all_child': 1}], 'package_features': [{'id': 6, 'name': 'Засаг захиргааны нэгж', 'parent_id': 1, 'all_child': 5, 'features': [{'id': 1, 'name': 'Засаг захиргааны түвшний шатлал', 'parent_id': 6, 'perm_child_ids': [2, 3, 4, 22, 24, 26, 27], 'all_child': 7, 'count': 0}, {'id': 3, 'name': 'Засаг захиргааны нэгжийн дундын өмчлөл', 'parent_id': 6, 'perm_child_ids': [2, 3, 4], 'all_child': 3, 'count': 0}, {'id': 4, 'name': 'Засаг захиргааны нэгж', 'parent_id': 6, 'perm_child_ids': [2, 3, 4, 22, 24, 26, 27], 'all_child': 7, 'count': 2134}, {'id': 5, 'name': 'Засаг захиргааны нэгжийн хил', 'parent_id': 6, 'perm_child_ids': [2, 3, 4, 22, 23, 24, 25, 30], 'all_child': 8, 'count': 2134}]}], 'property': [{'id': 'geom', 'name': 'geom', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 976, 'PERM_CREATE': True, 'create_id': 1024, 'PERM_REMOVE': True, 'remove_id': 1072, 'PERM_UPDATE': True, 'update_id': 1120, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 2, 'name': 'beginLifespanVersion', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 969, 'PERM_CREATE': True, 'create_id': 1017, 'PERM_REMOVE': True, 'remove_id': 1065, 'PERM_UPDATE': True, 'update_id': 1113, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 3, 'name': 'endLifespanVersion', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 975, 'PERM_CREATE': True, 'create_id': 1023, 'PERM_REMOVE': True, 'remove_id': 1071, 'PERM_UPDATE': True, 'update_id': 1119, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 4, 'name': 'ExternalId*', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 970, 'PERM_CREATE': True, 'create_id': 1018, 'PERM_REMOVE': True, 'remove_id': 1066, 'PERM_UPDATE': True, 'update_id': 1114, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 22, 'name': 'Country', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 974, 'PERM_CREATE': True, 'create_id': 1022, 'PERM_REMOVE': True, 'remove_id': 1070, 'PERM_UPDATE': True, 'update_id': 1118, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 24, 'name': 'NationalLevel', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 971, 'PERM_CREATE': True, 'create_id': 1019, 'PERM_REMOVE': True, 'remove_id': 1067, 'PERM_UPDATE': True, 'update_id': 1115, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 26, 'name': 'nationalCode', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 972, 'PERM_CREATE': True, 'create_id': 1020, 'PERM_REMOVE': True, 'remove_id': 1068, 'PERM_UPDATE': True, 'update_id': 1116, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 27, 'name': 'nationalLevelName', 'parent_id': 1, 'roles': {'PERM_VIEW': True, 'view_id': 973, 'PERM_CREATE': True, 'create_id': 1021, 'PERM_REMOVE': True, 'remove_id': 1069, 'PERM_UPDATE': True, 'update_id': 1117, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 'geom', 'name': 'geom', 'parent_id': 3, 'roles': {'PERM_VIEW': True, 'view_id': 980, 'PERM_CREATE': True, 'create_id': 1028, 'PERM_REMOVE': True, 'remove_id': 1076, 'PERM_UPDATE': True, 'update_id': 1124, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 2, 'name': 'beginLifespanVersion', 'parent_id': 3, 'roles': {'PERM_VIEW': True, 'view_id': 977, 'PERM_CREATE': True, 'create_id': 1025, 'PERM_REMOVE': True, 'remove_id': 1073, 'PERM_UPDATE': True, 'update_id': 1121, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 3, 'name': 'endLifespanVersion', 'parent_id': 3, 'roles': {'PERM_VIEW': True, 'view_id': 979, 'PERM_CREATE': True, 'create_id': 1027, 'PERM_REMOVE': True, 'remove_id': 1075, 'PERM_UPDATE': True, 'update_id': 1123, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 4, 'name': 'ExternalId*', 'parent_id': 3, 'roles': {'PERM_VIEW': True, 'view_id': 978, 'PERM_CREATE': True, 'create_id': 1026, 'PERM_REMOVE': True, 'remove_id': 1074, 'PERM_UPDATE': True, 'update_id': 1122, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 'geom', 'name': 'geom', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 988, 'PERM_CREATE': True, 'create_id': 1036, 'PERM_REMOVE': True, 'remove_id': 1084, 'PERM_UPDATE': True, 'update_id': 1132, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 2, 'name': 'beginLifespanVersion', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 981, 'PERM_CREATE': True, 'create_id': 1029, 'PERM_REMOVE': True, 'remove_id': 1077, 'PERM_UPDATE': True, 'update_id': 1125, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 3, 'name': 'endLifespanVersion', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 987, 'PERM_CREATE': True, 'create_id': 1035, 'PERM_REMOVE': True, 'remove_id': 1083, 'PERM_UPDATE': True, 'update_id': 1131, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 4, 'name': 'ExternalId*', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 982, 'PERM_CREATE': True, 'create_id': 1030, 'PERM_REMOVE': True, 'remove_id': 1078, 'PERM_UPDATE': True, 'update_id': 1126, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 22, 'name': 'Country', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 986, 'PERM_CREATE': True, 'create_id': 1034, 'PERM_REMOVE': True, 'remove_id': 1082, 'PERM_UPDATE': True, 'update_id': 1130, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 24, 'name': 'NationalLevel', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 983, 'PERM_CREATE': True, 'create_id': 1031, 'PERM_REMOVE': True, 'remove_id': 1079, 'PERM_UPDATE': True, 'update_id': 1127, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 26, 'name': 'nationalCode', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 984, 'PERM_CREATE': True, 'create_id': 1032, 'PERM_REMOVE': True, 'remove_id': 1080, 'PERM_UPDATE': True, 'update_id': 1128, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 27, 'name': 'nationalLevelName', 'parent_id': 4, 'roles': {'PERM_VIEW': True, 'view_id': 985, 'PERM_CREATE': True, 'create_id': 1033, 'PERM_REMOVE': True, 'remove_id': 1081, 'PERM_UPDATE': True, 'update_id': 1129, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 'geom', 'name': 'geom', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 997, 'PERM_CREATE': True, 'create_id': 1045, 'PERM_REMOVE': True, 'remove_id': 1093, 'PERM_UPDATE': True, 'update_id': 1141, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 2, 'name': 'beginLifespanVersion', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 989, 'PERM_CREATE': True, 'create_id': 1037, 'PERM_REMOVE': True, 'remove_id': 1085, 'PERM_UPDATE': True, 'update_id': 1133, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 3, 'name': 'endLifespanVersion', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 996, 'PERM_CREATE': True, 'create_id': 1044, 'PERM_REMOVE': True, 'remove_id': 1092, 'PERM_UPDATE': True, 'update_id': 1140, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 4, 'name': 'ExternalId*', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 990, 'PERM_CREATE': True, 'create_id': 1038, 'PERM_REMOVE': True, 'remove_id': 1086, 'PERM_UPDATE': True, 'update_id': 1134, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 22, 'name': 'Country', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 995, 'PERM_CREATE': True, 'create_id': 1043, 'PERM_REMOVE': True, 'remove_id': 1091, 'PERM_UPDATE': True, 'update_id': 1139, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 23, 'name': 'LegalStatus', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 991, 'PERM_CREATE': True, 'create_id': 1039, 'PERM_REMOVE': True, 'remove_id': 1087, 'PERM_UPDATE': True, 'update_id': 1135, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 24, 'name': 'NationalLevel', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 992, 'PERM_CREATE': True, 'create_id': 1040, 'PERM_REMOVE': True, 'remove_id': 1088, 'PERM_UPDATE': True, 'update_id': 1136, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 25, 'name': 'TechnicalStatus', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 993, 'PERM_CREATE': True, 'create_id': 1041, 'PERM_REMOVE': True, 'remove_id': 1089, 'PERM_UPDATE': True, 'update_id': 1137, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 30, 'name': 'Нэр', 'parent_id': 5, 'roles': {'PERM_VIEW': True, 'view_id': 994, 'PERM_CREATE': True, 'create_id': 1042, 'PERM_REMOVE': True, 'remove_id': 1090, 'PERM_UPDATE': True, 'update_id': 1138, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 'geom', 'name': 'geom', 'parent_id': 6, 'roles': {'PERM_VIEW': True, 'view_id': 1003, 'PERM_CREATE': True, 'create_id': 1051, 'PERM_REMOVE': True, 'remove_id': 1099, 'PERM_UPDATE': True, 'update_id': 1147, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 2, 'name': 'beginLifespanVersion', 'parent_id': 6, 'roles': {'PERM_VIEW': True, 'view_id': 998, 'PERM_CREATE': True, 'create_id': 1046, 'PERM_REMOVE': True, 'remove_id': 1094, 'PERM_UPDATE': True, 'update_id': 1142, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 3, 'name': 'endLifespanVersion', 'parent_id': 6, 'roles': {'PERM_VIEW': True, 'view_id': 1002, 'PERM_CREATE': True, 'create_id': 1050, 'PERM_REMOVE': True, 'remove_id': 1098, 'PERM_UPDATE': True, 'update_id': 1146, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 4, 'name': 'ExternalId*', 'parent_id': 6, 'roles': {'PERM_VIEW': True, 'view_id': 999, 'PERM_CREATE': True, 'create_id': 1047, 'PERM_REMOVE': True, 'remove_id': 1095, 'PERM_UPDATE': True, 'update_id': 1143, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 22, 'name': 'Country', 'parent_id': 6, 'roles': {'PERM_VIEW': True, 'view_id': 1001, 'PERM_CREATE': True, 'create_id': 1049, 'PERM_REMOVE': True, 'remove_id': 1097, 'PERM_UPDATE': True, 'update_id': 1145, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 29, 'name': 'zoneType', 'parent_id': 6, 'roles': {'PERM_VIEW': True, 'view_id': 1000, 'PERM_CREATE': True, 'create_id': 1048, 'PERM_REMOVE': True, 'remove_id': 1096, 'PERM_UPDATE': True, 'update_id': 1144, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 'geom', 'name': 'geom', 'parent_id': 7, 'roles': {'PERM_VIEW': True, 'view_id': 1010, 'PERM_CREATE': True, 'create_id': 1058, 'PERM_REMOVE': True, 'remove_id': 1106, 'PERM_UPDATE': True, 'update_id': 1154, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 2, 'name': 'beginLifespanVersion', 'parent_id': 7, 'roles': {'PERM_VIEW': True, 'view_id': 1004, 'PERM_CREATE': True, 'create_id': 1052, 'PERM_REMOVE': True, 'remove_id': 1100, 'PERM_UPDATE': True, 'update_id': 1148, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 3, 'name': 'endLifespanVersion', 'parent_id': 7, 'roles': {'PERM_VIEW': True, 'view_id': 1009, 'PERM_CREATE': True, 'create_id': 1057, 'PERM_REMOVE': True, 'remove_id': 1105, 'PERM_UPDATE': True, 'update_id': 1153, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 4, 'name': 'ExternalId*', 'parent_id': 7, 'roles': {'PERM_VIEW': True, 'view_id': 1005, 'PERM_CREATE': True, 'create_id': 1053, 'PERM_REMOVE': True, 'remove_id': 1101, 'PERM_UPDATE': True, 'update_id': 1149, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 22, 'name': 'Country', 'parent_id': 7, 'roles': {'PERM_VIEW': True, 'view_id': 1008, 'PERM_CREATE': True, 'create_id': 1056, 'PERM_REMOVE': True, 'remove_id': 1104, 'PERM_UPDATE': True, 'update_id': 1152, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 23, 'name': 'LegalStatus', 'parent_id': 7, 'roles': {'PERM_VIEW': True, 'view_id': 1006, 'PERM_CREATE': True, 'create_id': 1054, 'PERM_REMOVE': True, 'remove_id': 1102, 'PERM_UPDATE': True, 'update_id': 1150, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 25, 'name': 'TechnicalStatus', 'parent_id': 7, 'roles': {'PERM_VIEW': True, 'view_id': 1007, 'PERM_CREATE': True, 'create_id': 1055, 'PERM_REMOVE': True, 'remove_id': 1103, 'PERM_UPDATE': True, 'update_id': 1151, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 'geom', 'name': 'geom', 'parent_id': 8, 'roles': {'PERM_VIEW': True, 'view_id': 1012, 'PERM_CREATE': True, 'create_id': 1060, 'PERM_REMOVE': True, 'remove_id': 1108, 'PERM_UPDATE': True, 'update_id': 1156, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 28, 'name': 'segmentType', 'parent_id': 8, 'roles': {'PERM_VIEW': True, 'view_id': 1011, 'PERM_CREATE': True, 'create_id': 1059, 'PERM_REMOVE': True, 'remove_id': 1107, 'PERM_UPDATE': True, 'update_id': 1155, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 'geom', 'name': 'geom', 'parent_id': 9, 'roles': {'PERM_VIEW': True, 'view_id': 1016, 'PERM_CREATE': True, 'create_id': 1064, 'PERM_REMOVE': True, 'remove_id': 1112, 'PERM_UPDATE': True, 'update_id': 1160, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 2, 'name': 'beginLifespanVersion', 'parent_id': 9, 'roles': {'PERM_VIEW': True, 'view_id': 1013, 'PERM_CREATE': True, 'create_id': 1061, 'PERM_REMOVE': True, 'remove_id': 1109, 'PERM_UPDATE': True, 'update_id': 1157, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 3, 'name': 'endLifespanVersion', 'parent_id': 9, 'roles': {'PERM_VIEW': True, 'view_id': 1015, 'PERM_CREATE': True, 'create_id': 1063, 'PERM_REMOVE': True, 'remove_id': 1111, 'PERM_UPDATE': True, 'update_id': 1159, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}, {'id': 4, 'name': 'ExternalId*', 'parent_id': 9, 'roles': {'PERM_VIEW': True, 'view_id': 1014, 'PERM_CREATE': True, 'create_id': 1062, 'PERM_REMOVE': True, 'remove_id': 1110, 'PERM_UPDATE': True, 'update_id': 1158, 'PERM_APPROVE': False, 'approve_id': None, 'PERM_REVOKE': False, 'revoke_id': None}}]}, 'emp_role': {'themes': [{'id': 1, 'name': 'Хил, зааг', 'perm_child_ids': [6], 'all_child': 1}], 'package_features': [{'id': 6, 'name': 'Засаг захиргааны нэгж', 'parent_id': 1, 'all_child': 5, 'features': [{'id': 4, 'name': 'Засаг захиргааны нэгж', 'parent_id': 6, 'perm_child_ids': [2, 3, 4, 22, 24, 26, 27], 'all_child': 7, 'count': 2134}]}]}}}
    # return render(request, 'org/index.html', context)
    # TODO remove

    for module in Bundle.MODULE_CHOICES:
        roles = OrgRole.objects.filter(org=org, bundle__module=module[0]).distinct('bundle')

        for role in roles:
            perms.append({
                'module_id':module[0],
                'module_name':module[1],
                'perm_view':role.perm_view,
                'perm_create':role.perm_create,
                'perm_remove':role.perm_remove,
                'perm_revoke':role.perm_revoke,
                'perm_review':role.perm_review,
                'perm_approve':role.perm_approve,
            })

    context = {
        'org': {
            "org_name": org.name.upper(),
            "org_level": org.level,
            'perms': perms,
            'org_role': _org_role(org),
            'emp_role': _emp_role(org, request.user),
        },
    }

    return render(request, 'org/index.html', context)
