import os
from re import template
from django.conf import settings

from django.db import connections
from django.forms.models import model_to_dict
from django.forms.utils import flatatt
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import user_passes_test
from django.urls import reverse
from django.shortcuts import get_object_or_404

from .models import ViewNames, ViewProperties, FeatureOverlaps
from backend.inspire.models import LThemes
from backend.inspire.models import LPackages
from backend.inspire.models import LFeatures
from backend.inspire.models import LDataTypeConfigs
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LDataTypes
from backend.inspire.models import LProperties
from backend.inspire.models import LValueTypes
from backend.inspire.models import LCodeListConfigs
from backend.inspire.models import LCodeLists
from backend.inspire.models import MGeoDatas
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer
from backend.bundle.models import Bundle
from geoportal_app.models import User
from backend.geoserver.models import WmtsCacheConfig

from main.decorators import ajax_required
import main.geoserver as geoserver
from main import utils

# Create your views here.
def _get_features(package_id):
    feature_data = []
    for feature in LFeatures.objects.filter(package_id=package_id):
        view_name = utils.make_view_name(feature)
        has_mat_view = utils.has_materialized_view(view_name)
        feature_data.append({
            'id': feature.feature_id,
            'code': feature.feature_code,
            'name': feature.feature_name,
            'view': { "view_name": view_name if has_mat_view else "" }
        })
    return feature_data


def _get_package(theme_id):
    package_data = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': _get_features(package.package_id)
            })
    return package_data


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    style_names = []
    theme_qs = LThemes.objects
    theme_qs = theme_qs.all()
    themes = theme_qs.order_by("theme_id")
    for theme in themes:
        bundle = Bundle.objects.filter(ltheme_id=theme.theme_id)
        if bundle:
            data.append({
                'id': theme.theme_id,
                'code': theme.theme_code,
                'name': theme.theme_name,
                'package': _get_package(theme.theme_id),
            })
        else:
            theme.delete()

    utils.check_gp_design()
    style_names = geoserver.get_styles()
    url = reverse('api:service:geo_design_proxy', args=['geoserver_design_view'])
    rsp = {
        'success': True,
        'data': data,
        'style_names': style_names,
        'defualt_url': request.build_absolute_uri(url),
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
                'data_type_name_eng': data_type.data_type_name_eng,
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
            properties = properties.exclude(value_type_id='data-type')
            properties = properties.exclude(property_code='localId')
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
        rsp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
    return JsonResponse(rsp)


def _check_select_type(field_name, model_name):
    not_select_fields = ['package', 'feature']
    if model_name not in not_select_fields:
        if '_id' not in field_name:
            return False
        field_name = field_name.split('_id')[0]
        if field_name not in model_name:
            return True
    return False


def _get_option_datas(model_name, field_name):
    find_data = dict()
    datas = list()
    if model_name == 'property':
        find_data['name'] = 'value_type_id'
        find_data['find'] = 'value_type'

    if model_name == 'feature_config':
        find_data['name'] = 'data_type_id'
        find_data['find'] = 'data_type'

    if model_name == 'data_type_config' or model_name == 'code_list_config':
        find_data['name'] = 'property_id'
        find_data['find'] = 'property'

    if model_name == 'code_list':
        find_data['name'] = 'property_id'
        find_data['find'] = 'property'

    if field_name == 'connect_feature_id':
        find_data['find'] = 'feature'

    if field_name == 'connect_feature_property_id':
        find_data['find'] = 'property'

    if field_name == 'top_code_list_id':
        find_data['find'] = 'code_list'

    if 'find' in find_data:
        datas = _get_datas(find_data['find'])
    return datas


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def getFields(request, payload):
    model_name = payload.get('name')
    savename = payload.get('name')

    id = payload.get('id')
    edit_name = payload.get('edit_name')
    not_id = False

    Model = _get_Model(model_name)
    fields = []
    for i in Model._meta.get_fields():
        field_name = i.name
        data = ''
        type_name = i.get_internal_type()
        if not field_name == 'created_on' and not field_name == 'created_by' and not field_name == 'modified_on' and not field_name == 'modified_by' and field_name != 'bundle':
            field = dict()
            if type_name == "CharField":
                type_name = 'text'
            if type_name == "IntegerField" or type_name == "BigIntegerField":
                type_name = 'number'
            if type_name == "BooleanField":
                type_name = 'radio'
            is_select = _check_select_type(field_name, savename)
            if is_select:
                type_name = 'select'
            if type_name == 'select':
                field['options'] = _get_option_datas(savename, field_name)

            field['field_name'] = field_name
            field['field_type'] = type_name
            field['data'] = data

            if not edit_name:
                if 'id' in field_name and not 'connect' in field_name:
                    if '_' in savename:
                        if savename == 'data_type_config' and field_name == 'data_type_id':
                            field['data'] = id
                        elif savename == 'feature_config' and not field_name == 'data_type_id':
                            field['data'] = id
                            not_id = True
                        elif not not_id:
                            out = savename.split('_')
                            if not str(out[0]) in field_name:
                                field['data'] = id
                    else:
                        field['data'] = id
            if edit_name:
                if savename == 'theme' and field_name == 'bundle':
                    pass
                else:
                    datas = Model.objects.filter(pk=id)
                    for data in datas:
                        data_obj = model_to_dict(data)
                        dat = data_obj[field_name]

                        if type(dat) == 'bool' and not 1 and dat:
                            dat = 'true'
                        if type(dat) == 'bool' and not dat and not 0:
                            dat = 'false'
                        else:
                            dat = dat

                        if type_name == 'radio' and not dat and not 0:
                            dat = 'false'

                        field['data'] = dat if dat else ""

            fields.append(field)
    rsp = {
        'success': True,
        'fields': fields
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFields(request, tid, fid):

    file_list = list()
    file_detail = dict()

    theme = get_object_or_404(LThemes, theme_id=tid)
    feature = get_object_or_404(LFeatures, feature_id=fid)

    view_name = utils.make_view_name(feature)
    has_mat_view = utils.has_materialized_view(view_name)
    geom = MGeoDatas.objects.filter(feature_id=fid).first()

    file_path = _import_feature_template(False, theme, feature, True )

    if os.path.exists(file_path):
        file = os.listdir(file_path)
        if file:
            file = file[0]
            file_path = file_path + '/' + file
            file_stat = os.stat(file_path)

            file_detail['name'] = str(file)
            file_detail['size'] = file_stat.st_size
            file_list.append(file_detail)

    geom_type = ''
    if geom:
        geom_type = geom.geo_data.geom_type

    if not has_mat_view:
        return JsonResponse({
            'success': False,
            'geom_type': geom_type,
        })

    view_qs = ViewNames.objects.filter(feature_id=fid)
    cache_values = []
    wmts = WmtsCacheConfig.objects.filter(feature_id=fid).first()
    if wmts:
        cache_values.append({
            'image_format': wmts.img_format,
            'zoom_start': wmts.zoom_start,
            'zoom_stop': wmts.zoom_stop,
            'cache_type': wmts.type_of_operation,
            'number_of_cache': wmts.number_of_tasks_to_use,
        })
    if view_qs:
        view = view_qs.first()
        id_list = [data.property_id for data in ViewProperties.objects.filter(view_id=view.id)]
        url = reverse('api:service:geo_design_proxy', args=['geoserver_design_view'])

        style_name = geoserver.get_layer_style('gp_layer_' + view_name)
        if ':' in style_name:
            style_name = style_name.split(':')[1]

        rsp = {
            'success': True,
            'fields': _lfeatureconfig(fid),
            'id_list': id_list,
            'open_datas': utils.json_load(view.open_datas) if view.open_datas else [],
            'view': view_qs.values('id', 'view_name').first(),
            'url': request.build_absolute_uri(url),
            'style_name': style_name,
            'geom_type': geom_type,
            'cache_values': cache_values,
            'files': file_list,
        }
    else:
        rsp = {
            'success': True,
            'fields': _lfeatureconfig(fid),
            'id_list': [],
            'open_datas': [],
            'view': '',
            'geom_type': geom_type,
            'cache_values': cache_values,
            'files': file_list,
            'style_name': geoserver.get_layer_style('gp_layer_' + view_name),
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def make_view(request):

    fid = request.POST.get('fid')
    file = request.FILES['files'] if request.FILES else ''
    values = request.POST.get('values')
    values = utils.json_load(values)
    values = values['values']

    theme = get_object_or_404(LThemes, theme_id=request.POST.get('tid'))
    feature = get_object_or_404(LFeatures, feature_id=fid)
    property_qs, l_feature_c_qs, data_type_c_qs = utils.get_properties(fid, False)

    feature_config_ids = list(l_feature_c_qs.values_list("feature_config_id", flat=True))
    data_type_ids = list(data_type_c_qs.values_list("data_type_id", flat=True))

    property_qs = property_qs.exclude(property_code__iexact='localid')
    property_qs = property_qs.exclude(value_type_id='data-type')
    property_ids = list(property_qs.values_list("property_id", flat=True))

    if file:
        _import_feature_template(file, theme, feature, False)

    view_name = utils.make_view_name(feature)
    # TODO ViewNames дээр view ийг feature id tai ni hamt hadgalaad uusgeh
    check = _create_view(list(property_ids), view_name, list(data_type_ids), list(feature_config_ids), fid)
    if check:
        rsp = _create_geoserver_detail(view_name, theme, request.user.id, feature, values)
    rsp = {
        "success": check,
        "data": check
    }
    if not check:
        rsp["error"] = "View үүсэхэд алдаа гарсан байна."
    return JsonResponse(rsp)


def _import_feature_template(file, theme, feature, get_options ):
    main_folder = 'feature-template'
    theme_name = theme.theme_name_eng
    feature_name = feature.feature_name_eng
    sub_folder = os.path.join(settings.MEDIA_ROOT, main_folder)
    theme_folder = os.path.join(sub_folder, theme_name)
    feature_folder = os.path.join(theme_folder, feature_name)

    if not get_options:
        if not os.path.exists(theme_folder):
            os.makedirs(theme_folder)
        if not os.path.exists(feature_folder):
                os.makedirs(feature_folder)

        folder_list = os.listdir(feature_folder)
        for item in folder_list:
            utils.remove_file(feature_folder + '/' + item)

        if file :
            utils.save_file_to_storage(file, feature_folder, file.name)

    else :
        return feature_folder


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFieldsSave(request):

    file = request.FILES['files'] if request.FILES else ''
    tid = request.POST.get('tid')
    fid = request.POST.get('fid')
    view_id = request.POST.get('view_id')

    values = request.POST.get('values')

    open_datas = request.POST.get('open_datas')
    open_datas = open_datas.split(',')

    id_list = request.POST.get('id_list')
    id_list = id_list.split(',')

    values = utils.json_load(values)
    values = values['values']

    theme = get_object_or_404(LThemes, theme_id=tid)
    feature = get_object_or_404(LFeatures, feature_id=fid)

    table_name = utils.make_view_name(feature)
    has_mat_view = utils.has_materialized_view(table_name)
    if not has_mat_view:
        return JsonResponse({
            "success": False,
            "msg": "View үүсээгүй байна view ийг үүсгэнэ үү",
        })

    view = ViewNames.objects.update_or_create(
        id=view_id,
        defaults={
            'view_name': table_name,
            'feature_id': fid,
            'open_datas': utils.json_dumps(open_datas),
        }
    )[0]

    _import_feature_template(file, theme, feature, False)

    view_prop_qs = ViewProperties.objects
    view_prop_qs.filter(view=view).delete()

    for prop_id in id_list:
        if prop_id:
            view_prop_qs.create(view=view, property_id=prop_id)

    is_created = _check_geoserver_detail(table_name, theme)
    if values or not is_created:
        rsp = _create_geoserver_detail(table_name, theme, request.user.id, feature, values)

    else:
        rsp = {
            "success": True,
            "msg": 'Амжилттай хадгаллаа'
        }

    return JsonResponse(rsp)


def _check_geoserver_detail(table_name, theme):
    theme_code = theme.theme_code
    ws_name = 'gp_' + theme_code
    layer_name = 'gp_layer_' + table_name

    rsp = geoserver.getWorkspace(ws_name)
    if rsp.status_code == 200:
        ds_rsp = geoserver.getDataStore(ws_name, ws_name)
        if ds_rsp.status_code == 200:
            ds_layer_rsp = geoserver.getDataStoreLayer(ws_name, ws_name, layer_name)
            if ds_layer_rsp.status_code == 200:
                return True
    return False


def _get_Model(model_name):
    obj = {
        'theme': LThemes,
        'package': LPackages,
        'feature': LFeatures,
        'property': LProperties,
        'feature_config': LFeatureConfigs,
        'data_type_config': LDataTypeConfigs,
        'code_list_config': LCodeListConfigs,
        'data_type': LDataTypes,
        'value_type': LValueTypes,
        'code_list': LCodeLists,
    }
    return obj[model_name]


def _str_to_bool(str):
    if str == 'true':
        return True
    return False


def _rsp_validation(data):
    if not data['data']:
        if data['field_name'] == "connect_feature_id" and not data['field_name'] == "connect_feature_property_id":
            return True
        else:
            info = 'Хоосон байна утга оруулна уу!'
            return info


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save(request, payload):
    model_name = payload.get("model_name")
    model_id = payload.get("model_id")
    edit_name = payload.get("edit_name")
    json = payload.get("form_values")
    model_name_old = model_name
    Model = _get_Model(model_name)

    datas = {}
    for data in json:
        if not data['data']:
            data['data'] = None
        if data['field_type'] == 'radio':
            datas[data['field_name']] = _str_to_bool(data['data'])
        # if data['field_type'] == 'order_no':
        #     order_no = len(Model.objects.all()) + 1
        #     datas[data['field_name']] = order_no
        else:
            datas[data['field_name']] = data['data']
            info = _rsp_validation(data)
            if info:
                rsp = {'success': False, 'info': info}

    model_qs = Model.objects

    if not edit_name:
        datas['created_by'] = request.user.id
        datas['modified_by'] = request.user.id
        if model_name_old == 'theme':
            is_active = datas['is_active']
            order_no = datas['order_no']

            last_order_n = Bundle.objects.all().order_by('sort_order').last().sort_order

            datas['order_no'] = order_no if order_no else last_order_n + 1
            datas['is_active'] = is_active if is_active else False
            theme_model = model_qs.create(**datas)

            Bundle.objects.create(
                is_removeable=is_active,
                created_by=request.user,
                sort_order=order_no,
                ltheme=theme_model,
            )
        else:
            model_qs.create(**datas)
    else:
        datas['modified_by'] = request.user.id
        datas['modified_on'] = utils.date_to_timezone(utils.get_today_datetime(is_string=True))
        model_filter = _get_model_filter(model_name, model_id)
        model_qs.filter(**model_filter).update(**datas)
    rsp = {
        'success': True,
        'info': 'Амжилттай хадгаллаа'
    }

    return JsonResponse(rsp)


def _get_model_filter(model_name, model_id):
    filter_data = dict()
    filter_data[model_name + "_id"] = model_id
    return filter_data


def _get_datas(mode_name):
    types = list()
    Model = _get_Model(mode_name)
    datas = Model.objects.all().values()
    for data in datas:
        types.append({
            'id': data[mode_name + "_id"],
            'name': data[mode_name + "_name"],
        })
    return types


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove(request, payload):
    model_name = payload.get('model_name')
    model_id = payload.get('model_id')
    Model = _get_Model(model_name)
    data = Model.objects.filter(pk=model_id)
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
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def erese(request, payload):
    model_name = payload.get('model_name')
    top_id = payload.get('top_id')
    if model_name == 'property':
        field_name = 'property_id'
        model_name = 'data_type_config'
    if model_name == 'data_type':
        field_name = 'data_type_id'
        model_name = 'feature_config'
    model_name = _get_Model(model_name)
    try:
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


def _create_geoserver_layer_detail(check_layer, table_name, ws_name, ds_name, layer_name, feature, values, wms):
    geom_att, extends = utils.get_colName_type(table_name, 'geo_data')
    if extends:
        srs = extends[0]['find_srid']
    else:
        srs = 4326
    tile_cache_check = values['tile_cache_check']
    cache_details = values['cache_values']
    geom_type = values['geom_type']
    style_name = values['style_name']
    layer_title = feature.feature_name

    if check_layer.status_code != 200:
        layer_create = geoserver.create_layer(
            ws_name,
            ds_name,
            layer_name,
            layer_title,
            table_name,
            srs,
            geom_att,
            extends,
            False
        )

    else:
        layer_create = geoserver.create_layer(
            ws_name,
            ds_name,
            layer_name,
            layer_title,
            table_name,
            srs,
            geom_att,
            extends,
            True
        )

    if layer_create.status_code == 201 or layer_create.status_code == 200:
        if geom_type:
            cache_values = values.get('cache_values')
            geoserver.update_layer_style(layer_name, style_name)
            if not style_name:
                return {"success": False, "error": 'Style-ийн нэр хоосон байна.'}
            if tile_cache_check:
                cache_type = cache_details.get('cache_type')
                zoom_stop = cache_details.get('zoom_stop')
                zoom_start = cache_details.get('zoom_start')
                image_format = cache_details.get('image_format')
                number_of_cache = cache_details.get('number_of_cache')
                if int(zoom_start) > 21 or int(zoom_stop) > 21 or int(number_of_cache) > 100:
                    return {
                        'success': False,
                        'error': 'TileCache-ийн max утга хэтэрсэн байна'
                    }
                feature_id = feature.feature_id
                cache_layer = geoserver.create_tilelayers_cache(ws_name, layer_name, srs, image_format, zoom_start, zoom_stop, cache_type, number_of_cache)
                wmts_url = ''
                if cache_layer.status_code == 200:
                    cache_field = WmtsCacheConfig.objects.filter(feature_id=feature_id).first()
                    if cache_field:
                        WmtsCacheConfig.objects.filter(id=cache_field.id).update(
                            img_format=image_format,
                            zoom_start=zoom_start,
                            zoom_stop=zoom_stop,
                            type_of_operation=cache_type,
                            number_of_tasks_to_use=number_of_cache
                        )
                    else:
                        WmtsCacheConfig.objects.create(
                            feature_id=feature_id,
                            img_format=image_format,
                            zoom_start=zoom_start,
                            zoom_stop=zoom_stop,
                            type_of_operation=cache_type,
                            number_of_tasks_to_use=number_of_cache
                        )

                    wmts_url = geoserver.get_wmts_url(ws_name)
                    wms.cache_url = wmts_url
                    wms.save()

        return {"success": True, 'msg': 'Амжилттай үүслээ'}
    else:
        return {"success": False, 'msg': 'Давхарга үүсгэхэд алдаа гарлаа'}


def _create_geoserver_detail(table_name, theme, user_id, feature, values):
    
    layer_responce = []
    theme_code = theme.theme_code
    ws_name = 'gp_' + theme_code
    layer_name = 'gp_layer_' + table_name
    ds_name = ws_name
    layer_title = feature.feature_name
    wms_url = geoserver.get_wms_url(ws_name)

    check_workspace = geoserver.getWorkspace(ws_name)
    theme_name = theme.theme_name
    wms = WMS.objects.filter(name=theme_name).first()
    if not wms:
        wms = WMS.objects.create(
                name=theme_name,
                url = wms_url,
                created_by_id=user_id
            )
    if check_workspace.status_code == 404:
        geoserver.create_space(ws_name)

    check_ds_name = geoserver.getDataStore(ws_name, ds_name)
    if check_ds_name.status_code == 404:
        data_store  = geoserver.create_store(
                        ws_name,
                        ds_name,
                        ds_name,
        )
        if  data_store.status_code != 201:

            return {
                'success': False,
                'error': 'DataStore үүсгэхэд алдаа гарлаа'
            }
    check_layer = geoserver.getDataStoreLayer(
        ws_name,
        ds_name,
        layer_name
    )
    layer_responce = _create_geoserver_layer_detail(check_layer, table_name, ws_name, ds_name, layer_name, feature, values, wms)
    wms_id = wms.id
    wms_layer = wms.wmslayer_set.filter(code=layer_name).first()
    if not wms_layer:
        wms_layer = WMSLayer.objects.create(
                        name=layer_title,
                        code=layer_name,
                        wms=wms,
                        title=layer_title,
                        feature_price=0,
                    )

    bundle_layer = BundleLayer.objects.filter(layer_id=wms_layer.id).first()
    bundle_id = theme.bundle.id
    if not  bundle_layer:
        BundleLayer.objects.create(
            bundle_id=bundle_id,
            layer_id=wms_layer.id
        )

    return layer_responce


def _get_value_type_for_view(value_type_id):
    obj = {
        'boolean': 'value_text',
        'date': 'value_date',
        'double': 'value_number',
        'link': 'value_text',
        'multi-select': 'value_text',
        'multi-text': 'value_text',
        'single-select': 'value_text',
        'number': 'value_number',
        'text': 'value_text',
    }
    value_type = obj[value_type_id] if value_type_id in obj else 'value_text'
    return value_type


def _create_view(ids, table_name, data_type_ids, feature_config_id, feature_id):
    ids.sort()
    data = LProperties.objects.filter(property_id__in=ids).order_by('property_id')
    removeView(table_name)
    fields = list()
    for row in data:
        if row.property_code == 'end':
            fields.append('end_')
        else:
            fields.append(row.property_code)
    cols = list()
    for item in data:
        value_type = _get_value_type_for_view(item.value_type_id)
        col = 'Max(Case When a.property_id = {property_id} Then {value_type} End) As {property_code}'.format(value_type=value_type, property_id=item.property_id, property_code=item.property_code)
        cols.append(col)
    query = '''
        create MATERIALIZED VIEW public.{table_name} as
            select
                a.geo_id,
                a.geo_data,
                a.geo_id as inspire_id,
                a.geo_id as localid,
                {cols},
                a.feature_id,
                a.created_on,
                a.modified_on
            from
            (
                select
                    a.geo_id,
                    a.property_id,
                    mg.geo_data,
                    mg.feature_id,
                    mg.created_on,
                    mg.modified_on,
                    COALESCE(
                            a.value_text::character varying(1000),
                            case when a.code_list_id is null then null
                            else (
                                select code_list_name
                                from l_code_lists
                                where code_list_id=a.code_list_id
                            ) end
                        ) as value_text,
                    a.value_number,
                    a.value_date
                from
                    public.m_datas a
                inner join
                    m_geo_datas mg
                on
                    mg.geo_id = a.geo_id
                where
                    a.property_id in ({properties}) and a.feature_config_id in ({feature_config_ids})
            ) a
            group by
                a.geo_id,
                a.geo_data,
                a.feature_id,
                a.created_on,
                a.modified_on

    '''.format(
            table_name = table_name,
            columns=', '.join(['ct.{}'.format(f) for f in fields]),
            properties=', '.join(['{}'.format(f) for f in ids]),
            data_type_ids=', '.join(['{}'.format(f) for f in data_type_ids]),
            feature_config_ids=', '.join(['{}'.format(f) for f in feature_config_id]),
            create_columns=', '.join(['{} character varying(100)'.format(f) for f in fields]),
            feature_id=feature_id,
            cols=',\n'.join(cols)
        )
    query_index = ''' CREATE UNIQUE INDEX {table_name}_index ON {table_name}(geo_id) '''.format(table_name=table_name)
    with connections['default'].cursor() as cursor:
        cursor.execute(query)
        cursor.execute(query_index)
    return True


def removeView(table_name):
    try:
        query = '''
            DROP MATERIALIZED VIEW IF EXISTS {table_name};
        '''.format(table_name = table_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(query)
        return True
    except Exception:
        return False


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def feature_overlaps_set(request, payload):
    feature_id = payload.get('feature_id')
    overlap_feature_id = payload.get('overlap_feature_id')
    state = payload.get('state')
    qs = FeatureOverlaps.objects
    qs = qs.filter(feature_id=feature_id)
    qs = qs.filter(overlap_feature_id=overlap_feature_id)
    if state == 'remove':
        qs.delete()
        rsp = {
            'success': True,
            'info': 'Амжилттай хаслаа'
        }

    else:
        qs = qs.first()
        if not qs:
            FeatureOverlaps.objects.create(
                feature_id=feature_id,
                overlap_feature_id=overlap_feature_id
            )
        rsp = {
            'success': True,
            'info': 'Амжилттай нэмлээ'
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def feature_overlaps_get(request, feature_id):
    qs = FeatureOverlaps.objects
    qs = qs.filter(feature_id=feature_id)
    qs = qs.values_list('overlap_feature_id', flat=True)
    feature_ids = [i for i in qs]
    rsp = {
        'success': True,
        'feature_ids': feature_ids
    }

    return JsonResponse(rsp)
