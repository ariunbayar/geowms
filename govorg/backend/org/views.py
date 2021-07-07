from django.shortcuts import render, get_object_or_404
from django.db.models import F, Q
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.http.response import Http404

from backend.org.models import Org, Employee
from backend.inspire.models import EmpPerm
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import LProperties
from backend.inspire.models import LThemes
from backend.inspire.models import LPackages
from backend.inspire.models import LFeatures
from backend.inspire.models import MGeoDatas
from backend.org.models import Position
from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display2,
    count_property_of_feature,
    get_perm_kind_name,
    get_perm_list
)

from main.decorators import ajax_required, gov_required
from main import utils
from main.components import Datatable
from django.views.decorators.cache import cache_page


def _get_properties_by_feature(initial_qs, feature_ids):

    qs = initial_qs
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
            "perm_kind": perm_kind,
            "prop_obj": properties[property_id],
        })

    return feature_property_ids


def _group_att(qs, att_name, exclude_null=True):
    qs = qs.distinct(att_name)
    if exclude_null:
        exclude = dict()
        exclude[att_name + "__isnull"] = True
        qs = qs.exclude(**exclude)
    qs = qs.order_by(att_name)
    qs = qs.values_list(att_name, flat=True)
    return qs


def _org_role(org):

    properties = []
    property_of_feature = {}
    themes = []
    package_features = []
    gov_perm = org.govperm_set.first()
    property_ids_of_feature = {}

    if gov_perm:
        gov_perm_inspire_qs = gov_perm.govperminspire_set
        feature_ids = _group_att(gov_perm_inspire_qs, 'feature_id')

        features_qs = LFeatures.objects.filter(feature_id__in=feature_ids)
        package_ids = _group_att(features_qs, 'package_id')

        packages_qs = LPackages.objects.filter(package_id__in=package_ids)
        theme_ids = _group_att(packages_qs, 'theme_id')

        gov_perm_inspire_qs = gov_perm_inspire_qs.filter(feature_id__in=feature_ids)
        property_of_feature = _get_properties_by_feature(gov_perm_inspire_qs, feature_ids)
        perm_list_all = list(gov_perm_inspire_qs.values('geom', 'property_id', 'feature_id', ins_id=F('id'), kind=F('perm_kind')))

        for feature_id, props in property_of_feature.items():
            # geom
            perm_list = get_perm_list(feature_id, None, True, perm_list_all)
            properties.append(
                get_property_data_display2(perm_list, None, feature_id, geom=True)
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
                        get_property_data_display2(perm_list, prop['prop_obj'], feature_id, geom=False)
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
    point_perm = {'PERM_VIEW': False}
    if emp_perm:
        point_feature_id = LFeatures.objects.filter(feature_code='gnp-gp-gp').first()
        feature_ids = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, geom=True, perm_kind=EmpPermInspire.PERM_VIEW).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))
        if feature_ids:
            qs = LFeatures.objects.filter(feature_id__in=feature_ids)

            if point_feature_id:
                point_id = point_feature_id.feature_id
                if point_id in feature_ids:
                    qs = qs.exclude(feature_id=point_id)
                    point_perm['PERM_VIEW'] = True

            package_ids = list(qs.distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
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
                    'code': theme.theme_code,
                })
    return {
        'themes': themes,
        'package_features': package_features,
        'point_perms': point_perm
    }


@login_required(login_url='/gov/secure/login/')
# @cache_page(60 * 15)
def frontend(request):

    approve = False
    revoke = False

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    org = get_object_or_404(Org, employee=employee)
    geom = utils.get_geom(org.geo_id, 'MultiPolygon')

    emp_perm = employee.empperm_set.first()
    if emp_perm:
        emp_perm_insp = emp_perm.empperminspire_set
        approve = emp_perm_insp.filter(perm_kind=EmpPermInspire.PERM_APPROVE).first()
        revoke = emp_perm_insp.filter(perm_kind=EmpPermInspire.PERM_REVOKE).first()

    context = {
        'org': {
            "org_name": org.name.upper(),
            "org_level": org.level,
            'employee': {
                'is_admin': employee.is_admin,
                'username': employee.user.username,
                'geo_id': org.geo_id or None
            },
            'allowed_geom': geom.json if geom else None,
            'approve': True if approve else False,
            'revoke': True if revoke else False,
        },
    }

    return render(request, 'org/index.html', context)


@require_GET
@ajax_required
@gov_required
@login_required(login_url='/gov/secure/login/')
def get_perms(request):
    data = dict()

    org = request.org
    data['org_role'] = _org_role(org)
    data['emp_role'] = _emp_role(org, request.user)

    rsp = {
        'success': True,
        'data': data
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def emp_role(request):

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    org = get_object_or_404(Org, employee=employee)
    rsp = {
        'success': True,
        'emp_role': _emp_role(org, request.user)
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_approve_and_revoke(request):
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    emp_perm = EmpPerm.objects.filter(employee=employee).first()

    approve = EmpPermInspire.objects.filter(emp_perm=emp_perm, perm_kind=EmpPermInspire.PERM_APPROVE).first()
    revoke = EmpPermInspire.objects.filter(emp_perm=emp_perm, perm_kind=EmpPermInspire.PERM_REVOKE).first()

    rsp = {
        'approve': True if approve else False,
        'revoke': True if revoke else False,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@gov_required
@login_required(login_url='/gov/perm/position/')
def position_list(request, payload):
    items = []
    page = 1
    total_page = 1
    start_index = 1
    оруулах_талбарууд = ['id', 'name', 'org_id']

    qs = Position.objects.filter(org=request.org)
    if qs:
        datatable = Datatable(
            model=Position,
            initial_qs=qs,
            payload=payload,
            оруулах_талбарууд=оруулах_талбарууд
        )
        items, total_page, start_index = datatable.get()
        page = payload.get('page')

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
        'start_index': start_index,
    }

    return JsonResponse(rsp)


def _pos_name_or_id_check(qs_pos, name, pos_id=None):
    has_pos_name = False
    qs_pos = qs_pos.filter(name=name)
    if qs_pos:
        if pos_id:
            if qs_pos.first().id != pos_id:
                has_pos_name = True
        else:
            has_pos_name = True
    return has_pos_name


def _make_pos_data(datas, pk):
    datas['org_id'] = pk
    return datas


@require_POST
@ajax_required
@gov_required
def pos_create(request, payload):
    org = request.org
    name = payload.get("name")
    qs = Position.objects
    qs_pos = qs.filter(org=org)
    has_pos_name = _pos_name_or_id_check(qs_pos, name)

    if has_pos_name:
        rsp = {
            'success': False,
            'error': '"{name}" нэртэй албан тушаал байна!!!'.format(name=name)
        }
    else:
        datas = _make_pos_data(payload, org.id)
        Position.objects.create(**datas)
        rsp = {
            'success': True,
            'data': '"{name}" нэртэй албан тушаалыг амжилттай нэмлээ.'.format(name=name)
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@gov_required
def pos_remove(request, pk):
    position = get_object_or_404(Position, id=pk)
    has_emp_pos = position.employee_set.all()

    if has_emp_pos:
        rsp = {
            'success': False,
            'error': '"{position}" албан тушаалыг хэрэглэгчид оноосон байна!!!'.format(position=position.name),
        }
    else:
        position.delete()
        rsp = {
            'success': True,
            'data': "Амжилттай устгалаа"
        }

    return JsonResponse(rsp)


def _del_unneed_keys(obj):
    del_keys = ['pos_id']
    for key in del_keys:
        del obj[key]

    return obj


@require_POST
@ajax_required
@gov_required
def pos_update(request, payload, pk):
    name = payload.get("name")
    pos_id = int(payload.get("pos_id"))
    qs = Position.objects
    qs_pos = qs.filter(org=request.org)
    has_pos_name = _pos_name_or_id_check(qs_pos, name, pos_id)

    if has_pos_name:
        rsp = {
            'success': False,
            'error': '"{name}" нэртэй албан тушаал байна!!!'.format(name=name)
        }
    else:
        payload = _del_unneed_keys(payload)
        qs_pos.filter(
            id=pos_id
        ).update(**payload)
        rsp = {
            'success': True,
            'data': 'Албан тушаалыг амжилттай шинэчлэлээ.'.format(name=name)
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@gov_required
def pos_detail(request, pk):
    position = Position.objects.filter(id=pk, org=request.org)
    if not position:
        raise Http404
    datas = position.values('id', 'name').first()
    rsp = {
        'success': True,
        'datas': datas
    }

    return JsonResponse(rsp)
