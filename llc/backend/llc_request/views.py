
import os
import rarfile
from django.conf import settings
from django.db import connections
from geojson import FeatureCollection
from main.decorators import ajax_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.apps import apps
from datetime import timedelta, datetime
from django.core.mail import send_mail, get_connection

from llc.backend.llc_request.models import (
    RequestFiles,
    ShapeGeom,
    RequestFilesShape,
    RequestForm,
)
from backend.token.utils import TokenGeneratorUserValidationEmail
from backend.org.models import DefaultPosition, Employee, Org
from geoportal_app.models import User

from main.components import Datatable
from main.utils import (
    json_dumps,
    json_load,
    get_sql_execute,
    slugifyWord,
    send_email,
    get_config
)


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
        оруулах_талбарууд = ['id', 'name', 'kind', 'state',  'created_at', 'updated_at', 'file_path']
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


def _get_leve_2_geo_id(file_data, zip_ref):
    org_datas = Org.objects.filter(level=2)
    cursor = connections['default'].cursor()
    data_of_range = []

    with zip_ref.open(file_data, "r") as fo:
        json_content = json_load(fo)
        for i in json_content:
            if isinstance(i, bytes):
                contents = i.decode()
            else:
                contents = i

            contents = contents.replace("\'", "\"")
            contents = json_load(contents)
            features = contents.get('features')

            for org_data in org_datas:
                for feature in features:
                    geometry = feature.get('geometry')
                    geometry = str(geometry).replace("\'", "\"")
                    sql = '''
                        SELECT ST_AsText(st_force2d(ST_GeomFromGeoJSON('{geo_json}'))) As wkt
                    '''.format(geo_json=geometry)
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


def _create_shape_files(org_data, request_file, zip_ref):
    file_datas = zip_ref.infolist()
    for file_data in file_datas:
        with zip_ref.open(file_data, "r") as fo:
            json_content = json_load(fo)
            for i in json_content:
                if isinstance(i, bytes):
                    contents = i.decode()
                else:
                    contents = i

                contents = contents.replace("\'", "\"")
                contents = json_load(contents)
                features = contents.get('features')

                requets_shape = RequestFilesShape.objects.create(
                    files=request_file,
                    org=org_data
                )

                for feature in features:
                    geometry = feature.get('geometry')
                    properties = feature.get('properties')
                    ShapeGeom.objects.create(
                        shape=requets_shape,
                        geom_json=json_dumps(geometry),
                        form_json=json_dumps(properties)
                    )


@require_POST
@ajax_required
def save_request(request):
    id = request.POST.get('id') or None
    uploaded_file = request.FILES['files']
    project_name = request.POST.get('project_name')
    object_type = request.POST.get('object_type')
    object_count = request.POST.get('object_count')
    hurungu_oruulalt = request.POST.get('hurungu_oruulalt')
    zahialagch = request.POST.get('zahialagch')
    selected_tools = request.POST.get('selected_tools') or []

    if id:
        id = json_load(id)
        id = id.get('id')

    if not selected_tools:
        return JsonResponse({
            'success': False,
            'info': 'Ашигласан багажны мэдээлэл хоосон байна !!!'
        })

    selected_tools = json_load(selected_tools)
    selected_tools = selected_tools['selected_tools']
    check_file_name = 'llc-request-files/' + str(uploaded_file)
    check_data_of_file = RequestFiles.objects.filter(file_path=check_file_name).first()
    if check_data_of_file and not id:
        return JsonResponse({
            'success': False,
            'info': 'Файл-ын нэр давхцаж байна !!!.'
        })

    if not check_data_of_file or not id:
        with rarfile.RarFile(uploaded_file, 'r') as zip_ref:
            file_datas = zip_ref.infolist()[0]

        org_data = _get_leve_2_geo_id(file_datas, zip_ref)
        if not org_data:
            return JsonResponse({
                    'success': False,
                    'info': 'Хамрах хүрээний байгууллага олдсонгүй. Системийн админд хандана уу !!!'
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

            request_file.tools=json_dumps(selected_tools)
            request_file.save()

        else:
            request_file = RequestFiles.objects.create(
                name=project_name,
                kind=2,
                state=1,
                geo_id=org_data.geo_id if org_data else '',
                file_path=uploaded_file,
                tools=json_dumps(selected_tools)
            )
            id = request_file.id
        _create_shape_files(org_data, request_file, zip_ref)

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


def _get_feature(shape_geometries):
    features = []
    for shape_geometry in shape_geometries:

        single_geom = json_load(shape_geometry.geom_json)
        feature = {
            "type":"Feature",
            'geometry': single_geom,
            'id': shape_geometry.id,
            'properties': json_load(shape_geometry.form_json)
        }
        features.append(feature)
    return features


@require_GET
@ajax_required
def get_all_geo_json(request):
    features = []

    shape_geometries = ShapeGeom.objects.all()
    features = _get_feature(shape_geometries)
    return JsonResponse({
        'geo_json_datas': FeatureCollection(features)
    })


@require_GET
@ajax_required
def get_request_data(request, id):
    features = []
    field = {}
    qs = RequestForm.objects.filter(file_id=id).first()
    shape_geometries = ShapeGeom.objects.filter(shape__files_id=id)
    features = _get_feature(shape_geometries)

    file_data = {
        'name': '',
        'size': '',
        'type': 'application/vnd.rar'
    }

    file_qs = qs.file.file_path
    file_data['name'] = file_qs.name
    file_data['size'] = file_qs.size
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
        field['state'] = qs.file.state

    return JsonResponse({
        'vector_datas': FeatureCollection(features),
        'form_field': field
    })


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
        msg = '{text} http://{host_name}/gov/org-request/'.format(text=text, token=token, host_name=host_name)
    else:
        msg = '{text} https://{host_name}/gov/org-request/'.format(text=text, token=token, host_name=host_name)

    from_email = get_config('EMAIL_HOST_USER')
    to_email = [user.email]
    send_mail(subject, msg, from_email, to_email, connection=_make_connection(from_email))

    return True


@require_GET
@ajax_required
def send_request(request, id):

    qs = RequestFiles.objects.filter(pk=id).first()
    org_obj = qs.geo_id
    employee = Employee.objects.filter(org__geo_id=org_obj, position_id=13).first()
    if employee:
        success_mail = _send_to_information_email(employee.user_id)

        if success_mail:
            qs.state = 2
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
    for shape in shapes:
        geom = ShapeGeom.objects.filter(shape=shape)
        if geom:
            geom.delete()
        shape.delete()

    if form:
        form.delete()
        initial_query.delete()

    return JsonResponse({
        'success': True
    })
