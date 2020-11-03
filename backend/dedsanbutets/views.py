import os
import datetime
import uuid
import glob
from django.db import connections
from django.db.utils import InternalError

from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse, Http404

from .models import ViewNames, ViewProperties
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBoundary, LDataTypeConfigs, LFeatureConfigs, LDataTypes, LProperties, LValueTypes, LCodeListConfigs, LCodeLists, MGeoDatas, MDatasBuilding
from django.forms.models import model_to_dict

from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required

from django.core.management import call_command
from django.core.files.uploadedfile import UploadedFile
from django.core.files.storage import FileSystemStorage

from django.contrib.gis.geos import Polygon, MultiPolygon, MultiPoint, MultiLineString
from django.contrib.gis.geos import WKBWriter, WKBReader
from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import fromstr
from django.contrib.gis.gdal import OGRGeometry
from django.contrib.gis.geos.error import GEOSException
from django.contrib.gis.gdal.error import GDALException
from django.contrib.gis.geos.collections import GeometryCollection
from django.contrib.auth.decorators import user_passes_test

from main.utils import (
    dict_fetchall
)

# Create your views here.
def _get_package(theme_id):
    package_data = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': list(LFeatures.objects.filter(package_id=package.package_id).extra(select={'id': 'feature_id', 'code': 'feature_code', 'name': 'feature_name'}).values('id', 'code', 'name'))
            })
    return package_data


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    for themes in LThemes.objects.all():
        data.append({
                'id': themes.theme_id,
                'code': themes.theme_code,
                'name': themes.theme_name,
                'package': _get_package(themes.theme_id),
            })
    rsp = {
        'success': True,
        'data': data,
    }
    return JsonResponse(rsp)


def _lfeatureconfig(feature_id):
    feature_configs_name = []
    datatypes = []
    f_configs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    for f_config in f_configs:
        data_type_id = f_config.data_type_id
        connect_feature_id = f_config.connect_feature_id
        if data_type_id is not None:
            feature_configs_name.append({
                'data_type_id': data_type_id,
                'feature_config_id': f_config.feature_config_id,
                'feature_id': f_config.feature_id,
                'data_type_display_name': f_config.data_type_display_name,
                'data_types': _datatypes(data_type_id)
            })
        else:
            connect_features = LFeatureConfigs.objects.filter(feature_id=connect_feature_id)
            for connect_feature in connect_features:
                connected_feature_id = connect_feature.connect_feature_id
                fc_data_type_id = connect_feature.data_type_id
                if fc_data_type_id is not None:
                    datatypes = _datatypes(fc_data_type_id)
                if connect_feature.feature_id == connect_feature_id:
                    if connected_feature_id is None:
                        feature_configs_name.append({
                            'data_type_id': fc_data_type_id,
                            'feature_config_id': connect_feature.feature_config_id,
                            'feature_id': connect_feature.feature_id,
                            'data_type_display_name': connect_feature.data_type_display_name,
                            'data_types': datatypes
                        })
        if data_type_id is None and connect_feature_id is None:
            feature_configs_name.append({
                'data_type_id': data_type_id,
                'feature_config_id': f_config.feature_config_id,
                'feature_id': f_config.feature_id,
                'data_type_display_name': f_config.data_type_display_name,
                'data_types': _datatypes(data_type_id)
            })
    return feature_configs_name


def _datatypes(data_type_id):
    data_type_names = []
    data_types = LDataTypes.objects.filter(data_type_id=data_type_id)
    for data_type in data_types:
        if data_type:
            data_type_names.append({
                'data_type_id': data_type.data_type_id,
                'data_type_name': data_type.data_type_name,
                'data_type_code': data_type.data_type_code,
                'data_type_definition': data_type.data_type_definition,
                'is_active': data_type.is_active,
                'is_read_only': data_type.is_read_only,
                'data_type_configs': _data_type_configs(data_type.data_type_id)
            })
    return data_type_names


def _data_type_configs(data_type_id):
    property_names = []
    data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=data_type_id)
    if data_type_configs:
        for data_type_config in data_type_configs:
            property_id = data_type_config.property_id
            properties = LProperties.objects.filter(property_id=property_id)
            if properties:
                for prop in properties:
                    property_names.append({
                        'data_type_config_id': data_type_config.data_type_config_id,
                        'data_type_id': data_type_config.data_type_id,
                        'property_id': property_id,
                        'property_code': prop.property_code,
                        'property_name': prop.property_name,
                        'property_definition': prop.property_definition,
                        'value_type_id': prop.value_type_id,
                        'value_types': _value_types(prop.value_type_id, property_id),
                        'is_read_only': prop.is_read_only,
                    })
    return property_names


def _value_types(value_type_id, property_id):
    value_type_names = []
    codelists = []
    value_types = LValueTypes.objects.filter(value_type_id=value_type_id)
    if value_types:
        for value_type in value_types:
            if value_type.value_type_id == 'single-select':
                codelists = _code_list(property_id)
            value_type_names.append({
                'value_type_id': value_type.value_type_id,
                'value_type_name': value_type.value_type_name,
                'code_lists': codelists,
            })
    return value_type_names


def _code_list(property_id):
    code_list_values = []
    code_list_configs = LCodeListConfigs.objects.filter(property_id=property_id)
    if code_list_configs:
        for code_list_config in code_list_configs:
            property_id = code_list_config.property_id
            to_property_id = code_list_config.to_property_id
            if property_id == to_property_id:
                to_property_id += 1
            x_range = range(property_id, to_property_id)
            for property_id_up in x_range:
                code_lists = LCodeLists.objects.filter(property_id=property_id_up)
                if code_lists:
                    for code_list in code_lists:
                        code_list_values.append({
                            'code_list_id': code_list.code_list_id,
                            'property_id': code_list.property_id,
                            'code_list_code': code_list.code_list_code,
                            'code_list_name': code_list.code_list_name,
                            'code_list_definition': code_list.code_list_definition,
                        })
    return code_list_values


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def Property(request, code):
    feature_lists = []
    features = LFeatures.objects.filter(feature_code=code)
    for feature in features:
        feature_lists.append({
            'feature_id': feature.feature_id,
            'feature_code': feature.feature_code,
            'feature_name': feature.feature_name,
            'f_configs' : _lfeatureconfig(feature.feature_id)
        })
    if len(feature_lists) > 0:
        check = 'байгаа'
    else:
        check = 'байхгүй'
    rsp = {
        'success': True,
        'feature_lists': feature_lists,
        'check': check,
    }
    return JsonResponse(rsp)



@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def Edit_name(request, payload):
    id = payload.get('id')
    property_name = payload.get('name')
    try:
        properties = LProperties.objects.filter(property_id=id)
        properties.update(
            property_name=property_name
        )
        rsp = {
            'success': True,
            'info': 'Амжилттай хадгаллаа'
        }
    except Exception:
        sp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def getFields(request, payload):
    model_name = payload.get('name')
    savename = payload.get('name')
    id = payload.get('id')
    edit_name = payload.get('edit_name')
    try:
        model_name = getModel(model_name)
        fields = []
        for i in model_name._meta.get_fields():
            name = i.name
            type_name = i.get_internal_type()
            if not i.name == 'created_on' and not i.name == 'created_by' and not i.name == 'modified_on' and not i.name == 'modified_by' and not type_name == 'AutoField':
                if type_name == "CharField":
                    type_name = 'text'
                if type_name == "IntegerField" or type_name == "BigIntegerField":
                    type_name = 'number'
                if type_name == "BooleanField":
                    type_name = 'radio'
                if edit_name == '':
                    if 'id' in i.name and not 'connect' in i.name:
                        if '_' in savename:
                            if savename == 'data_type_config' and i.name == 'data_type_id':
                                fields.append({
                                    'field_name': i.name,
                                    'field_type': type_name,
                                    'data': id
                                })
                            else:
                                out = savename.split('_')
                                if not str(out[0]) in i.name:
                                    fields.append({
                                        'field_name': i.name,
                                        'field_type': type_name,
                                        'data': id
                                    })
                                else:
                                    fields.append({
                                        'field_name': i.name,
                                        'field_type': type_name,
                                        'data': ''
                                    })
                        else:
                            fields.append({
                                'field_name': i.name,
                                'field_type': type_name,
                                'data': id
                            })
                    else:
                        fields.append({
                            'field_name': i.name,
                            'field_type': type_name,
                            'data': ''
                        })
                if edit_name != '':
                    datas = model_name.objects.filter(pk=id)
                    for data in datas:
                        data_obj = model_to_dict(data)
                        dat = data_obj[i.name]
                        if dat == True and not 1:
                            dat = 'true'
                        if dat == False and not 0:
                            dat = 'false'
                        else:
                            dat = dat
                        fields.append({
                            'field_name': i.name,
                            'field_type': type_name,
                            'data': dat if dat else ""
                        })
        rsp = {
            'success': True,
            'fields': fields
        }
    except Exception as e:
        rsp = {
            'success': False,
            'fields': 'Алдаа гарсан байна' + str(e)
        }
    return JsonResponse(rsp)


def get_rows(fid):
    cursor = connections['default'].cursor()
    sql = """
        select datas.property_id, l.property_code
        from l_properties l
        inner join (select l_feature_configs.feature_id, l_feature_configs.data_type_id,l_data_type_configs.property_id
        from l_feature_configs
        inner join l_data_type_configs on l_data_type_configs.data_type_id = l_feature_configs.data_type_id
        where l_feature_configs.feature_id = {fid}
        ) datas
        on datas.property_id = l.property_id
    """.format(
        fid=fid
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFields(request, fid):
    fields = get_rows(fid)
    view_name = ViewNames.objects.filter(feature_id=fid).first()
    if not view_name == None:
        id_list = [data.property_id for data in ViewProperties.objects.filter(view=view_name)]
        rsp = {
            'success': True,
            'fields': fields,
            'id_list': id_list
        }
    else:
        rsp = {
            'success': True,
            'fields': fields,
            'id_list': []
        }
    return JsonResponse(rsp)


def _get_model_name(name):

    if name == 'hg':
        return 'm_datas_hydrography'
    elif name == 'au':
        return 'm_datas_boundary'
    elif name =='bu':
        return 'm_datas_building'
    elif name=='gn':
        return 'm_datas_geographical'
    elif name=='cp':
        return 'm_datas_cadastral'


@require_POST
@ajax_required
def propertyFieldsSave(request, payload):
    id_list = payload.get('fields')
    fid = payload.get('fid')
    tid = payload.get('tid')
    theme = LThemes.objects.filter(theme_id=tid).first()
    if not theme:
        rsp = {
            'success': False,
            'info': 'Тухайн хүснэгтийн мэдээлэл алга байна.'
        }
        return JsonResponse(rsp)

    feature = LFeatures.objects.filter(feature_id=fid).first()

    if not feature:
        rsp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
        return JsonResponse(rsp)

    check_name = ViewNames.objects.filter(feature_id=fid).first()
    model_name = _get_model_name(theme.theme_code)
    if not theme:
        rsp = {
            'success': False,
            'info': 'Тухайн хүснэгт алга байна.'
        }
        return JsonResponse(rsp)

    feature = LFeatures.objects.filter(feature_id=fid).first()

    if check_name:
        table_name = check_name.view_name
        removeView(table_name)
        check = createView(id_list, table_name, model_name)
        if check:
            ViewProperties.objects.filter(view=check_name).delete()
            for idx in id_list:
                ViewProperties.objects.create(view=check_name, property_id=idx)


    else:
        table_name = feature.feature_name_eng.split(' ')[0].lower() + '_view'
        check = createView(id_list, table_name, model_name)
        if check:
            new_view = ViewNames.objects.create(view_name=table_name, feature_id=fid)
            for idx in id_list:
                ViewProperties.objects.create(view=new_view, property_id=idx)


    if check:
        rsp = {
            'success': True,
            'info': 'Амжилттай хадгаллаа'

        }
    else:
        rsp = {
            'success': False,
            'info': 'Амжилтгүй хадгаллаа'
        }
    return JsonResponse(rsp)


def getModel(model_name):
    if model_name == 'theme':
        model_name = LThemes
    if model_name == 'package':
        model_name = LPackages
    if model_name == 'feature':
        model_name = LFeatures
    if model_name == 'property':
        model_name = LProperties
    if model_name == 'feature_config':
        model_name = LFeatureConfigs
    if model_name == 'data_type_config':
        model_name = LDataTypeConfigs
    if model_name == 'code_list_config':
        model_name = LCodeListConfigs
    if model_name == 'data_type':
        model_name = LDataTypes
    if model_name == 'value_type':
        model_name = LValueTypes
    if model_name == 'code_list':
        model_name = LCodeLists
    return model_name


@require_POST
@ajax_required
def save(request, payload):
    model_name = payload.get("model_name")
    model_id = payload.get("model_id")
    edit_name = payload.get("edit_name")
    json = payload.get("form_values")
    model_name = getModel(model_name)
    json = json['form_values']
    fields = []
    for i in model_name._meta.get_fields():
        type_name = i.get_internal_type()
        if not i.name == 'created_on' and not i.name == 'created_by' and not i.name == 'modified_on' and not i.name == 'modified_by' and not type_name == 'AutoField':
            if type_name == "CharField":
                type_name = 'text'
            if type_name == "IntegerField" or type_name == "BigIntegerField":
                type_name = 'number'
            if type_name == "BooleanField":
                type_name = 'radio'
            fields.append(i.name)

    check = True
    datas = {}
    for data in json:
        if data['field_name'] in fields:
            if not data['data']:
               data['data'] = None
            if data['field_type'] == 'radio':
                if data['data'] == 'true':
                    datas[data['field_name']] = True
                else:
                    datas[data['field_name']] = False
            # if data['field_type'] == 'order_no':
            #     order_no = len(model_name.objects.all()) + 1
            #     datas[data['field_name']] = order_no
            else:
                datas[data['field_name']] = data['data']
        else:
            check = False
    if check:
        if edit_name == '':
            sain = model_name.objects.create(**datas)
        else:
            sain = model_name.objects.filter(pk=model_id).update(**datas)
        rsp = {
            'success': True,
            'info': 'Амжилттай'
        }
    else:
        rsp = {
            'success': True,
            'info': 'Алдаа гарлаа'
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def Get_Datas(request, name):
    types = []
    model_name = getModel(name)
    datas = model_name.objects.all()
    if name == 'data_type':
        for data in datas:
            types.append({
                'id': data.data_type_id,
                'name': data.data_type_name,
            })
    if name == 'value_type':
        for data in datas:
            types.append({
                'id': data.value_type_id,
                'name': data.value_type_name,
            })
    if name == 'property':
        for data in datas:
            types.append({
                'id': data.property_id,
                'name': data.property_name,
            })
    if name == 'feature':
        for data in datas:
            types.append({
                'id': data.feature_id,
                'name': data.feature_name,
            })
    rsp = {
        'success': True,
        'datas': types
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def remove(request, payload):
    model_name = payload.get('model_name')
    model_id = payload.get('model_id')
    model_name = getModel(model_name)
    try:
        data = model_name.objects.filter(pk=model_id)
        if data:
            data.delete()
            rsp = {
                'success': True,
                'info': 'Амжилттай устгалаа'
            }
        else:
            rsp = {
                'success': False,
                'info': 'Хоосон байна'
            }
    except Exception as e:
        rsp = {
            'success': False,
            'info': 'Алдаа гарсан байна: ' + str(e)
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def erese(request, payload):
    model_name = payload.get('model_name')
    top_id = payload.get('top_id')
    model_id = payload.get('model_id')
    if model_name == 'property':
        field_name = 'property_id'
        model_name = 'data_type_config'
    if model_name == 'data_type':
        field_name = 'data_type_id'
        model_name = 'feature_config'
    model_name = getModel(model_name)
    try:
        savename = payload.get('model_name')
        updateData = {}
        data = model_name.objects.filter(pk=top_id)
        for i in model_name._meta.get_fields():
            if str(field_name) == str(i.name):
                updateData[field_name] = None
        if updateData != {}:
            data.update(**updateData)
            rsp = {
                'success': True,
                'info': 'Амжилттай устгалаа'
            }
        else:
            rsp = {
                'success': False,
                'info': 'Хоосон байна'
            }
    except Exception as e:
        rsp = {
            'success': False,
            'info': 'Алдаа гарсан байна: ' + str(e)
        }
    return JsonResponse(rsp)



def createView(ids, table_name, model_name):
    data = LProperties.objects.filter(property_id__in=ids)
    fields = [row.property_code for row in data]
    try:

        query = '''
            CREATE OR REPLACE VIEW public.{table_name}
                AS
            SELECT d.geo_id, d.geo_data, {columns}, d.feature_id, d.created_on, d.created_by, d.modified_on, d.modified_by
            FROM crosstab('select b.geo_id, b.property_id, b.value_text from {model_name} b where property_id in ({properties}) order by 1,2'::text)
            ct(geo_id character varying(100), {create_columns})
            JOIN m_geo_datas d ON ct.geo_id::text = d.geo_id::text

        '''.format(
                table_name = table_name,
                model_name = model_name,
                columns=', '.join(['ct.{}'.format(f) for f in fields]),
                properties=', '.join(['{}'.format(f) for f in ids]),
                create_columns=', '.join(['{} character varying(100)'.format(f) for f in fields]))
        with connections['default'].cursor() as cursor:
                cursor.execute(query)
        return True

    except Exception:
        return False


def removeView(table_name):
    try:
        query = '''
            drop view {table_name};
        '''.format(table_name = table_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(query)
        return True
    except Exception:
        return False


def geoJsonConvertGeom(geojson):
    with connections['default'].cursor() as cursor:

        sql = """ SELECT ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        return geom
    return None


def _saveToMainData(values, model_name, geo_id):
    keys = ''
    feature_config_id = None
    savename = model_name
    model_name = _MDatasName(model_name)
    if not isinstance(model_name, str):
        if values:
            for j in values:
                for key, value in j.items():
                    if key == 'feature_id':
                        feature_config = LFeatureConfigs.objects.filter(feature_id=value).first()
                        if feature_config:
                            feature_config_id = feature_config.feature_config_id
                        else:
                            feature_config_id = None
                    properties = LProperties.objects.filter(property_code__icontains=key)
                    if properties:
                        for property in properties:
                            datas = {}
                            value_types = LValueTypes.objects.filter(value_type_id=property.value_type_id)
                            if value_types:
                                for value_type in value_types:
                                    val_type = value_type.value_type_id
                                    if val_type != 'boolean':
                                        for i in model_name._meta.get_fields():
                                            if 'value' in i.name:
                                                out = i.name.split('_')
                                                if out[1] == val_type:
                                                    datas[i.name] = value
                                                else:
                                                    datas[i.name] = None
                                            else:
                                                if i.name == 'geo_id':
                                                    datas[i.name] = geo_id
                                                if i.name == 'data_type_id':
                                                    datas[i.name] = 1
                                                if i.name == 'property_id':
                                                    datas[i.name] = property.property_id
                                                if i.name == 'feature_config_id':
                                                    datas[i.name] = feature_config_id
                                                if i.name == 'code_list_id':
                                                    datas[i.name] = None
                                                if i.name == 'created_by':
                                                    datas[i.name] = 1
                                                if i.name == 'modified_by':
                                                    datas[i.name] = 1
                                    else:
                                        rsp = {
                                            'success': False,
                                            'info': "Алдаа гарсан байна: " + val_type + ' буруу байна'
                                        }
                                        return rsp
                                sain = model_name.objects.create(**datas)
                    else:
                        keys += key + ' ,'
            rsp = {
                'success': True,
                'info': 'Амжилттай хадгалалаа',
                'key': 'Буруу орсон ' + keys if keys != '' else 'Бүгд зөв'
            }
        else:
            rsp = {
                'success': False,
                'info': 'Хоосон ирж байна. ' + savename,
            }
    else:
        rsp = {
            'success': False,
            'info': 'Алдаа гарсан байна.' + savename,
        }
    return rsp


def _MDatasName(model_name):
    if model_name == 'Boundary':
        model_name = MDatasBoundary
    if model_name == 'Building':
        model_name = MDatasBuilding
    return model_name


def _deleteFile(file_name, for_delete_name):
    fileList = glob.glob(os.path.join(settings.BASE_DIR, 'geoportal_app', 'datas', file_name+'.*'))
    text = ''
    for filePath in fileList:
        try:
            os.remove(filePath)
        except:
            text = "(Устгах явцад алдаа гарлаа : " + for_delete_name + ')'
    return text


@require_POST
@ajax_required
def FileUploadSaveData(request):
    form = request.FILES.getlist('data')
    file_name = ''
    for_delete_name = ''
    feature_id = 36
    try:
        unique_filename = str(uuid.uuid4())
        for fo in form:
            if '.geojson' in fo.name or '.gml' in fo.name or '.gfs' in fo.name or '.shx' in fo.name or '.shp' in fo.name or '.prj' in fo.name or '.dbf' in fo.name or '.cpg' in fo.name:
                file_name = unique_filename + fo.name
                for_delete_name = fo.name
                fs = FileSystemStorage(
                    location=os.path.join(settings.BASE_DIR, 'geoportal_app', 'datas')
                )
                file = fs.save(file_name, fo)
                fileurl = fs.url(file)
            else:
                file_name = fo.name
        uniq_name = file_name.split('.')[0]
        if '.shx' in file_name or '.shp' in file_name or '.prj' in file_name or '.dbf' in file_name or '.cpg' in file_name:
            file_name = uniq_name + '.shp'
        if '.gml' in file_name or '.gfs' in file_name:
            file_name = uniq_name + '.gml'
        if '.geojson' in file_name:
            file_name = uniq_name + '.geojson'
        path = os.path.join(settings.BASE_DIR, 'geoportal_app', 'datas', file_name)
        ds = DataSource(path)
        if len(ds) <= 0:
            deleted = _deleteFile(uniq_name, for_delete_name)
            rsp = {
                'success': False,
                'info': 'Source олдсонгүй ' + deleted
            }
            return JsonResponse(rsp)
        layer = ds[0]
        for val in layer:
            values = []
            try:
                need_id = MGeoDatas.objects.count()
                for name in layer.fields:
                    field_name = val[name].name # field name
                    if field_name == 'id' or field_name == 'gml_id':
                        geom = ''
                        geom_type = ''
                        g_id = val.get(name)
                        dim = val.geom.coord_dim # dimension
                        geom = val.geom.json # goemetry json
                        # layer_type = str(val.geom.geom_type) #layeriin type
                        srid = GEOSGeometry(geom).srid # geomiin srid
                        if geom:
                            if srid != 4326:
                                geom = GEOSGeometry(geom, srid=4326)
                            if dim == 3:
                                geom_type = GEOSGeometry(geom).geom_type #geom iin type
                                geom = GEOSGeometry(geom).hex
                                geom = geom.decode("utf-8") #binary hurwuuleh
                                geom = GEOSGeometry(geom)
                            if dim == 2:
                                geom = geoJsonConvertGeom(geom)
                                geom =  ''.join(geom) # list iig str luu hurwuulj bgaa ni
                                geom = GEOSGeometry(geom)
                                geom_type = GEOSGeometry(geom).geom_type # field turul
                            if geom_type == 'Point':
                                geom = MultiPoint(geom, srid=4326) # Pointiig MultiPoint bolgoj bna
                            if geom_type == 'LineString':
                                geom = MultiLineString(geom, srid=4326) # LineString MultiLineString bolgoj bna
                            if geom_type == 'Polygon':
                                geom = MultiPolygon(geom, srid=4326) # Polygon MultiPolygon bolgoj bna
                            if geom:
                                id_made = str(need_id) + 'odko' + str(g_id)
                                geo = MGeoDatas.objects.create(
                                    geo_id=id_made,
                                    geo_data=geom,
                                    feature_id=feature_id,
                                    created_by=1,
                                    modified_by=1,
                                )
                        else:
                            deleted = _deleteFile(uniq_name, for_delete_name)
                            rsp = {
                                "success": False,
                                'info': 'geom байхгүй дата' + deleted,
                            }
                            return JsonResponse(rsp)
                    type_name = val[name].type_name
                    type_name = type_name.decode('utf-8') # type ner
                    type_code = val[name].type # type code
                    value = val.get(name) # value ni
                    values.append({
                        field_name: value,
                    })
            except InternalError as e:
                deleted = _deleteFile(uniq_name, for_delete_name)
                rsp = {
                    'success': False,
                    'info': file_name + '-д Алдаа гарсан байна: UTM байгаа тул болохгүй ' + deleted
                }
                return JsonResponse(rsp)
            except GEOSException as e:
                deleted = _deleteFile(uniq_name, for_delete_name)
                rsp = {
                    'success': False,
                    'info': file_name + '-д Алдаа гарсан байна: Geometry утга нь алдаатай байна'
                }
                return JsonResponse(rsp)
            model_name = 'Building'
            saved = _saveToMainData(values, model_name, geo.geo_id)
            if not saved['success']:
                deleted = _deleteFile(uniq_name, for_delete_name)
                rsp = saved
                return JsonResponse(rsp)
            else:
                rsp = saved
    except GDALException as e:
        deleted = _deleteFile(uniq_name, for_delete_name)
        rsp = {
            'success': False,
            'info': file_name + '-д Алдаа гарсан байна: файлд алдаа гарсан тул файлаа шалгана уу'
        }
    return JsonResponse(rsp)