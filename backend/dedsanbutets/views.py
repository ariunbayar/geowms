from django.shortcuts import render
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBoundary, LDataTypeConfigs, LFeatureConfigs, LDataTypes, LProperties, LValueTypes, LCodeListConfigs, LCodeLists
from main.decorators import ajax_required
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse, Http404
from django.contrib.auth.decorators import user_passes_test
from django.forms.models import model_to_dict
from django.db import connections
from .models import ViewNames, ViewProperties
from django.shortcuts import get_object_or_404

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
    id = payload.get('id')
    edit_name = payload.get('edit_name')
    print("+++++++++++")
    print(edit_name)
    print("+++++++++++")
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
                        fields.append({
                            'field_name': i.name,
                            'field_type': type_name,
                            'data': id
                        })
                    else:
                        fields.append({
                            'field_name': i.name,
                            'field_type': type_name,
                            'data': None
                        })
                if edit_name != '':
                    datas = model_name.objects.filter(pk=id)
                    for data in datas:
                        data_obj = model_to_dict(data)
                        dat = data_obj[i.name]
                        if dat == True:
                            dat = 'true'
                        if dat == False:
                            dat = 'false'
                        fields.append({
                            'field_name': i.name,
                            'field_type': type_name,
                            'data': dat
                        })
        rsp = {
            'success': True,
            'fields': fields
        }
    except Exception:


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
def propertyFieldsSave(request, payload):
    id_list = payload.get('fields')
    fid = payload.get('fid')
    feature = LFeatures.objects.filter(feature_id=fid).first()

    if not feature:
        rsp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
        return JsonResponse(rsp)

    check_name = ViewNames.objects.filter(feature_id=fid).first()
    if check_name:
        table_name = check_name.view_name
        removeView(table_name)
        check = createView(id_list, table_name)
        if check:
            ViewProperties.objects.filter(view=check_name).delete()
            for idx in id_list:
                ViewProperties.objects.create(view=check_name, property_id=idx)


    else:
        table_name = feature.feature_name_eng.split(' ')[0].lower() + '_view'
        check = createView(id_list, table_name)
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
    print(edit_name)
    json = payload.get("form_values")
    model_name = getModel(model_name)
    json = json['form_values']
    # print(json)
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
    print(datas)
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
    print(model_name, model_id)
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

    check_name = ViewNames.objects.filter(feature_id=fid).first()
    if check_name:
        table_name = check_name.view_name
        removeView(table_name)
        check = createView(id_list, table_name)
        if check:
            ViewProperties.objects.filter(view=check_name).delete()
            for idx in id_list:
                ViewProperties.objects.create(view=check_name, property_id=idx)


    else:
        table_name = feature.feature_name_eng.split(' ')[0].lower() + '_view'
        check = createView(id_list, table_name)
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


def createView(ids, table_name):
    data = LProperties.objects.filter(property_id__in=ids)
    fields = [row.property_code for row in data]
    try:

        query = '''
            CREATE OR REPLACE VIEW public.{table_name}
                AS
            SELECT d.geo_id, d.geo_data, {columns}, d.feature_id, d.created_on, d.created_by, d.modified_on, d.modified_by
            FROM crosstab('select b.geo_id, b.property_id, b.value_text from m_datas_building b where property_id in ({properties}) order by 1,2'::text)
            ct(geo_id character varying(100), {create_columns})
            JOIN m_geo_datas d ON ct.geo_id::text = d.geo_id::text

        '''.format(
                table_name = table_name,
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