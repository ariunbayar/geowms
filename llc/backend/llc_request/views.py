
import rarfile
from django.db import connections
from geojson import FeatureCollection, Feature
from main.decorators import ajax_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from llc.backend.llc_request.models import (
    RequestFiles,
    ShapeGeom,
    RequestFilesShape,
    RequestForm,
)

from backend.org.models import Org
from backend.inspire.models import MGeoDatas, MDatas, LCodeLists

from main.components import Datatable
from main.utils import (
    json_dumps,
    json_load,
    get_sql_execute,
    slugifyWord,
    get_geom
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
    uploaded_file = request.FILES['files']
    project_name = request.POST.get('project_name')
    object_type = request.POST.get('object_type')
    object_count = request.POST.get('object_count')
    hurungu_oruulalt = request.POST.get('hurungu_oruulalt')
    zahialagch = request.POST.get('zahialagch')
    selected_tools = request.POST.get('selected_tools') or []
    if selected_tools:
        rsp = {
            'success': False,
            'info': 'Ашигласан багажны мэдээлэл хоосон байна !!!'
        }

        selected_tools = json_load(selected_tools)
        selected_tools = selected_tools['selected_tools']

    with rarfile.RarFile(uploaded_file, 'r') as zip_ref:
        file_datas = zip_ref.infolist()[0]
        org_data = _get_leve_2_geo_id(file_datas, zip_ref)
        if not org_data:

            return JsonResponse({
                    'success': False,
                    'info': 'Хамрах хүрээний байгууллага олдсонгүй. Системийн админд хандана уу !!!'
            })

        request_file = RequestFiles.objects.create(
            name='Төслийн нэр байна',
            kind=2,
            state=1,
            geo_id=org_data.geo_id if org_data else '',
            file_path=uploaded_file,
            tools=json_dumps(selected_tools)
        )

        RequestForm.objects.create(
            client_org=zahialagch,
            project_name=project_name,
            object_type=object_type,
            object_quantum=object_count,
            investment_status=hurungu_oruulalt,
            file=request_file
        )

        _create_shape_files(org_data, request_file, zip_ref)

    rsp = {
        'success': True,
        'info': 'Амжилттай хадгаллаа'
    }
    return JsonResponse(rsp)


def _get_feature(shape_geometries):
    features = []
    geom_type = ''
    for shape_geometry in shape_geometries:

        single_geom = json_load(shape_geometry.geom_json)
        geom_type = single_geom.get('type')
        feature = {
            "type":"Feature",
            'geometry': single_geom,
            'id': shape_geometry.id,
            'properties': json_load(shape_geometry.form_json)
        }
        features.append(feature)
    return features, geom_type


@require_GET
@ajax_required
def get_all_geo_json(request):
    features = []

    shape_geometries = ShapeGeom.objects.all()
    features, geom_type = _get_feature(shape_geometries)
    return JsonResponse({
        'geo_json_datas': FeatureCollection(features)
    })


@require_GET
@ajax_required
def get_request_data(request, id):
    features = []
    field = dict()
    aimag_name = ''
    aimag_geom = []
    shape_geometries = ShapeGeom.objects.filter(shape__files_id=id)
    features, geom_type = _get_feature(shape_geometries)

    qs = RequestForm.objects.filter(file_id=id)
    field = [item for item in qs.values()]
    selected_tools = qs.first().file.tools
    geo_id = qs.first().file.geo_id

    mdata_qs = MDatas.objects.filter(geo_id=geo_id, property_id=23).first()
    if mdata_qs:
        code_list_id = mdata_qs.code_list_id
        code_list_data = LCodeLists.objects.filter(code_list_id=code_list_id).first()
        aimag_name = code_list_data.code_list_name

        aimag_geom = get_geom(geo_id, 'MultiPolygon')
        if aimag_geom:
            aimag_geom = aimag_geom.json

    if qs:
        field = [item for item in qs.values()]

    return JsonResponse({
        'vector_datas': FeatureCollection(features),
        'form_field': field[0],
        'selected_tools': json_load(selected_tools),
        'aimag_name': aimag_name,
        'aimag_geom': aimag_geom
    })

def _get_shapes_geoms(shape_geometry):
    geo_datas = []
    geom_type = ''
    shape_geoms = ShapeGeom.objects.filter(shape_id=shape_geometry.id)
    geo_datas, geom_type = _get_feature(shape_geoms)

    return geo_datas, geom_type


@require_GET
@ajax_required
def get_file_shapes(request, id):
    list_of_datas = []
    shape_geometries = RequestFilesShape.objects.filter(files_id=id)
    for shape_geometry in shape_geometries:
        geoms, geom_type = _get_shapes_geoms(shape_geometry)
        list_of_datas.append({
            'id': shape_geometry.id,
            'geom_type': geom_type,
            'theme': shape_geometry.theme_id,
            'feature': shape_geometry.feature_id,
            'package': shape_geometry.package_id,
            'features': FeatureCollection(geoms)
        })

    return JsonResponse({
        'list_of_datas': list_of_datas,
    })
