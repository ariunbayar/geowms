import os
from re import template
from django.conf import settings

from django.db import connections
from django.db.models.aggregates import Max
from django.forms.models import model_to_dict
from django.db.models import ManyToOneRel
from django.forms.utils import flatatt
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import user_passes_test
from django.urls import reverse
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models.deletion import ProtectedError

from .models import ViewNames, ViewProperties, FeatureOverlaps
from backend.inspire.models import LThemes, MDatas
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

        not_has_option = {
            'code_list': ['property_id'],
            'code_list_config': ['property_id']
        }

        if model_name in not_has_option.keys():
            if field_name in not_has_option[model_name]:
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

    if model_name == 'data_type_config':
        find_data['name'] = 'property_id'
        find_data['find'] = 'property'

    if model_name == 'code_list_config':
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

    Model = _get_Model(model_name)
    fields = []
    for i in Model._meta.get_fields():
        field_name = i.name
        data = ''
        foreign_key_field = ""
        type_name = i.get_internal_type()
        if not field_name == 'created_on' and not field_name == 'created_by' and not field_name == 'modified_on' and not field_name == 'modified_by' and field_name != 'bundle' and not isinstance(i, ManyToOneRel):
            if type_name == 'ForeignKey':
                foreign_key_field = field_name
                field_name = field_name + "_id"
            field = dict()
            if type_name == "CharField":
                type_name = 'text'
            if type_name == "IntegerField" or type_name == "BigIntegerField" or type_name == "AutoField":
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
                if 'id' in field_name:
                    if '_' in savename:
                        main_field_name = savename + "_id"

                        special_fields = {
                            'code_list': ['property_id'],
                            'code_list_config': ['property_id'],
                        }

                        if 'config' in savename:
                            parent = utils.remove_text_from_str(savename, 'config')
                            parent = parent + "id"
                            if parent == field_name:
                                field['data'] = id

                        if savename in special_fields.keys():
                            if field_name in special_fields[savename]:
                                field['data'] = id

                        if main_field_name == field_name:
                            field['data'] = id

                    else:
                        field['data'] = id

                if field_name == 'is_active':
                    field['data'] = True

                if field_name == 'order_no':
                    max_order_no = Model.objects.aggregate(Max('order_no'))
                    field['data'] = max_order_no['order_no__max'] + 1

            if edit_name:
                if savename == 'theme' and field_name == 'bundle':
                    pass
                else:
                    datas = Model.objects.filter(pk=id)
                    for data in datas:
                        data_obj = model_to_dict(data)
                        if foreign_key_field:
                            data_obj[field_name] = data_obj.pop(foreign_key_field)
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

        style_name = ''
        style = geoserver.get_layer_style('gp_layer_' + view_name)
        if style:
            if ':' in style:
                style_name = style.split(':')[1]
            else:
                style_name = style

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


def _rsp_validation(data, datas, model_name):
    keys = ['connect_feature_id', 'connect_feature_property_id', 'is_connect_to_feature']
    if model_name == 'feature_config':
        if 'has_class' in datas:
            has_class = datas['has_class']
            if has_class is True:
                rem_data = utils.key_remove_of_dict(datas, keys)
                for check_data in rem_data:
                    if not rem_data[check_data]:
                        return False
                return True
            else:
                if not data['data']:
                    return False
    elif model_name == 'code_list':
        if 'top_code_list_id' in datas:
            return True

    else:
        if not data['data']:
            return False

    return True


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
    now_model_name = edit_name if edit_name else model_name

    error = ''

    important_code_models = ['package', 'feature']

    datas = {}
    for data in json:
        if 'code' in data['field_name'] and now_model_name in important_code_models:
            if "-" not in data['data']:
                if now_model_name == 'package':
                    theme = LThemes.objects.filter(pk=model_id).first()
                    theme_code = theme.theme_code
                    error = 'Буруу code байна. "Жишээ: {}-{}"'.format(theme_code, data['data'])
                if now_model_name == 'feature':
                    _package = LPackages.objects.filter(pk=model_id).first()
                    package_code = _package.package_code
                    error = 'Буруу code байна. "Жишээ: {}-{}"'.format(package_code, data['data'])
                break

            else:
                if now_model_name == 'package':
                    theme = LThemes.objects.filter(pk=model_id).first()
                    theme_code = theme.theme_code
                    code = data['data'].split('-')[0]
                    if theme_code != code:
                        error = 'Theme code таарахгүй байна. "{}" ийм байхаас таны оруулсан: {}'.format(theme_code, code)
                        break

                    qs = Model.objects.filter(package_code=data['data'])
                    if qs:
                        error = 'Package code давхардаж байна!'
                        break

                if now_model_name == 'feature':
                    _package = LPackages.objects.filter(pk=model_id).first()
                    package_code = _package.package_code

                    codes = data['data'].split(package_code)
                    if len(codes) < 2:
                        error = 'Буруу feature code байна. Жишээ: "{}-..."'.format(package_code)
                        break

                    feature_code = codes[len(codes) - 1]
                    if "-" not in feature_code:
                        error = 'Буруу feature code байна. Жишээ: "{}-..."'.format(package_code)
                        break

                    feature_code = utils.remove_text_from_str(feature_code, '-')
                    qs = LFeatures.objects.filter(feature_code=data['data'])
                    if qs:
                        error = 'Feature code давхардаж байна!'
                        break

        if not data['data']:
            data['data'] = None

        if data['field_type'] == 'radio':
            datas[data['field_name']] = _str_to_bool(data['data'])

        else:
            datas[data['field_name']] = data['data']
            info = _rsp_validation(data, datas, model_name)
            if not info:
                error = 'Хоосон байна, утга оруулна уу!'
                break

    if error:
        return JsonResponse({'success': False, 'info': error})

    model_qs = Model.objects

    if not edit_name:
        qs = model_qs.filter(pk=datas[model_name + "_id"])
        if qs:
            error = 'ID давхардаж байна'

        if 'order_no' in datas:
            qs = model_qs.filter(order_no=datas['order_no'])
            if qs:
                error = 'Order No давхардсан байна!'

        if model_name == 'theme':
            qs = LThemes.objects.filter(theme_code=datas[model_name + "_code"])
            if qs:
                error = 'Theme code давхардсан байна!'

        if error:
            return JsonResponse({'success': False, 'info': error})

        datas['created_by'] = request.user.id
        datas['modified_by'] = request.user.id
        if model_name_old == 'theme':
            is_active = datas['is_active']
            order_no = datas['order_no']

            last_order_n = Bundle.objects.aggregate(Max('sort_order'))['sort_order__max']

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
        model_qs = model_qs.filter(**model_filter)

        model_obj = model_qs.first()
        if 'order_no' in datas:
            if model_obj.order_no != datas['order_no']:
                qs = Model.objects.filter(order_no=datas['order_no'])
                if qs:
                    error = 'Order No давхардсан байна!'

        if model_name == 'theme':
            if model_obj.theme_code != datas["theme_code"]:
                qs = LThemes.objects.filter(theme_code=datas[model_name + "_code"])
                if qs:
                    error = 'Theme code давхардсан байна!'

        if error:
            return JsonResponse({'success': False, 'info': error})

        model_qs.update(**datas)

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


def _delete_main_table_datas(will_deletes, feature_ids):
    if 'feature' in will_deletes:
        mgeo_qs = MGeoDatas.objects
        mgeo_qs = mgeo_qs.filter(feature_id__in=feature_ids)
        geo_ids = list(mgeo_qs.values_list('geo_id', flat=True))

        mdatas_qs = MDatas.objects
        mdatas_qs = mdatas_qs.filter(geo_id__in=geo_ids)

        mdatas_qs.delete()
        mgeo_qs.delete()


def erese(model_name, model_id, this_ins_idx, will_deletes):

    main_field_name = model_name + "_id"

    success = True
    info = ''

    # ustgah uyd edgeer model iin baganuudiig None bolgoh
    erese_fields = {
        'feature_config': [
            {
                'model': 'feature_config',
                'fields': ['data_type_id']
            }
        ],
        'data_type_config': [
            {
                'model': 'data_type_config',
                'fields': ['property_id']
            }
        ],
        'property': [
            {
                'model': 'data_type_config',
                'fields': ['property_id'],
            }
        ],
        'value_type': [
            {
                'model': 'property',
                'fields': ['value_type_id']
            }
        ],
        'data_type': [
            {
                'model': 'feature_config',
                'fields': ['data_type_id']
            }
        ]
    }

    speciel_delete_fields = {
        'code_list_config': 'property_id',
        'code_list': 'property_id'
    }

    child_ids = [model_id]
    child_field_name = main_field_name

    will_delete_qs = list()

    feature_ids = list()  # m_geo_datas bolon m_datas aas ustgahad hereg bolno

    # foreign key eer holbogdson ustgaj bolohgv datag null bolgoh ni
    for will_delete in will_deletes:
        DeleteModel = _get_Model(will_delete)

        delete_qs = DeleteModel.objects

        delete_filter = {'{}__in'.format(child_field_name): child_ids}
        delete_qs = delete_qs.filter(**delete_filter)

        if will_delete in erese_fields:
            will_erese_fields = erese_fields[will_delete]
            for will_erese_field in will_erese_fields:
                erese_model = will_erese_field['model']
                EreseModel = _get_Model(erese_model)

                qs = EreseModel.objects

                fields = dict()
                qs = qs.filter(**delete_filter)

                if not qs:
                    continue

                for field in will_erese_field['fields']:
                    fields[field] = None

                # ustgasaas umnu foreign key eer holbogdson field iig null bolgono
                qs.update(**fields)

        child_field_name = will_delete + "_id"
        if will_delete in speciel_delete_fields.keys():
            child_field_name = speciel_delete_fields[will_delete]

        child_ids = list(delete_qs.values_list(child_field_name, flat=True))

        if will_delete == 'feature':
            feature_ids = child_ids

        will_delete_qs.append(delete_qs)

    will_delete_qs.reverse()

    _delete_main_table_datas(will_deletes, feature_ids)

    for qs in will_delete_qs:
        qs.delete()  # tuhain songoson oo ustgana

    info = "Амжилттай устгалаа"

    return success, info


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove(request, payload):
    model_name = payload.get('model_name')
    model_id = payload.get('model_id')

    Model = _get_Model(model_name)

    try:
        with transaction.atomic():

            data = Model.objects.filter(pk=model_id)
            if not data:
                rsp = {
                    'success': False,
                    'info': 'Хоосон байна'
                }
                return JsonResponse(rsp)

            inspire_tree = [
                ['theme', 'package', 'feature', 'feature_config'],
                ['data_type', 'data_type_config'],
                ['value_type'],
                ['property', 'code_list_config', 'code_list'],
            ]

            this_ins_idx = ''
            will_deletes = list()
            for ins_idx in range(0, len(inspire_tree)):
                table_names = inspire_tree[ins_idx]
                this_ins_idx = ins_idx
                for idx in range(0, len(table_names)):
                    table_name = table_names[idx]
                    if table_name == model_name:
                        will_deletes = table_names[idx:len(table_names)]
                        break

            if not will_deletes or not this_ins_idx:
                rsp = {
                    'success': False,
                    'info': 'Хүснэгт олдсонгүй'
                }
                return JsonResponse(rsp)

            success, info = erese(model_name, model_id, this_ins_idx, will_deletes)
            rsp = {
                'success': success,
                'info': info
            }
    except ProtectedError as e:
        utils.save_to_error500(request, e)
        rsp = {
            'success': False,
            'info': 'Дэд сангын бүтцээс өөр хүснэгттэй холбогдсон байгаа учир алдаа гарлаа'
        }
        return JsonResponse(rsp)

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
