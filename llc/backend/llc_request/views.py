import os
import zipfile
import glob
from datetime import timedelta
import datetime

from django.db.backends.utils import logger
from django.conf import settings
from django.db import connections
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.apps import apps
from django.contrib.gis.gdal import DataSource
from django.core.mail import send_mail, get_connection

from llc.backend.llc_request.models import (
    RequestFiles,
    ShapeGeom,
    RequestFilesShape,
    RequestForm,
    LLCRequest
)
from backend.token.utils import TokenGeneratorUserValidationEmail
from backend.org.models import Employee, Org
from backend.org.models import Org
from backend.inspire.models import (
    MDatas,
    LCodeLists,
    LThemes,
    LFeatures,
    LPackages
)
from geoportal_app.models import User

from geojson import FeatureCollection

from main.components import Datatable
from main.decorators import ajax_required
from main.utils import (
    json_dumps,
    json_load,
    get_sql_execute,
    send_email,
    get_config,
    get_geom,
    datetime_to_string,
    get_feature
)
from main import utils


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
@ajax_required
def llc_request_list(request, payload):
    qs = RequestFiles.objects.all()
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
        items, total_page = datatable.get()

        rsp = {
            'items': items,
            'page': payload.get('page'),
            'total_page': total_page
        }
    else:
        rsp = {
            'items': [],
            'page': payload.get('page'),
            'total_page': 1
        }

    return JsonResponse(rsp)


def _get_leve_2_geo_id(layer):
    org_datas = Org.objects.filter(level=2, employee__position=13)
    cursor = connections['default'].cursor()
    data_of_range = []
    for feature in layer:
        geo_json = feature.geom.json
        break
    if geo_json:
        for org_data in org_datas:
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
                geo_id=org_data.geo_id
            )
            check_geom = get_sql_execute(sql_2, cursor, 'all')[0].get('check_geom')
            if check_geom:
                data_of_range = org_data
                break
    return data_of_range


def _create_shape_files(org_data, request_file, extract_path, datasource_exts):
    for name in glob.glob(os.path.join(extract_path, '*')):
        if [item for item in datasource_exts if item in name]:
            ds = DataSource(name)
            request_shape = RequestFilesShape.objects.create(
                files=request_file,
                org=org_data
            )
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
                        shape=request_shape,
                        geom_json=json_dumps(json_content),
                        form_json=json_dumps(properties)
                    )
            utils.remove_file(name)
        elif '.zip' not in name:
            utils.remove_file(name)


def _validation_form(request_datas):

    is_agreed = True

    if not request_datas.get('zahialagch'): is_agreed = False
    if not request_datas.get('project_name'): is_agreed = False
    if not request_datas.get('object_type'): is_agreed = False
    if not request_datas.get('object_count'): is_agreed = False
    if not request_datas.get('hurungu_oruulalt'): is_agreed = False

    return is_agreed


def _tools_validation(get_tools):
    saved_ids = list()

    if not get_tools:
        response = 'Ашигласан багажны мэдээлэл хоосон байна !!!'
        return response

    for tool in get_tools:
        if tool['bagaj_dugaar'] in saved_ids:
            response = 'Таны сонгосон багаж давхцаж байна.!!!'
            return response
        saved_ids.append(tool['bagaj_dugaar'])


@require_POST
@ajax_required
def save_request(request):
    request_datas = request.POST
    id = request.POST.get('id') or None
    uploaded_file = request.FILES['files']
    project_name = request.POST.get('project_name')
    object_type = request.POST.get('object_type')
    object_count = request.POST.get('object_count')
    hurungu_oruulalt = request.POST.get('hurungu_oruulalt')
    zahialagch = request.POST.get('zahialagch')
    selected_tools = request.POST.get('selected_tools') or []
    is_agreed = _validation_form(request_datas)
    main_path = 'llc-request-files'
    file_name = uploaded_file.name
    file_not_ext_name = utils.get_file_name(file_name)
    file_path = os.path.join(main_path, file_not_ext_name)

    org_data = ''

    utils.save_file_to_storage(uploaded_file, file_path, file_name)
    extract_path = os.path.join(settings.MEDIA_ROOT, main_path)
    selected_tools = json_load(selected_tools)
    get_tools = selected_tools['selected_tools']

    if not uploaded_file.name.endswith('.zip'):
        return JsonResponse({
            'success': False,
            'info': 'Заавал zip файл оруулах ёстой.!!!'
        })


    if not is_agreed:

        return JsonResponse({
            'success': False,
            'info': 'Форм дутуу бөглөгдсөн байна.!!!'
        })

    if id:
        id = json_load(id)
        id = id.get('id')

    tool_validation = _tools_validation(get_tools)
    if tool_validation:

        return JsonResponse({
            'success': False,
            'info': tool_validation
        })

    check_file_name = os.path.join(main_path, file_not_ext_name, str(uploaded_file))
    check_data_of_file = RequestFiles.objects.filter(file_path=check_file_name).first()

    if check_data_of_file and not id:
        return JsonResponse({
            'success': False,
            'info': 'Файл-ын нэр давхцаж байна !!!.'
        })

    if not check_data_of_file or not id:
        extract_path = os.path.join(extract_path, file_not_ext_name)
        file_path = os.path.join(settings.MEDIA_ROOT, file_path, file_name)
        utils.unzip(file_path, extract_path)
        utils.remove_file(file_path)

        datasource_exts = ['.gml', '.geojson']
        for name in glob.glob(os.path.join(extract_path, '*')):
            for ext in datasource_exts:
                if ext in name:
                    ds = DataSource(name)
                    for layer in ds:
                        if len(layer) >= 1:
                            org_data = _get_leve_2_geo_id(layer)
                            if not org_data:
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

        if id:
            request_file = RequestFiles.objects.filter(pk=id).first()
            get_shapes = RequestFilesShape.objects.filter(files=request_file)
            if get_shapes:
                for shape in get_shapes:
                    geoms = ShapeGeom.objects.filter(shape=shape)
                    geoms.delete()
                get_shapes.delete()

            if not check_data_of_file:
                request_file.geo_id=org_data.geo_id if org_data else ''
                request_file.file_path=uploaded_file

            request_file.tools=json_dumps(get_tools)
            request_file.save()

        else:
            request_file = RequestFiles.objects.create(
                name='UTILITY SOLUTION',
                kind=RequestFiles.KIND_NEW,
                state=RequestFiles.STATE_NEW,
                geo_id=org_data.geo_id if org_data else '',
                file_path=uploaded_file,
                tools=json_dumps(get_tools)
            )
            id = request_file.id
        _create_shape_files(org_data, request_file, extract_path, datasource_exts)

    form_data = RequestForm.objects.filter(file_id=id).first()
    if form_data:
        form_data.client_org = zahialagch
        form_data.project_name = project_name
        form_data.object_type = object_type
        form_data.object_quantum = object_count
        form_data.investment_status = hurungu_oruulalt
        form_data.save()

    else:
        RequestForm.objects.create(
            client_org=zahialagch,
            project_name=project_name,
            object_type=object_type,
            object_quantum=object_count,
            investment_status=hurungu_oruulalt,
            file_id=id
        )

    rsp = {
        'success': True,
        'info': 'Амжилттай хадгаллаа'
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def get_all_geo_json(request):
    features = []

    shape_geometries = ShapeGeom.objects.all()
    features, geom_type = get_feature(shape_geometries)
    return JsonResponse({
        'geo_json_datas': FeatureCollection(features)
    })


@require_GET
@ajax_required
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

    if mdata_qs:
        if geo_id != '496':
            mdata_qs = mdata_qs.filter(property_id=23).first()
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

    return JsonResponse({
        'vector_datas': FeatureCollection(features),
        'form_field': field,
        'aimag_name': aimag_name,
        'aimag_geom': aimag_geom
    })


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


def _send_to_information_email (user_id):

    user = get_object_or_404(User, pk=user_id)

    if not user.email:
        return False

    token = TokenGeneratorUserValidationEmail().get()

    UserValidationEmail = apps.get_model('geoportal_app', 'UserValidationEmail')
    UserValidationEmail.objects.create(
        user=user,
        token=token,
        valid_before=timezone.now() + timedelta(days=90)
    )

    host_name = get_config('EMAIL_HOST_NAME')
    subject = 'Хүсэлт'
    text = 'Дараах холбоос дээр дарж хүсэлтийг шалгана уу!'
    if host_name == 'localhost:8000':
        msg = '{text} http://{host_name}/gov/llc-request/'.format(text=text, token=token, host_name=host_name)
    else:
        msg = '{text} https://{host_name}/gov/llc-request/'.format(text=text, token=token, host_name=host_name)

    from_email = get_config('EMAIL_HOST_USER')
    to_email = [user.email]
    send_mail(subject, msg, from_email, to_email, connection=_make_connection(from_email))

    return True


@require_GET
@ajax_required
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
            'order_at': datetime_to_string (shape_geometry.order_at) if shape_geometry.order_at else ''

        })

    return JsonResponse({
        'list_of_datas': list_of_datas,
    })


@require_GET
@ajax_required
def send_request(request, id):

    qs = RequestFiles.objects.filter(pk=id).first()
    org_obj = qs.geo_id
    employee = Employee.objects.filter(org__geo_id=org_obj, position_id=13).first()
    if employee:
        LLCRequest.objects.create(
            file_id=id,
            state=LLCRequest.STATE_NEW,
            kind=LLCRequest.KIND_NEW,
        )

        success_mail = _send_to_information_email(employee.user_id)

        if success_mail:
            qs.state = RequestFiles.STATE_SENT
            qs.kind = RequestFiles.KIND_PENDING
            qs.save()

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
            lvl2_request.delete()

        initial_query.delete()

        return JsonResponse({
            'success': True,
            'info': "Амжилттай устгалаа"
        })

    return JsonResponse({
        'success': False,
        'info': "Устгахад алдаа гарлаа"
    })


@require_GET
@ajax_required
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
