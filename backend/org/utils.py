from django.http.response import Http404
from django.db.models import Count, Q

from main import utils
from backend.token.utils import TokenGeneratorEmployee
from backend.inspire.models import LPackages
from backend.inspire.models import LFeatures
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LProperties
from backend.inspire.models import LDataTypes
from backend.inspire.models import LDataTypeConfigs
from backend.inspire.models import GovPermInspire
from backend.inspire.models import GovRoleInspire
from backend.inspire.models import EmpPerm
from backend.inspire.models import GovRole

from .models import Employee
from .models import EmployeeAddress
from .models import Org
from .models import Position
from .models import EmployeeErguul
from .forms import EmployeeForm
from .forms import EmployeeAddressForm
from geoportal_app.models import User
from geoportal_app.forms import UserForm


def get_address_state_db_value(address_state):
    if address_state == EmployeeAddress.STATE_REGULER_CODE:
        address_state = True
    else:
        address_state = False
    return address_state


def check_qs(Model, selected_filter):
    qs = Model.filter(**selected_filter)
    if not qs:
        raise Http404

    return qs


def get_is_user(user_id, item):
    user_qs = User.objects.filter(id=user_id)
    if not user_qs:
        return False
    user = user_qs.first()
    return user.is_user


def make_user_detail(values):
    keys = ['id', 'is_super', 'position', 'is_admin', 'phone_number', 'state', 'pro_class']
    user_detail = utils.key_remove_of_dict(values, keys)

    user_detail['is_superuser'] = values.get('is_super') if values.get('is_super') else False
    user_detail['is_active'] = values.get('is_user')
    user_detail['register'] = values.get('register').upper()

    return user_detail


def make_employee_detail(values, employee=None):
    keys = [
        'id', 'username', 'first_name', 'last_name', 'email',
        'position', 'gender', 'is_super', 'is_user', 'register',
    ]
    employee_detail = utils.key_remove_of_dict(values, keys)
    employee_detail['position_id'] = values.get('position')
    employee_detail['pro_class'] = int(values.get('pro_class')) if values.get('pro_class') else None
    if not employee:
        employee_detail['token'] = TokenGeneratorEmployee().get()
    else:
        employee_detail['token'] = employee.token

    return employee_detail


def get_point_for_db(coordinate):
    if not coordinate:
        return ''

    if isinstance(coordinate, str):
        coordinate = coordinate.split(",")

    point = utils.get_geom_for_filter_from_coordinate(coordinate, 'Point')
    return point


def get_address_state_code(address_state):
    if address_state:
        address_state = EmployeeAddress.STATE_REGULER_CODE
    elif not address_state:
        address_state = EmployeeAddress.STATE_SHORT_CODE
    return address_state


def make_employee_add(payload):
    address = payload.get('address')
    point_coordinate = address.get('point')
    point = get_point_for_db(point_coordinate)
    address_state = address.get('address_state')

    address['point'] = point
    address['address_state'] = get_address_state_code(address_state)

    return address


def user_validition(user_detail, user=None):
    if user:
        form = UserForm(user_detail, instance=user)
    else:
        form = UserForm(user_detail)

    if not form.is_valid():
        return form.errors

    return {}


def employee_validition(employee_detail, employee=None):
    if employee:
        form = EmployeeForm(employee_detail, instance=employee)
    else:
        form = EmployeeForm(employee_detail)
    if not form.is_valid():
        return form.errors

    return {}


def employee_add_validator(employee_address_detail, employee_address=None):
    if employee_address:
        form = EmployeeAddressForm(employee_address_detail, instance=employee_address)
    else:
        form = EmployeeAddressForm(employee_address_detail)

    if not form.is_valid():
        return form.errors

    return {}


def is_fired_employee(user, qs_employee):
    qs_employee = qs_employee.filter(user=user)
    qs_employee = qs_employee.filter(~Q(state=Employee.STATE_FIRED_CODE))
    if not qs_employee:
        return True

    return False


def set_state(employee):
    employee.state = Employee.STATE_FIRED_CODE
    employee.save()

    return True


def org_validation(org_name, org_id):
    org = Org.objects.filter(pk=org_id).first()
    errors = {}

    if not org_name:
        errors['org_name'] = 'Хоосон байна утга оруулна уу.'
    elif org_name.isspace():
        errors['org_name'] = 'Хоосон байна утга оруулна уу.'
    elif len(org_name) > 150:
        errors['org_name'] = '150-с илүүгүй урттай утга оруулна уу!'

    if org:
        if org.name != org_name:
            if Org.objects.filter(name=org_name).first():
                errors['org_name'] = 'Ийм нэр бүртгэлтэй байна.'
    else:
        if Org.objects.filter(name=org_name).first():
            errors['org_name'] = 'Ийм нэр бүртгэлтэй байна.'

    return errors


def get_theme_packages_gov(theme, role_inspire_perms, perm_count_qs):
    package_data = []
    t_perm_all = 0
    t_perm_view = 0
    t_perm_create = 0
    t_perm_remove = 0
    t_perm_update = 0
    t_perm_approve = 0
    t_perm_revoke = 0
    for package in theme.lpackages_set.all():
        t_perm_all = t_perm_all + 1
        features_all, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke = get_package_features_gove(package, role_inspire_perms, perm_count_qs)
        package_data.append(
            {
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': features_all,
                'perm_all': p_perm_all,
                'perm_view': p_perm_view,
                'perm_create': p_perm_create,
                'perm_remove': p_perm_remove,
                'perm_update': p_perm_update,
                'perm_approve': p_perm_approve,
                'perm_revoke': p_perm_revoke,
            }
        )
        if p_perm_all == p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 1
        elif 0 < p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 0.5

        if p_perm_all == p_perm_create and p_perm_all != 0:
            t_perm_create = t_perm_create + 1
        elif 0 < p_perm_create and p_perm_all != 0:
            t_perm_create = t_perm_create + 0.5

        if p_perm_all == p_perm_remove and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 1
        elif 0 < p_perm_remove and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 0.5

        if p_perm_all == p_perm_update and p_perm_all != 0:
            t_perm_update = t_perm_update + 1
        elif 0 < p_perm_update and p_perm_all != 0:
            t_perm_update = t_perm_update + 0.5

        if p_perm_all == p_perm_approve and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 1
        elif 0 < p_perm_approve and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 0.5

        if p_perm_all == p_perm_revoke and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 1
        elif 0 < p_perm_revoke and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 0.5

        if p_perm_all == 0:
            t_perm_all = t_perm_all - 1
    return package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke


def get_feature_property_gov(feature, role_inspire_perms, perm_count_qs):
    data_type_list = []
    feature_configs_qs = feature.lfeatureconfigs_set.all()
    feature_id = feature.feature_id
    perm_all = 1
    perm_view = 0
    perm_create = 0
    perm_remove = 0
    perm_update = 0
    perm_approve = 0
    perm_revoke = 0

    inspire_qs = role_inspire_perms.filter(feature_id=feature_id)
    inspire_perms = list(inspire_qs)

    for feature_config in feature_configs_qs:
        data_type = feature_config.data_type
        if data_type:
            data_type_obj = {
                'id': data_type.data_type_id,
                'code': data_type.data_type_code,
                'name': data_type.data_type_name,
                'definition': data_type.data_type_definition,
                'properties': [],
            }
            for dtc in data_type.ldatatypeconfigs_set.all():
                prop = dtc.property
                if prop:
                    perm_all = perm_all + 1
                    property_obj = {
                        'id': prop.property_id,
                        'code': prop.property_code,
                        'name': prop.property_name,
                        'perm_all': 6,
                        'perm_view': 0,
                        'perm_create': 0,
                        'perm_remove': 0,
                        'perm_update': 0,
                        'perm_approve': 0,
                        'perm_revoke': 0,
                    }
                    for gov_role_inspire in inspire_perms:
                        if (prop.property_id == gov_role_inspire.property_id) and gov_role_inspire.data_type_id == data_type.data_type_id:
                            if gov_role_inspire.perm_kind == GovRoleInspire.PERM_VIEW:
                                perm_view = perm_view + 1
                                property_obj['perm_view'] = property_obj['perm_view'] + 1
                            if gov_role_inspire.perm_kind == GovRoleInspire.PERM_CREATE:
                                perm_create = perm_create + 1
                                property_obj['perm_create'] = property_obj['perm_create'] + 1
                            if gov_role_inspire.perm_kind == GovRoleInspire.PERM_REMOVE:
                                perm_remove = perm_remove + 1
                                property_obj['perm_remove'] = property_obj['perm_remove'] + 1
                            if gov_role_inspire.perm_kind == GovRoleInspire.PERM_UPDATE:
                                perm_update = perm_update + 1
                                property_obj['perm_update'] = property_obj['perm_update'] + 1
                            if gov_role_inspire.perm_kind == GovRoleInspire.PERM_APPROVE:
                                perm_approve = perm_approve + 1
                                property_obj['perm_approve'] = property_obj['perm_approve'] + 1
                            if gov_role_inspire.perm_kind == GovRoleInspire.PERM_REVOKE:
                                perm_revoke = perm_revoke + 1
                                property_obj['perm_revoke'] = property_obj['perm_revoke'] + 1
                    data_type_obj['properties'].append(property_obj)
                data_type_list.append(data_type_obj)

    for perm in perm_count_qs:
        if perm['feature_id'] == feature_id:
            if perm['perm_kind'] == GovRoleInspire.PERM_VIEW:
                perm_view = perm_view + perm['perm_count']
            if perm['perm_kind'] == GovRoleInspire.PERM_CREATE:
                perm_create = perm_create + perm['perm_count']
            if perm['perm_kind'] == GovRoleInspire.PERM_REMOVE:
                perm_remove = perm_remove + perm['perm_count']
            if perm['perm_kind'] == GovRoleInspire.PERM_UPDATE:
                perm_update = perm_update + perm['perm_count']
            if perm['perm_kind'] == GovRoleInspire.PERM_APPROVE:
                perm_approve = perm_approve + perm['perm_count']
            if perm['perm_kind'] == GovRoleInspire.PERM_REVOKE:
                perm_revoke = perm_revoke + perm['perm_count']

    return data_type_list, perm_all, perm_view, perm_create, perm_remove, perm_update, perm_approve, perm_revoke


def get_package_features_gove(package, role_inspire_perms, perm_count_qs):
    feat_values = []
    p_perm_all = 0
    p_perm_view = 0
    p_perm_create = 0
    p_perm_remove = 0
    p_perm_update = 0
    p_perm_approve = 0
    p_perm_revoke = 0

    for feat in package.lfeatures_set.all():
        data_type_list, perm_all, perm_view, perm_create, perm_remove, perm_update, perm_approve, perm_revoke = get_feature_property_gov(feat, role_inspire_perms, perm_count_qs)
        if not perm_all == 1:
            p_perm_all = p_perm_all + 1
            feat_values.append({
                'id': feat.feature_id,
                'code': feat.feature_code,
                'name': feat.feature_name,
                'data_types': data_type_list,
                'perm_all': perm_all,
                'perm_view': perm_view,
                'perm_create': perm_create,
                'perm_remove': perm_remove,
                'perm_update': perm_update,
                'perm_approve': perm_approve,
                'perm_revoke': perm_revoke,
            })
            if perm_all == perm_view and perm_all != 0:
                p_perm_view = p_perm_view + 1
            elif 0 < perm_view and perm_all != 0 and perm_view < perm_all:
                p_perm_view = p_perm_view + 0.5
            if perm_all == perm_create and perm_all != 0:
                p_perm_create = p_perm_create + 1
            elif 0 < perm_create and perm_all != 0 and perm_create < perm_all:
                p_perm_create = p_perm_create + 0.5
            if perm_all == perm_remove and perm_all != 0:
                p_perm_remove = p_perm_remove + 1
            elif 0 < perm_remove and perm_all != 0 and perm_remove < perm_all:
                p_perm_remove = p_perm_remove + 0.5
            if perm_all == perm_update and perm_all != 0:
                p_perm_update = p_perm_update + 1
            elif 0 < perm_update and perm_all != 0 and perm_update < perm_all:
                p_perm_update = p_perm_update + 0.5
            if perm_all == perm_approve and perm_all != 0:
                p_perm_approve = p_perm_approve + 1
            elif 0 < perm_approve and perm_all != 0 and perm_approve < perm_all:
                p_perm_approve = p_perm_approve + 0.5
            if perm_all == perm_revoke and perm_all != 0:
                p_perm_revoke = p_perm_revoke + 1
            elif 0 < perm_revoke and perm_all != 0 and perm_revoke < perm_all:
                p_perm_revoke = p_perm_revoke + 0.5
            if perm_all == 0:
                p_perm_all = p_perm_all - 1

    return feat_values, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke


def get_package_features(package_id, gov_perm):
    feat_values = []
    p_perm_all = 0
    p_perm_view = 0
    p_perm_create = 0
    p_perm_remove = 0
    p_perm_update = 0
    p_perm_approve = 0
    p_perm_revoke = 0

    for feat in LFeatures.objects.filter(package_id=package_id):
        data_type_list, perm_all, perms = get_feature_property(feat.feature_id, gov_perm)
        if not perm_all == 1:
            p_perm_all = p_perm_all + 1
            feat_values.append({
                'id': feat.feature_id,
                'code': feat.feature_code,
                'name': feat.feature_name,
                'data_types': data_type_list,
                'perm_all': perm_all,
                'perm_view': perms['perm_view'],
                'perm_create': perms['perm_create'],
                'perm_remove': perms['perm_remove'],
                'perm_update': perms['perm_update'],
                'perm_approve': perms['perm_approve'],
                'perm_revoke': perms['perm_revoke'],
            })
            perm_view = perms['perm_view']
            perm_create = perms['perm_create']
            perm_remove = perms['perm_remove']
            perm_update = perms['perm_update']
            perm_approve = perms['perm_approve']
            perm_revoke = perms['perm_revoke']

            if perm_all == perm_view and perm_all != 0:
                p_perm_view = p_perm_view + 1

            elif 0 < perm_view and perm_all != 0 and perm_view < perm_all:
                p_perm_view = p_perm_view + 0.5
            if perm_all == perm_create and perm_all != 0:
                p_perm_create = p_perm_create + 1
            elif 0 < perm_create and perm_all != 0 and perm_create < perm_all:
                p_perm_create = p_perm_create + 0.5
            if perm_all == perm_remove and perm_all != 0:
                p_perm_remove = p_perm_remove + 1
            elif 0 < perm_remove and perm_all != 0 and perm_remove < perm_all:
                p_perm_remove = p_perm_remove + 0.5
            if perm_all == perm_update and perm_all != 0:
                p_perm_update = p_perm_update + 1
            elif 0 < perm_update and perm_all != 0 and perm_update < perm_all:
                p_perm_update = p_perm_update + 0.5
            if perm_all == perm_approve and perm_all != 0:
                p_perm_approve = p_perm_approve + 1
            elif 0 < perm_approve and perm_all != 0 and perm_approve < perm_all:
                p_perm_approve = p_perm_approve + 0.5
            if perm_all == perm_revoke and perm_all != 0:
                p_perm_revoke = p_perm_revoke + 1
            elif 0 < perm_revoke and perm_all != 0 and perm_revoke < perm_all:
                p_perm_revoke = p_perm_revoke + 0.5
            if perm_all == 0:
                p_perm_all = p_perm_all - 1

    return feat_values, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke


def get_theme_packages(theme_id, gov_perm):
    package_data = []
    t_perm_all = 0
    t_perm_view = 0
    t_perm_create = 0
    t_perm_remove = 0
    t_perm_update = 0
    t_perm_approve = 0
    t_perm_revoke = 0
    for package in LPackages.objects.filter(theme_id=theme_id):
        t_perm_all = t_perm_all + 1
        features_all, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke = get_package_features(package.package_id, gov_perm)
        package_data.append({
            'id': package.package_id,
            'code': package.package_code,
            'name': package.package_name,
            'features': features_all,
            'perm_all': p_perm_all,
            'perm_view': p_perm_view,
            'perm_create': p_perm_create,
            'perm_remove': p_perm_remove,
            'perm_update': p_perm_update,
            'perm_approve': p_perm_approve,
            'perm_revoke': p_perm_revoke,
        })
        if p_perm_all == p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 1
        elif 0 < p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 0.5

        if p_perm_all == p_perm_create and p_perm_all != 0:
            t_perm_create = t_perm_create + 1
        elif 0 < p_perm_create and p_perm_all != 0:
            t_perm_create = t_perm_create + 0.5

        if p_perm_all == p_perm_remove and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 1
        elif 0 < p_perm_remove and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 0.5

        if p_perm_all == p_perm_update and p_perm_all != 0:
            t_perm_update = t_perm_update + 1
        elif 0 < p_perm_update and p_perm_all != 0:
            t_perm_update = t_perm_update + 0.5

        if p_perm_all == p_perm_approve and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 1
        elif 0 < p_perm_approve and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 0.5

        if p_perm_all == p_perm_revoke and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 1
        elif 0 < p_perm_revoke and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 0.5

        if p_perm_all == 0:
            t_perm_all = t_perm_all - 1
    return package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke


def get_feature_property(feature_id, gov_perm):
    data_type_list = []
    perm_all = 1

    perms = {
        'perm_view': 0,
        'perm_create': 0,
        'perm_remove': 0,
        'perm_update': 0,
        'perm_approve': 0,
        'perm_revoke': 0,
    }

    perms_obj = {
        GovPermInspire.PERM_VIEW: 'perm_view',
        GovPermInspire.PERM_CREATE: 'perm_create',
        GovPermInspire.PERM_REMOVE: 'perm_remove',
        GovPermInspire.PERM_UPDATE: 'perm_update',
        GovPermInspire.PERM_APPROVE: 'perm_approve',
        GovPermInspire.PERM_REVOKE: 'perm_revoke',
    }

    feature_c_qs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    feature_c_qs = feature_c_qs.values('data_type_id', 'data_type_display_name')
    inspire_perms = gov_perm.govperminspire_set.filter(feature_id=feature_id)

    for feature_c in feature_c_qs:
        ldata_type_c_qs = LDataTypeConfigs.objects
        ldata_type_c_qs = ldata_type_c_qs.filter(data_type_id=feature_c['data_type_id'])
        if ldata_type_c_qs:
            gov_data_type_qs = inspire_perms.filter(data_type_id=feature_c['data_type_id'])

            data_type_obj = {
                'id': feature_c['data_type_id'],
                'name': feature_c['data_type_display_name'],
                # 'code': feature_c['data_type_display_name'],
                # 'definition': data_type.data_type_definition,
                'properties': [],
            }

            property_ids = ldata_type_c_qs.values_list('property_id', flat=True)

            qs_properties = LProperties.objects
            qs_properties = qs_properties.filter(property_id__in=property_ids)
            properties = qs_properties.values('property_id', 'property_code', 'property_name', 'value_type_id')

            for prop in properties:
                if prop['property_code'].lower() != 'localid':
                    if prop['value_type_id'] != 'data-type':
                        perm_all = perm_all + 1
                        property_obj = {
                            'id': prop['property_id'],
                            'code': prop['property_code'],
                            'name': prop['property_name'],
                            'perm_all': 6,
                            'perm_view': 0,
                            'perm_create': 0,
                            'perm_remove': 0,
                            'perm_update': 0,
                            'perm_approve': 0,
                            'perm_revoke': 0,
                        }

                        if gov_perm:
                            for gov_role_inspire in gov_data_type_qs:
                                if (prop['property_id'] == gov_role_inspire.property_id) and feature_id == gov_role_inspire.feature_id:
                                    for perm_kind, perm_name in perms_obj.items():
                                        if perm_kind == gov_role_inspire.perm_kind:
                                            perms[perm_name] = perms[perm_name] + 1
                                            property_obj[perm_name] = property_obj[perm_name] + 1

                            data_type_obj['properties'].append(property_obj)
            data_type_list.append(data_type_obj)

    inspire_perms = inspire_perms.filter(geom=True, property_id=None)
    if inspire_perms:
        inspire_perms = inspire_perms.values('perm_kind')
        inspire_perms = inspire_perms.annotate(perm_count=Count('perm_kind'))

        if gov_perm:
            for inspire_perm in inspire_perms.values():
                kind_name = perms_obj[inspire_perm['perm_kind']]
                perms[kind_name] = perms[kind_name] + inspire_perm['perm_count']

    return data_type_list, perm_all, perms


def pos_name_or_id_check(qs_pos, name, pos_id=None):
    has_pos_name = False
    qs_pos = qs_pos.filter(name=name)
    if qs_pos:
        if pos_id:
            if qs_pos.first().id != pos_id:
                has_pos_name = True
        else:
            has_pos_name = True
    return has_pos_name


def get_name(user_id, item):
    user = User.objects.filter(pk=user_id).first()
    full_name = user.last_name[0].upper() + '.' + user.first_name.upper()
    return full_name


def get_email(user_id, item):
    user = User.objects.filter(pk=user_id).first()
    return user.email


def get_role_name(item):
    role_name = ''
    role = EmpPerm.objects.filter(employee=item['id']).first()
    if role and role.emp_role:
        role_name = role.emp_role.name
    return role_name


def get_position_name(postition_id, item):
    position = Position.objects.filter(id=postition_id).first()
    position_name = position.name
    return position_name


def get_state_name(state_id, item):
    if state_id == Employee.STATE_WORKING_CODE:
        state = Employee.STATE_WORKING
    elif state_id == Employee.STATE_BREAK_CODE:
        state = Employee.STATE_BREAK
    elif state_id == Employee.STATE_FIRED_CODE:
        state = Employee.STATE_FIRED
    else:
        state = Employee.STATE_SICK
    return state


def perm_name_validation(payload, perm):
    values = payload.get('values')
    role_id = payload.get('pk')
    errors = {}
    check_name = False

    if role_id:
        if perm.name != values['name']:
            check_name = True

    if check_name or not role_id:
        perm_by_name = GovRole.objects.filter(name=values['name']).first()
        if perm_by_name:
            errors['name'] = 'Нэр давхцаж байна!'
    return errors


def get_roles_display():

    return [
        {
            'id': gov_role.id,
            'name': gov_role.name,
        }
        for gov_role in GovRole.objects.all()
    ]


def is_cloned_feature(address_qs):
    is_cloned = False
    erguul_id = address_qs.employeeerguul_set.values_list('id', flat=True).first()
    if erguul_id:
        is_cloned = True
    return is_cloned


def get_erguul_qs(employee):
    address_id = employee.employeeaddress_set.values_list('id', flat=True).first()
    erguul_qs = EmployeeErguul.objects
    erguul_qs = erguul_qs.filter(address_id=address_id)
    erguul_qs = erguul_qs.filter(is_over=False)
    erguul = erguul_qs.values().first()
    return erguul


def get_erguul(erguul, field):
    value = ''
    if erguul:
        value = erguul[field]
    return value


def get_choices(Model, field_name):
    choices = list()
    for f in Model._meta.get_fields():
        if f.name == field_name:
            choices = f.choices
    return choices
