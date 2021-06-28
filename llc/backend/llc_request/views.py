from govorg.backend.org_request.models import ChangeRequest

import os
import glob
from django.db.models import Count


from django.conf import settings
from django.db import connections
from django.contrib.gis.geos import GEOSGeometry

from django.contrib.auth.decorators import login_required

from django.http import JsonResponse
from django.http.response import StreamingHttpResponse
from django.views.decorators.http import require_GET, require_POST
from django.contrib.gis.gdal import DataSource
from django.core.mail import send_mail, get_connection

from llc.backend.llc_request.models import (
    RequestFiles,
    ShapeGeom,
    RequestFilesShape,
    RequestForm,
    LLCRequest
)
from backend.org.models import Employee, Org, Position
from backend.org.models import Org
from backend.inspire.models import (
    MDatas,
    LCodeLists,
    LThemes,
    LFeatures,
    LPackages,
)
from geoportal_app.models import User

from geojson import FeatureCollection

from main.components import Datatable
from main.decorators import ajax_required, llc_required
from main.utils import (
    json_dumps,
    json_load,
    get_sql_execute,
    get_config,
    get_geom,
    datetime_to_string,
    get_feature
)
from main import utils


POSITION_MERGEJILTEN = Position.objects.filter(name='Мэргэжилтэн')

# Create your views here.

def _get_display_text(field, value):
    for f in RequestFiles._meta.get_fields():
        if hasattr(f, 'choices'):
            if f.name == field:
                for c_id, c_type in f.choices:
                    if c_id == value:
                        return c_type


def _choice_state_display(state, item):
    display_name = _get_display_text('state', state)
    return display_name


def _choice_kind_display(kind, item):
    display_name = _get_display_text('kind', kind)
    return display_name


@require_POST
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
@ajax_required
def llc_request_list(request, payload, content):
    company_name = content.get('company_name')
    qs = RequestFiles.objects.filter(name__exact=company_name)
    start_index = 1
    if qs:
        оруулах_талбарууд = ['id', 'name', 'kind', 'state',  'created_at', 'updated_at', 'file_path', 'description']
        хувьсах_талбарууд = [
            {'field': 'state', 'action': _choice_state_display, "new_field": "state"},
            {'field': 'kind', 'action': _choice_kind_display, "new_field": "kind"}
        ]

        datatable = Datatable(
            model=RequestFiles,
            initial_qs=qs,
            payload=payload,
            оруулах_талбарууд=оруулах_талбарууд,
            хувьсах_талбарууд=хувьсах_талбарууд
        )
        items, total_page, start_index = datatable.get()

        rsp = {
            'items': items,
            'page': payload.get('page'),
            'total_page': total_page,
            'start_index': start_index,
        }
    else:
        rsp = {
            'items': [],
            'page': payload.get('page'),
            'total_page': 1,
            'start_index': start_index
        }

    return JsonResponse(rsp)


def _get_leve_2_geo_id(layer):
    position_ids = list(POSITION_MERGEJILTEN.values_list('id', flat=True))
    get_employees = list(Employee.objects.filter(position_id__in=position_ids).values_list('org_id', flat=True).annotate(dcount=Count('org_id')).order_by())
    qs_org = Org.objects.filter(id__in=get_employees, level=2)

    cursor = connections['default'].cursor()
    data_of_range = []
    for feature in layer:
        geo_json = feature.geom.json
        break

    if geo_json:
        for org in qs_org:
            sql = '''
                SELECT ST_AsText(st_force2d(ST_GeomFromGeoJSON('{geo_json}'))) As wkt
            '''.format(geo_json=geo_json)
            valid_geodata = get_sql_execute(sql, cursor, 'all')[0].get('wkt')

            sql_2 = '''
            select
                ST_Contains(
                    ST_Transform(geo_data, 4326),
                    ST_GeomFromText('{geom}', 4326)
                )
            As check_geom
            from
                m_geo_datas
            where geo_id='{geo_id}'
            '''.format(
                geom=valid_geodata,
                geo_id=org.geo_id
            )
            check_geom = get_sql_execute(sql_2, cursor, 'all')[0].get('check_geom')
            if check_geom:
                data_of_range = org
                break
    return data_of_range


def _create_shape_files(org_data, file_qs, extract_path, datasource_exts, file_name):
    remove_shape_ids = []
    if file_name != 'blob':
        file_shapes = RequestFilesShape.objects.filter(files=file_qs)
        if file_shapes:
            if file_qs.kind == RequestFiles.KIND_DISMISS:
                file_shapes = file_shapes.filter(state=RequestFilesShape.STATE_SENT, kind=RequestFilesShape.KIND_DISMISS)
                remove_shape_ids = list(file_shapes.values_list('id', flat=True))
            else:
                remove_shape_ids = list(file_shapes.values_list('id', flat=True))
                shape_of_geoms = ShapeGeom.objects.filter(shape_id__in=remove_shape_ids)
                shape_of_geoms.delete()
                file_shapes.delete()

        for name in glob.glob(os.path.join(extract_path, '*')):
            if [item for item in datasource_exts if item in name]:
                ds = DataSource(name)
                file_shape_id = ''
                if file_qs.kind == RequestFiles.KIND_DISMISS:
                    for shape_id in remove_shape_ids:
                        valid_data_type = False
                        shape_of_geoms = ShapeGeom.objects.filter(shape_id=shape_id)

                        if shape_of_geoms:
                            shape_of_geom = shape_of_geoms.first()
                            wanted_data_type = shape_of_geom.geom_json
                            wanted_data_type = json_load(wanted_data_type)
                            wanted_data_type = wanted_data_type['type']

                            for layer in ds:
                                for feature in layer:
                                    geo_json = feature.geom.json
                                    geo_json = json_load(geo_json)
                                    current_geojson_type = geo_json['type']

                                    if wanted_data_type == current_geojson_type:
                                        valid_data_type = True
                                    break
                        if valid_data_type:
                            file_shape_id = shape_id
                            shape_of_geoms.delete()
                            break

                else:
                    request_shape = RequestFilesShape.objects.create(
                        files=file_qs,
                        org=org_data
                    )
                    file_shape_id = request_shape.id
                if file_shape_id:
                    for layer in ds:
                        for feature in layer:
                            geo_json = feature.geom.json
                            properties = dict()
                            for field in layer.fields:
                                properties[field] = feature.get(field)
                            json_content = json_load(geo_json)

                            for key, value in properties.items():
                                properties[key] = utils.datetime_to_string(value)

                            ShapeGeom.objects.create(
                                shape_id=file_shape_id,
                                geom_json=json_dumps(json_content),
                                form_json=json_dumps(properties)
                            )
                utils.remove_file(name)
            elif '.zip' not in name:
                utils.remove_file(name)


# TODO neg shape dotor olon adilhan turultei baih nuhtsuliig tootsoh
def _conv_geom(geojson):
    geojson = utils.json_load(geojson)
    return GEOSGeometry(utils.json_dumps(geojson), srid=4326)


def _check_not_approved_shape(json_content, file_shapes):
    shape_geoms = ShapeGeom.objects.filter(shape=file_shapes)
    geom = shape_geoms.geom_json

    geom = _conv_geom(geom)

    json_content = _conv_geom(json_content)
    submitted = json_content.equals(geom)
    for shape_geom in shape_geoms:

        if submitted:
            break


def _validation_request(request_datas, uploaded_file, check_data_of_file, id):

    saved_ids = list()
    is_agreed = True
    info = ''
    file_name = uploaded_file.name
    selected_tools = json_load(request_datas.get('selected_tools'))
    selected_tools = selected_tools['selected_tools']

    if file_name != 'blob' and id:
        if not uploaded_file.name.endswith('.zip'):
            info = 'Заавал zip файл оруулах ёстой.!!!'
            return False, info

    if check_data_of_file and not id:
        info = 'Файл-ын нэр давхцаж байна !!!.'
        return False, info

    if not request_datas.get('zahialagch'): is_agreed = False
    if not request_datas.get('project_name'): is_agreed = False
    if not request_datas.get('object_type'): is_agreed = False
    if not request_datas.get('object_count'): is_agreed = False
    if not request_datas.get('hurungu_oruulalt'): is_agreed = False

    if not is_agreed:
        info = 'Форм дутуу бөглөгдсөн байна.!!!'
        return is_agreed, info

    if not selected_tools:
        info = 'Ашигласан багажны мэдээлэл хоосон байна !!!'
        return False, info

    for tool in selected_tools:
        if tool['bagaj_dugaar'] in saved_ids:
            info = 'Таны сонгосон багаж давхцаж байна.!!!'
            return False, info
        saved_ids.append(tool['bagaj_dugaar'])

    return is_agreed, info


def _request_file(id, uploaded_file, check_data_of_file, file_name, main_path, file_path, file_not_ext_name, ):
    extract_path = os.path.join(settings.MEDIA_ROOT, main_path)

    if check_data_of_file and id:
        current_folder = file_name.split('.')[0]
        check_folder = os.path.join(settings.MEDIA_ROOT, main_path)
        save_file_path = os.path.join(check_folder, current_folder)
        folder_list = os.listdir(check_folder)

        if current_folder in folder_list:
            get_files = os.listdir(check_folder + "/" + current_folder)
            for file in get_files:
                delete_file_path = os.path.join(check_folder, current_folder, file)
                utils.remove_file(delete_file_path)
            utils.save_file_to_storage(uploaded_file, save_file_path, uploaded_file.name)
        check_data_of_file = False
    else:
        utils.save_file_to_storage(uploaded_file, file_path, file_name)

    if not check_data_of_file or not id:
        if file_name != 'blob':
            extract_path = os.path.join(extract_path, file_not_ext_name)
            file_path = os.path.join(settings.MEDIA_ROOT, file_path, file_name)
            utils.unzip(file_path, extract_path)
            utils.remove_file(file_path)
        return True, extract_path


@require_POST
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
@ajax_required
def save_request(request, content):
    request_file_data = {}
    org_data = []
    company_name = content.get('company_name')
    main_path = 'llc-request-files'

    request_datas = request.POST
    id = request.POST.get('id') or None
    uploaded_file = request.FILES['files']
    project_name = request.POST.get('project_name')
    object_type = request.POST.get('object_type')
    object_count = request.POST.get('object_count')
    hurungu_oruulalt = request.POST.get('hurungu_oruulalt')
    zahialagch = request.POST.get('zahialagch')
    ulsiin_hemjeend = request.POST.get('ulsiin_hemjeend')
    selected_tools = request.POST.get('selected_tools') or []

    file_name = uploaded_file.name
    file_not_ext_name = utils.get_file_name(file_name)
    file_path = os.path.join(main_path, file_not_ext_name)

    selected_tools = json_load(selected_tools)
    get_tools = selected_tools['selected_tools']

    check_file_name = os.path.join(main_path, file_not_ext_name, str(uploaded_file))
    check_data_of_file = RequestFiles.objects.filter(file_path=check_file_name).first()

    if id:
        id = json_load(id)
        id = id.get('id')

    is_agreed, info = _validation_request(request_datas, uploaded_file, check_data_of_file, id)

    if not is_agreed:
        return JsonResponse({
            'success': False,
            'info': info
        })

    is_file, extract_path = _request_file(id, uploaded_file, check_data_of_file, file_name, main_path, file_path, file_not_ext_name)
    if is_file:
        datasource_exts = ['.gml', '.geojson']
        for name in glob.glob(os.path.join(extract_path, '*')):
            for ext in datasource_exts:
                if ext in name:
                    ds = DataSource(name)
                    for layer in ds:
                        if len(layer) >= 1:
                            org_data = _get_leve_2_geo_id(layer)
                            if not org_data:
                                utils.remove_folder(extract_path)
                                return JsonResponse({
                                    'success': False,
                                    'info': 'Хамрах хүрээний байгууллага олдсонгүй. Системийн админд хандана уу !!!'
                                })
                        else:
                            utils.remove_folder(extract_path)
                            return JsonResponse({
                                'success': False,
                                'info': 'Файл хоосон байна !!!'
                            })

        request_file_data['name'] = company_name
        request_file_data['tools'] = json_dumps(get_tools)

        if id:
            if not check_data_of_file:
                if file_name != 'blob':
                    request_file_data['file_path'] = uploaded_file
                    request_file_data['geo_id'] = org_data.geo_id

            if ulsiin_hemjeend:
                request_file_data['geo_id'] = ulsiin_hemjeend

        else:
            request_file_data['kind'] = RequestFiles.KIND_NEW
            request_file_data['state'] = RequestFiles.STATE_NEW
            request_file_data['file_path'] = uploaded_file
            if org_data:
                request_file_data['geo_id'] = org_data.geo_id

        qs_request_file = RequestFiles.objects.update_or_create(
            id=id,
            defaults=request_file_data
        )

        hurungu_oruulalt = int(hurungu_oruulalt)
        file_qs = list(qs_request_file)[0]

        RequestForm.objects.update_or_create(
            file_id=file_qs.id,
            defaults = {
                'client_org': zahialagch,
                'project_name': project_name,
                'object_type': object_type,
                'object_quantum': object_count,
                'investment_status': hurungu_oruulalt,
            }
        )

        _create_shape_files(org_data, file_qs, extract_path, datasource_exts, file_name)

    rsp = {
        'success': True,
        'info': 'Амжилттай хадгаллаа'
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
def get_all_geo_json(request):
    features = []

    shape_geometries = ShapeGeom.objects.all()
    features, geom_type = get_feature(shape_geometries)
    return JsonResponse({
        'geo_json_datas': FeatureCollection(features)
    })


@require_GET
@ajax_required
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
def get_request_data(request, id):

    features = []
    field = {}
    qs = RequestForm.objects.filter(file_id=id).first()
    file_data = {
        'name': '',
        'size': '',
        'type': 'application/vnd.rar'
    }
    field = dict()
    aimag_name = ''
    aimag_geom = []
    shape_geometries = ShapeGeom.objects.filter(shape__files_id=id)
    features, geom_type = get_feature(shape_geometries)
    qs = RequestForm.objects.filter(file_id=id)
    qs = qs.first()
    geo_id = qs.file.geo_id
    mdata_qs = MDatas.objects.filter(geo_id=geo_id)
    emp_fields = _get_employees(geo_id)
    if mdata_qs:
        if geo_id != '496':
            property_id = 30101104
            if settings.DEBUG:
                property_id = 23
            mdata_qs = mdata_qs.filter(property_id=property_id).first()
            code_list_id = mdata_qs.code_list_id
            code_list_data = LCodeLists.objects.filter(code_list_id=code_list_id).first()
            aimag_name = code_list_data.code_list_name

        else:
            mdata_qs = mdata_qs.first()
            aimag_name = 'Монгол улс'

        aimag_geom = get_geom(geo_id, 'MultiPolygon')

        if aimag_geom:
            aimag_geom = aimag_geom.json

    file_data = {
        'type': 'application/vnd.rar'
    }

    file_qs = qs.file.file_path
    file_data['name'] = file_qs.name or ''
    file_data['size'] = file_qs.size or ''

    if qs:
        file_name = str(qs.file.file_path).split('/')[1]
        field['client_org'] = qs.client_org
        field['project_name'] = qs.project_name
        field['object_type'] = qs.object_type
        field['object_quantum'] = qs.object_quantum
        field['investment_status'] = qs.investment_status
        field['file_path'] = file_data
        field['selected_tools'] = json_load(qs.file.tools)
        field['file_name'] = file_name
        field['state'] = qs.file.get_state_display()
        field['kind'] = qs.file.get_kind_display()
        field['desc'] = qs.file.description
        field['geo_id'] = qs.file.geo_id

    return JsonResponse({
        'vector_datas': FeatureCollection(features),
        'form_field': field,
        'emp_fields': emp_fields,
        'aimag_name': aimag_name,
        'aimag_geom': aimag_geom
    })


def _get_employees(geo_id):
    emp_fields = list()
    get_org = Org.objects.filter(level=2, geo_id=geo_id).first()
    position_mergejilten = POSITION_MERGEJILTEN.filter(org=get_org).first()
    get_employees = Employee.objects.filter(org_id=get_org.id, position_id=position_mergejilten.id)
    for emp in get_employees:
        emp_detail = dict()
        get_name = User.objects.filter(pk=emp.user_id).first()
        emp_detail['org_name'] = get_org.name
        emp_detail['first_name'] = get_name.first_name
        emp_detail['mail'] = get_name.email
        emp_detail['user_id'] = get_name.id
        emp_fields.append(emp_detail)
    return emp_fields


def _get_shapes_geoms(shape_geometry):
    geo_datas = []
    geom_type = ''
    shape_geoms = ShapeGeom.objects.filter(shape_id=shape_geometry.id)
    geo_datas, geom_type = get_feature(shape_geoms)

    return geo_datas, geom_type


def str2bool(v):
    return v.lower() in ("yes", "true", "t", "1", "True")


def _make_connection(from_email):
    connection = get_connection(
        username=from_email,
        password=get_config('EMAIL_HOST_PASSWORD'),
        port=get_config('EMAIL_PORT'),
        host=get_config('EMAIL_HOST'),
        use_tls=str2bool(get_config('EMAIL_USE_TLS')),
        use_ssl=False,
        fail_silently=False,
    )
    return connection


@require_GET
@ajax_required
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
def get_file_shapes(request, id):
    list_of_datas = []

    llc_data = LLCRequest.objects.filter(id=id).first()
    shape_geometries = RequestFilesShape.objects.filter(files_id=llc_data.file_id)
    for shape_geometry in shape_geometries:
        geoms, geom_type = _get_shapes_geoms(shape_geometry)

        theme_name = ''
        feature_name = ''
        package_name = ''
        theme_id = shape_geometry.theme_id
        feature_id = shape_geometry.feature_id
        package_id = shape_geometry.package_id

        if theme_id:
            theme = LThemes.objects.filter(theme_id=theme_id).first()
            theme_name = theme.theme_name

        if package_id:
            package = LPackages.objects.filter(package_id=package_id).first()
            package_name = package.package_name

        if feature_id:
            feature = LFeatures.objects.filter(feature_id=feature_id).first()
            feature_name = feature.feature_name

        list_of_datas.append({
            'id': shape_geometry.id,
            'geom_type': geom_type,
            'theme': {'id': theme_id, 'name': theme_name},
            'feature': {'id': feature_id, 'name': feature_name},
            'package': {'id': package_id, 'name': package_name},
            'icon_state': True,
            'features': geoms,
            'order_no': shape_geometry.order_no,
            'order_at': datetime_to_string (shape_geometry.order_at) if shape_geometry.order_at else '',
            "state": utils.get_value_from_types(RequestFilesShape.STATE_CHOICES, shape_geometry.state),
            "kind": utils.get_value_from_types(RequestFilesShape.KIND_CHOICES, shape_geometry.kind),
            "description": shape_geometry.description,
        })

    return JsonResponse({
        'list_of_datas': list_of_datas,
    })


def _send_to_information_email (email):

    host_name = get_config('EMAIL_HOST_NAME')
    subject = 'Хүсэлт'
    text = 'Дараах холбоос дээр дарж хүсэлтийг шалгана уу!'
    if host_name == 'localhost:8000':
        msg = '{text} http://{host_name}/gov/llc-request/'.format(text=text, host_name=host_name)
    else:
        msg = '{text} https://{host_name}/gov/llc-request/'.format(text=text, host_name=host_name)

    from_email = get_config('EMAIL_HOST_USER')
    to_email = [email]
    send_mail(subject, msg, from_email, to_email, connection=_make_connection(from_email))

    return True


@require_POST
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
@ajax_required
def send_request(request, payload, content, id):
    user_id = payload.get('mergejilten')
    qs = RequestFiles.objects.filter(pk=id).first()
    org_obj = qs.geo_id
    employee = Employee.objects.filter(org__geo_id=org_obj, user_id=user_id).first()
    email = employee.user.email

    if employee:
        request_files = LLCRequest.objects.filter(file_id=id).first()
        request_data = {}
        request_data['state'] = LLCRequest.STATE_NEW
        request_data['kind'] = LLCRequest.KIND_PENDING

        LLCRequest.objects.update_or_create(
            file_id=id,
            defaults=request_data
        )

        success_mail = _send_to_information_email(email)

        if success_mail:
            qs.state = RequestFiles.STATE_SENT
            qs.kind = RequestFiles.KIND_PENDING
            qs.save()

            shape_of_files = RequestFilesShape.objects.filter(files=qs)
            shape_of_files = shape_of_files.exclude(state=RequestFilesShape.STATE_SOLVED)
            for shape_of_file in shape_of_files:
                shape_of_file.state = RequestFilesShape.STATE_NEW
                shape_of_file.kind = RequestFilesShape.KIND_PENDING
                shape_of_file.save()

            return JsonResponse({
                'success': True,
                'info': 'Амжилттай илгээгдлээ.'
            })

    else :
        return JsonResponse({
            'success': False,
            'info': 'Хариуцсан мэргэжилтэн байхгүй байна. Системийн админд хандана уу !!!'

        })


@require_GET
@ajax_required
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
def remove_request(request, id):

    initial_query = RequestFiles.objects.filter(pk=id).first()
    shapes = RequestFilesShape.objects.filter(files=initial_query.id)
    form = RequestForm.objects.filter(file=initial_query.id)
    lvl2_request = LLCRequest.objects.filter(file=initial_query)

    if initial_query:
        for shape in shapes:
            geom = ShapeGeom.objects.filter(shape=shape)
            if geom:
                geom.delete()
            shape.delete()

        if form:
            form.delete()

        if lvl2_request:
            requet_files = list(lvl2_request.values_list('id', flat=True))
            change_requests = ChangeRequest.objects.filter(llc_request_id__in=requet_files)
            change_requests.delete()
            lvl2_request.delete()

        initial_query.delete()
        _delete_prev_files(initial_query)

        return JsonResponse({
            'success': True,
            'info': "Амжилттай устгалаа"
        })

    return JsonResponse({
        'success': False,
        'info': "Устгахад алдаа гарлаа"
    })


def _delete_prev_files(file):
    main_folder = 'llc-request-files'
    file_path = file.file_path
    delete_folder = str(file_path).split("/")[1]
    delete_folder = os.path.join(settings.MEDIA_ROOT, main_folder, delete_folder)
    utils.remove_folder(delete_folder)


@require_GET
@ajax_required
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
def get_search_field(request):
    search_field = dict()
    get_state = RequestFiles.STATE_CHOICES
    get_kind = RequestFiles.KIND_CHOICES
    search_field['state'] = get_state
    search_field['kind'] = get_kind

    return JsonResponse({
        'success': True,
        'search_field': search_field,
    })


@require_GET
@ajax_required
@login_required(login_url='/secure/login/')
@llc_required(lambda u: u)
def get_count(request, content):
    company_name = content.get('company_name')
    states = [RequestFiles.STATE_NEW, RequestFiles.STATE_SENT]
    request_count = RequestFiles.objects.filter(state__in=states, name__exact=company_name).count()
    return JsonResponse({
        'success': True,
        'request_count': request_count,
    })
