from django.http.response import Http404
from django.db.models import Q

from main import utils
from backend.token.utils import TokenGeneratorEmployee
from backend.org.models import Employee, EmployeeAddress
from backend.org.forms import EmployeeForm
from backend.org.forms import EmployeeAddressForm
from geoportal_app.forms import UserForm


def make_user_detail(values):
    values = values.get('user_detail')

    keys = ['phone_number', 'position', 'choose_role', 'state', 'pro_class', 'is_admin']
    user_detail = utils.key_remove_of_dict(values, keys)

    user_detail['is_active'] = user_detail.get('is_user')
    user_detail['register'] = user_detail.get('register').upper()

    return user_detail


def make_employee_detail(values, employee=None):
    values = values.get('user_detail')
    keys = [
        'username', 'first_name', 'last_name', 'email',
        'position', 'gender', 'is_user', 'register', 'choose_role'
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


def make_employee_address(payload):
    address = payload.get('address')
    point_coordinate = address.get('point')
    address_state = address.get('address_state')

    point = get_point_for_db(point_coordinate)
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


def check_qs(Model, selected_filter):
    qs = Model.filter(**selected_filter)
    if not qs:
        raise Http404

    return qs
