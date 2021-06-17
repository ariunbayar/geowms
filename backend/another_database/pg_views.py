from geojson import feature
from backend import another_database
import datetime
from django.utils import timezone

from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import Polygon, MultiPolygon, MultiPoint, MultiLineString
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse
from django.db import connections
from django.shortcuts import get_object_or_404

from backend.another_database.models import AnotherDatabase
from backend.another_database.models import AnotherDatabaseTable

from main.components import Datatable
from django.views.decorators.csrf import csrf_exempt

from main.decorators import ajax_required
from main import utils

from backend.inspire.models import (
    LFeatures,
    LThemes,
    LPackages,
    LFeatures,
    LDataTypeConfigs,
    LFeatureConfigs,
    LProperties,
    LValueTypes,
    LCodeListConfigs,
    LCodeLists,
    LDataTypes,
    MGeoDatas,
    MDatas
)


SELECTCOUNT = 100


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def config_detail(request, pk):

    rsp = {
        'success': True,
        'values': utils.get_pg_conf(pk)
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_pg_table_list(request, payload, pk):

    items = []
    another_database = get_object_or_404(AnotherDatabase, pk=pk)

    def _change_detail(data_id, items):
        feature_code = items['feature_code']
        feature_qs = LFeatures.objects.filter(feature_code=feature_code).first()
        feature_name = feature_qs.feature_name
        return feature_name

    оруулах_талбарууд = ['id', 'table_name', 'feature_code', 'updated_at', 'created_at', 'another_database_id']
    хувьсах_талбарууд = [{"field": "feature_code", "action": _change_detail, "new_field": "feature_code"}]

    initial_qs = AnotherDatabaseTable.objects.filter(another_database=another_database)

    if not initial_qs:
        rsp = {
            'items': [],
            'page': payload.get("page"),
            'total_page': 1
        }

        return JsonResponse(rsp)

    datatable = Datatable(
        model=AnotherDatabaseTable,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд,
        хувьсах_талбарууд=хувьсах_талбарууд,
        initial_qs=initial_qs
    )

    items, total_page = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get("page"),
        'total_page': total_page
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def get_pg_table_names(request):
    themes = LThemes.objects.all()
    l_themes = []
    l_packages = []
    l_features = []
    for theme in themes:
        theme_name = theme.theme_name
        theme_id = theme.theme_id
        l_themes.append({
            'name': theme_name,
            'code': theme_id
        })
        packages = LPackages.objects.filter(theme_id=theme.theme_id)
        for package in packages:
            package_id = package.package_id
            l_packages.append({
                'name': package.package_name,
                'code': package_id,
                'parent': theme_id
            })

            features = LFeatures.objects.filter(package_id=package_id)
            for feat in features:
                l_features.append({
                    'name': feat.feature_name,
                    'code': feat.feature_id,
                    'parent': feat.package_id
                })


    return JsonResponse({
        'themes': l_themes,
        'packages': l_packages,
        'features': l_features
    })


def _get_valid_data_type(value_type_id):
    if value_type_id == 'number':
        value_type = 'inte'
    elif value_type_id == 'double':
        value_type = 'inte'
    elif value_type_id == 'multi-text':
        value_type = 'char'
    elif value_type_id == 'text':
        value_type = 'char'
    elif value_type_id == 'date':
        value_type = 'time'
    elif value_type_id == 'link':
        value_type = 'char'
    elif value_type_id == 'boolean':
        value_type = 'bool'
    else:
        value_type = 'char'
    return value_type


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def getFields(request, payload):
    feature_id = payload.get('feature_id')

    value_types = ['boolean', 'multi-select', 'single-select']
    data_types_datas = []
    data_type_ids = list(LFeatureConfigs.objects.filter(feature_id=feature_id).values_list('data_type_id', flat=True))

    for data_type_id in data_type_ids:
        properties = list(LDataTypeConfigs.objects.filter(data_type_id=data_type_id).values_list('property_id', flat=True))
        data_types = LDataTypes.objects.filter(data_type_id=data_type_id).first()
        if data_types and properties:
            properties_data = []
            for property_id in properties:
                single_property = LProperties.objects.filter(property_id=property_id)
                single_property = single_property.exclude(value_type_id='data-type')
                single_property = single_property.exclude(property_code='localId')
                single_property = single_property.first()
                code_data_list = []
                if single_property:
                    value_type_id = single_property.value_type_id
                    value_type_name = ''
                    value_type_qs = LValueTypes.objects.filter(value_type_id=value_type_id)
                    value_type_qs = value_type_qs.exclude(value_type_id='data_type')
                    value_type_qs = value_type_qs.first()
                    if value_type_qs:
                        value_type_name = value_type_qs.value_type_name

                    if single_property.value_type_id in value_types:
                        code_lists = LCodeLists.objects.filter(property_id=property_id)
                        for code_list in code_lists:
                            code_data_list.append({
                                'code_list_name': code_list.code_list_name,
                                'code_list_code': code_list.code_list_code,
                                'code_list_id': code_list.code_list_id
                            })

                    properties_data.append({
                        'property_name': single_property.property_name,
                        'property_id': single_property.property_id,
                        'code_list': code_data_list,
                        'value_type_name': value_type_name,
                        'value_type_id': _get_valid_data_type(value_type_id)
                    })

            data_types_datas.append({
                'data_type_name': data_types.data_type_name,
                'data_type_eng': data_types.data_type_name_eng,
                'data_type_definition': data_types.data_type_definition,
                'properties': properties_data
            })

    return JsonResponse({
        'data_type_list': data_types_datas
    })


def _rsp_validation(result, table_name, id_list):
    info = ''
    if result and result[0]:
        info = 'Хүснэгтийн нэр давхцсан байна !!!.'
    if not table_name:
        info = 'Хүснэгтийн нэр хоосон байна !!!'
    if len(id_list) == 0:
        info = 'Property сонгоогүй байна !!!'
    return info


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_table(request, payload):
    table_id = payload.get('table_id')
    id = payload.get('id')
    feature_name = payload.get('feature_name')
    table_name = payload.get('table_name')
    id_list = payload.get('id_list')
    is_insert = payload.get('is_insert')
    pk_field_configs = payload.get("pk_field_config")
    pk_field_configs = utils.json_dumps(pk_field_configs)
    result = []
    cursor_pg = utils.get_cursor_pg(id)

    feature_name = get_object_or_404(LFeatures, feature_id=feature_name)
    another_database = get_object_or_404(AnotherDatabase, pk=id)
    if not table_id and not is_insert:
        result = utils.check_table_name(cursor_pg, table_name)
    info = _rsp_validation(result, table_name, id_list)
    if info:
        return JsonResponse({'success': False, 'info': info})
    AnotherDatabaseTable.objects.update_or_create(
        pk=table_id,
        defaults={
            'table_name': table_name,
            'feature_code': feature_name.feature_code,
            'field_config': utils.json_dumps(id_list),
            'another_database': another_database,
            'created_by': request.user,
            'field_config_index': pk_field_configs
        }
    )
    return JsonResponse({
        'success': True,
        'info': 'Амжилттай хадгалагдлаа'
    })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def table__detail(request, id, table_id):
    another_db_tb = get_object_or_404(AnotherDatabaseTable, pk=table_id)
    field_config = another_db_tb.field_config.replace("'", '"')
    field_config_index = another_db_tb.field_config_index.replace("'", '"')
    field_config = utils.json_load(field_config)
    store_field_config = utils.json_load(field_config_index)
    feature = LFeatures.objects.filter(feature_code=another_db_tb.feature_code).first()
    package = LPackages.objects.filter(package_id=feature.package_id).first()
    form_datas = {
        'id_list': field_config,
        'table_name': another_db_tb.table_name,
        'feature_name': feature.feature_id,
        'theme_name': package.theme_id,
        'package_name': package.package_id,
        'pk_field_name': store_field_config.get('pk_field_name') or '',
        'pk_start_index': store_field_config.get('pk_start_index') or '',
        'pk_field_count': store_field_config.get('pk_field_count') or '',
        'pk_field_max_range': store_field_config.get('pk_field_max_range') or '',
    }

    return JsonResponse({
        'success': True,
        'form_datas': form_datas
    })


def _get_all_datas(feature_id, columns, properties, feature_config_ids, cursor='default'):
    data = LProperties.objects.filter(property_id__in=columns).order_by('property_id')
    cols = []
    for item in data:
        col = 'Max(Case When a.property_id = {property_id} Then value_text End) As {property_code}'.format(property_id=item.property_id, property_code=item.property_code)
        cols.append(col)

    query = '''
        select
            a.geo_id,
            ST_AsGeoJSON(ST_Transform(a.geo_data, 4326)) as geo_data,
            a.feature_id,
            {cols}
        from
        (
            select
                a.geo_id,
                a.property_id,
                mg.geo_data,
                mg.feature_id,
                COALESCE(
                    a.value_text::character varying(1000),
                    a.value_number::character varying(1000),
                    a.value_date::character varying(1000),
                    case when a.code_list_id is null then null
                    else (
                        select code_list_name
                        from l_code_lists
                        where code_list_id=a.code_list_id
                    ) end
                ) as value_text
            from
                public.m_datas a
            inner join
                m_geo_datas mg
            on
                mg.geo_id = a.geo_id
            where
                a.property_id in ({properties}) and
                a.feature_config_id in ({feature_config_ids})
        ) a
        group by
        a.geo_id,
        a.geo_data,
        a.feature_id
        '''.format(
            properties=', '.join(['{}'.format(f) for f in columns]),
            cols=', '.join(['{}'.format(f) for f in cols]),
            feature_config_ids=', '.join(['{}'.format(f) for f in feature_config_ids]),
        )
    cursor = connections[cursor].cursor()
    data_list = utils.get_sql_execute(query, cursor, 'all')
    return data_list


def geoJsonConvertGeom(geojson):
    with connections['default'].cursor() as cursor:

        sql = """ SELECT ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        geom =  ''.join(geom)
        geom = GEOSGeometry(geom).hex
        geom = geom.decode("utf-8")
        return geom


def _geojson_to_geom(geo_json):
    geom = []
    geo_json = str(geo_json).replace("\'", "\"")
    geo_data = geoJsonConvertGeom(geo_json)
    geom = ''.join(geo_data)
    geom = GEOSGeometry(geom)

    geom_type = GEOSGeometry(geom).geom_type
    if geom_type == 'Point':
        geom = MultiPoint(geom, srid=4326)
    if geom_type == 'LineString':
        geom = MultiLineString(geom, srid=4326)
    if geom_type == 'Polygon':
        geom = MultiPolygon(geom, srid=4326)

    return geom


def _execute_query_to_pg(cursor, sql):
    try:
        cursor.execute(sql)
    except Exception:
        pass


def _create_extention_postgis(cursor, schema):
    query_extention = '''
        create extension IF NOT EXISTS  postgis SCHEMA {schema}
    '''.format(schema=schema)

    query_topology = '''
        CREATE EXTENSION   IF NOT EXISTS  postgis_topology
    '''.format(schema=schema)

    _execute_query_to_pg(cursor, query_extention)
    _execute_query_to_pg(cursor, query_topology)


def _create_extension(cursor, schema):
    crosstab_query = '''
        CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA {schema}
    '''.format(schema=schema)
    cursor.execute(crosstab_query)


def _create_table(cursor, table_name, property_columns, schema):

    columns = [
        'geo_id character varying(100) COLLATE pg_catalog."default" NOT NULL',
        'geo_data geometry(GeometryZ,4326)',
        'feature_id integer',
        'PRIMARY KEY (geo_id)'
    ]

    property_columns = columns + property_columns


    query_index = '''
        CREATE UNIQUE INDEX IF NOT EXISTS {table_name}_index ON {schema}.{table_name}(geo_id)
    '''.format(
        table_name=table_name,
        schema=schema
    )
    _create_extention_postgis(cursor, schema)
    utils.create_table_to_cursor(cursor, table_name, property_columns, schema)
    cursor.execute(query_index)


def _insert_datas_to_code_list_table(cursor, code_list_datas, schema):

    try:
        insert_query = '''
            INSERT INTO {schema}.geoportal_l_code_lists(
                code_list_id, property_code, code_list_code, code_list_name, code_list_name_eng
            )
            VALUES (
                {code_list_id},
                '{property_code}',
                '{code_list_code}',
                '{code_list_name}',
                '{code_list_name_eng}'
            );
            '''.format(
                code_list_id=code_list_datas.get('code_list_id'),
                property_code=code_list_datas.get('property_code'),
                code_list_code=code_list_datas.get('code_list_code'),
                code_list_name=code_list_datas.get('code_list_name'),
                code_list_name_eng=code_list_datas.get('code_list_name_eng'),
                schema=schema
            )
        cursor.execute(insert_query)
    except Exception:
        pass


def _get_property_code_lists(property_ids):

    code_list_prop_ids = []
    code_list_prop_datas = []
    code_list_value_types = ['option', 'single-select', 'boolean']

    qs_prop = LProperties.objects.filter(property_id__in=property_ids)
    qs_prop = qs_prop.filter(value_type_id__in=code_list_value_types)
    prop_datas = list(qs_prop.values("property_id", 'property_code'))
    if prop_datas:
        for prop in prop_datas:
            code_list_prop_ids.append(prop['property_id'])

        qs_code_list = LCodeLists.objects.filter(property_id__in=code_list_prop_ids)
        qs_code_list = list(qs_code_list.values(
            'code_list_id',
            'property_id',
            'code_list_code',
            'code_list_name',
            'code_list_name_eng'
        ))
        if qs_code_list:
            for code_list in qs_code_list:
                property_code = list(
                    filter(lambda x: x['property_id'] == code_list['property_id'], prop_datas)
                )[0]['property_code'] or ''

                code_list_data = {
                    'property_code': property_code,
                    'code_list_id': code_list.get('code_list_id') or None,
                    'code_list_code': code_list.get('code_list_code') or '',
                    'code_list_name': code_list.get('code_list_name') or '',
                    'code_list_name_eng': code_list.get('code_list_name_eng') or '',
                }
                code_list_prop_datas.append(code_list_data)

    return code_list_prop_datas


def _create_code_list_table(cursor, property_ids, schema):

    table_name = 'geoportal_l_code_lists'
    fields = [
        'code_list_id integer NOT NULL',
        'property_code character varying(255)',
        'code_list_code character varying(255)',
        'code_list_name character varying(255)',
        'code_list_name_eng character varying(255)',
        'PRIMARY KEY (code_list_id)'
    ]

    utils.create_table_to_cursor(cursor, table_name, fields, schema)
    code_list_datas = _get_property_code_lists(property_ids)
    if code_list_datas:
        for data in code_list_datas:
            _insert_datas_to_code_list_table(cursor, data, schema)


def _check(prop, geo_id, feature_data_ids, data_type_c_qs):
    # feuts = search(LFeatures, {'feature_code': feature_code})
    for f_d in feature_data_ids:
        # feature_config_id = fc.feature_config_id
        # data_type_id = fc.data_type_id
        for dt in data_type_c_qs:
            if dt.property_id == prop['property_id']:
                mdta = MDatas.objects
                mdta = mdta.filter(
                    geo_id=geo_id,
                    feature_config_id=f_d['feature_config_id'],
                    data_type_id=f_d['data_type_id'],
                    property_id=prop['property_id'],
                )
                if not mdta:
                    MDatas.objects.create(
                        geo_id=geo_id,
                        feature_config_id=f_d['feature_config_id'],
                        data_type_id=f_d['data_type_id'],
                        property_id=prop['property_id'],
                    )


def _insert_to_someone_db(table_name, cursor, columns, feature_code, pg_schema='public'):

    columns.sort()

    feature_id = LFeatures.objects.filter(feature_code=feature_code).first().feature_id
    feature_config_ids = list(LFeatureConfigs.objects.filter(feature_id=feature_id).values_list('feature_config_id', flat=True))
    property_codes = list(LProperties.objects.filter(property_id__in=columns).values_list('property_code', flat=True).order_by('property_id'))

    utils.drop_table(table_name, cursor, pg_schema)
    _create_extension(cursor, pg_schema)
    _create_code_list_table(cursor, columns, pg_schema)

    success_count = 0
    failed_count = 0

    property_columns = list()
    for property_code in property_codes:
        property_split = '''
            {code} character varying(100)
            '''.format(
                code=property_code.lower()
            )
        property_columns.append(property_split)

    _create_table(cursor, table_name, property_columns, pg_schema)
    data_lists = _get_all_datas(feature_id, columns, property_codes, feature_config_ids)
    total_count = len(data_lists)
    for data in data_lists:
        property_data = []

        for field in property_codes:
            field_name = field.lower()
            field_data = data.get(field_name) or ''
            property_d = '''
            '{field_data}'
            '''.format(field_data=field_data)
            property_data.append(property_d)

        geo_data = data['geo_data']
        geo_data = _geojson_to_geom(geo_data)
        try:
            geo_data = utils.convert_3d_with_srid(geo_data)
            insert_query = '''
                INSERT INTO {schema}.{table_name}(
                    geo_id, geo_data, feature_id, {columns}
                )
                VALUES ('{geo_id}', '{geo_data}', {feature_id}, {columns_data});
                '''.format(
                    table_name=table_name,
                    geo_id=data['geo_id'],
                    geo_data=geo_data,
                    feature_id=feature_id,
                    columns=','.join(property_codes),
                    columns_data=', '.join(property_data),
                    schema=pg_schema
                )
            cursor.execute(insert_query)
            success_count = success_count + 1
        except Exception:
            pass
        failed_count = total_count - success_count
    return success_count, failed_count, total_count


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove_pg_table(request, payload, id, table_id):
    is_insert = payload.get('is_insert')
    pg_table = AnotherDatabaseTable.objects.filter(pk=table_id).first()
    created_by = pg_table.another_database.unique_id
    if is_insert:
        try:
            cursor_pg = utils.get_cursor_pg(id)
            utils.drop_table(pg_table.table_name, cursor_pg)
        except Exception:
            pass
    else:
        mdatas = MDatas.objects.filter(created_by=created_by)
        mdatas.delete()

        m_geo_datas = MGeoDatas.objects.filter(created_by=created_by)
        m_geo_datas.delete()

    pg_table.delete()
    return JsonResponse({
        'success': True,
    })


@require_GET
@csrf_exempt
def refresh_datas(request, id):
    ano_db = get_object_or_404(AnotherDatabase, pk=id)
    ano_db_table_pg = AnotherDatabaseTable.objects
    ano_db_table_pg = ano_db_table_pg.filter(another_database=ano_db)

    cursor_pg = utils.get_cursor_pg(id)
    table_info = []
    info = ''
    success = True

    connection = utils.json_load(ano_db.connection)
    pg_schema = connection.get('schema') or 'public'

    if ano_db_table_pg:
        for table in ano_db_table_pg:
            single_table_info = _export_table(ano_db, table, cursor_pg)
            table_info.append(single_table_info)
        ano_db.database_updated_at = datetime.datetime.now()
        ano_db.save()
    return JsonResponse({
        'success': success,
        'info': info,
        'table_info': table_info,
    })


def _export_table(ano_db, ano_db_table_pg, cursor):
    table_info = []
    table_name = ano_db_table_pg.table_name
    field_config = ano_db_table_pg.field_config.replace("'", '"')
    columns = utils.json_load(field_config)
    feature_code = ano_db_table_pg.feature_code
    success_count, failed_count, total_count = _insert_to_someone_db(table_name, cursor, columns, feature_code)
    table_info_text = '''
        {table_name} хүснэгт
        нийт {total_count} мөр дата-наас
        амжилттай орсон {success_count}
        амжилтгүй {failed_count}
        '''.format(
            table_name=table_name,
            total_count=total_count,
            success_count=success_count,
            failed_count=failed_count
        )
    table_info.append(table_info_text)
    ano_db.database_updated_at = datetime.datetime.now()
    ano_db.save()
    return table_info


def search(Model, search):
    return Model.objects.filter(**search)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def refresh_single_table(request, id, table_id):
    ano_db = get_object_or_404(AnotherDatabase, pk=id)
    ano_db_table_pg = AnotherDatabaseTable.objects
    ano_db_table_pg = ano_db_table_pg.filter(pk=table_id).first()
    cursor_pg = utils.get_cursor_pg(id)
    info = ''
    success = True
    if ano_db_table_pg:
        table_info = _export_table(ano_db, ano_db_table_pg, cursor_pg)
    else:
        success = False
        info = 'Хүснэгт үүсээгүй байна !!!'
    return JsonResponse({
        'success': success,
        'info': info,
        'table_info': table_info
    })


# Өөр баазаас дата авах

@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_ano_tables(request, pk):

    cursor_pg = utils.get_cursor_pg(pk)
    sql = '''
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
    '''

    sql_views = '''
        SELECT
            relname as table_name
        FROM
            pg_class
        WHERE
            relkind = 'm'
    '''

    table_names = utils.get_sql_execute(sql, cursor_pg, 'all')
    view_names = utils.get_sql_execute(sql_views, cursor_pg, 'all')

    return JsonResponse({
        'table_names': table_names + view_names,
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_table_fields(request, payload, pk):
    table_name = payload.get('table_name')
    cursor_pg = utils.get_cursor_pg(pk)

    sql = '''
        SELECT
        attname AS column_name, format_type(atttypid, atttypmod) AS data_type
        FROM
        pg_attribute
        WHERE
        attrelid = '{table_name}'::regclass AND    attnum > 0
        ORDER  BY attnum
    '''.format(
        table_name=table_name,
    )

    columns = utils.get_sql_execute(sql, cursor_pg, 'all')

    return JsonResponse({
        'fields': columns
    })


def _delete_datas_of_pg(unique_id, feature_id):
    m_geo_datas = MGeoDatas.objects.filter(
        feature_id=feature_id, created_by=unique_id
    )
    if m_geo_datas:
        for geo_data in m_geo_datas:
            m_datas = MDatas.objects.filter(
                geo_id=geo_data.geo_id,
                created_by=unique_id
            )
            m_datas.delete()

        m_geo_datas.delete()


def _get_count_of_table(cursor, table_name, has_range, start_data, data_type, field_name):
    start_data = _get_type_of_data(start_data, data_type)
    end_field = _get_type_of_data(has_range, data_type)
    filter_data= ''
    if has_range:
        filter_data = '''
            where
            {start} <={field_name}  and {field_name}<={end}
			group by {field_name}
            order by {field_name} asc
        '''.format(
            field_name=field_name,
            start=start_data,
            end=end_field
        )

    sql = '''
        select
            count(*) as count
        from
            public.{table_name}
            {filter_data}
    '''.format(
        table_name=table_name,
        filter_data = filter_data
    )
    cursor.execute(sql)
    datas = list(utils.dict_fetchall(cursor))
    if has_range:
        datas = len(datas)
    else:
        datas = datas[0]['count']
    return datas


def _get_type_of_data(data, column_type):
    type_in = ['inte', 'numb', 'nume', 'doub']
    data_field = ''' '{}' '''.format(data)
    if column_type[:4] in type_in:
        data_field = int(data)
    return data_field


def _get_ona_datas(cursor, table_name, columns, table_geo_data, start_data, pk_field_name, pk_field_type, has_range):
    start_field = _get_type_of_data(start_data, pk_field_type)
    end_field = _get_type_of_data(has_range, pk_field_type)

    filter_type = '''
        {pk_field_name} >= {start_field}
    '''.format(pk_field_name=pk_field_name, start_field=start_field)

    if has_range:
        filter_type = '''
            {start_field} <={field_name}  and {field_name}<={end_field}

        '''.format(
            field_name=pk_field_name,
            start_field=start_field,
            end_field=end_field
        )

    sql = '''
        SELECT
            {pk_field_name},
            {columns}
        FROM public.{table_name}
        WHERE {filter_type} ORDER BY {pk_field_name} ASC
        limit {select_count}
    '''.format(
        table_name=table_name,
        columns=','.join(columns),
        table_geo_data=table_geo_data,
        filter_type=filter_type,
        pk_field_name=pk_field_name,
        select_count=SELECTCOUNT,
    )
    cursor.execute(sql)
    datas = list(utils.dict_fetchall(cursor))
    return datas


def _insert_geo_data(ona_data, feature, table_geo_data, unique_id, new_geo_id):
    geom = None
    if ona_data[table_geo_data]:
        geo_data = _geojson_to_geom(ona_data[table_geo_data])
        geom =utils.convert_3d_with_srid(geo_data)
    m_datas_object = MGeoDatas(
        geo_id=new_geo_id,
        geo_data=geom,
        feature_id=feature.feature_id,
        created_by=unique_id
    )
    return new_geo_id, m_datas_object


def _insert_m_datas(ona_data, feature, geo_id, columns, unique_id):
    property_ids = _get_row_to_list('property_id', columns, True)
    prop_qs = LProperties.objects
    prop_qs = prop_qs.filter(property_id__in=property_ids)
    prop_codes = list(prop_qs.values_list('property_code', flat=True))
    m_datas_object =  []
    for prop_code in prop_codes:
        data, value_type = utils.get_filter_dicts(prop_code, feature_code=feature.feature_code)
        if data:
            for prop_data in columns:
                if data['property_id'] == prop_data['property_id']:
                    mdata_value = dict()
                    if value_type == "code_list_id":
                        mdata_value[value_type] = ona_data[prop_data['table_field']]
                        if str(mdata_value[value_type])[0] == '0':
                            mdata_value[value_type] = mdata_value[value_type][1:]
                    elif value_type == "value_date":

                        if not isinstance(ona_data[prop_data['table_field']], datetime.datetime) and ona_data[prop_data['table_field']]:
                            mdata_value[value_type] = datetime.datetime.strptime(str(ona_data[prop_data['table_field']]), '%Y-%m-%d').replace(tzinfo=timezone.utc)
                        else:
                            mdata_value[value_type] = None

                    else:
                        mdata_value[value_type] = ona_data[prop_data['table_field']]

                    m_datas_object.append(MDatas(
                        geo_id=geo_id,
                        **data,
                        **mdata_value,
                        created_by=unique_id
                    ))

    return m_datas_object


def _get_row_to_list(field_name, dict_data, table_field):
    row_list = []
    for i in dict_data:
        if table_field:
            if isinstance(i[field_name], int):
                row_list.append(i[field_name])
        else:
            if i['property_id'] == 'geo_datas':
                geo_data_field = '''
                    ST_AsGeoJSON(ST_Transform({geo_data}, 4326)) as {geo_data}
                '''.format(geo_data=i[field_name])
                row_list.append(geo_data_field)
            else:
                row_list.append(i[field_name])

    return row_list


def str_to_int(geo_id):
    return int(geo_id[-9:])


def int_to_str(number):
    return str(number).zfill(9)


def _insert_to_geo_db(ano_db, ano_db_table_pg,  table_name, cursor, columns, feature):
    success_count = 0
    failed_count = 0
    unique_id = ano_db.unique_id
    pk_field_config = ano_db_table_pg.field_config_index
    pk_field_config = utils.json_load(pk_field_config)
    feature_id = feature.feature_id
    # хуучин датаг утсгах хэсэг
    # _delete_datas_of_pg(unique_id, feature_id)

    table_geo_data = list(
        filter(lambda x: x['property_id'] == 'geo_datas', columns)
    )[0]['table_field']

    table_fields = _get_row_to_list('table_field', columns, False)

    last_geo_data = MGeoDatas.objects.filter(feature_id=feature_id).order_by('-created_on').first()

    if last_geo_data:
        last_geo_id = last_geo_data.geo_id
    else:
        last_geo_id = feature.feature_code + '__' +  int_to_str(1)

    try:
        start_data = pk_field_config.get('pk_start_index') or ""
        pk_field_name = pk_field_config.get('pk_field_name') or ""
        pk_field_type = pk_field_config.get('pk_field_type') or ""
        count = pk_field_config.get('pk_field_count') or ''
        pk_field_max_range = pk_field_config.get('pk_field_max_range') or ''
        if count and int(count) >1:
            count = count
        else:
            count = _get_count_of_table(cursor, table_name, pk_field_max_range, start_data, pk_field_type, pk_field_name)

        current_data_counts = 0
        current_geo_id = last_geo_id
        while current_data_counts < int(count):
            m_datas_object = []
            geo_data_objs = []
            ona_table_datas = _get_ona_datas(cursor, table_name, table_fields, table_geo_data, start_data, pk_field_name, pk_field_type, pk_field_max_range)
            start_data = ona_table_datas[-1][pk_field_name]
            for ona_data in ona_table_datas[0:SELECTCOUNT-1]:
                current_geo_id = str_to_int(current_geo_id)
                current_geo_id = current_geo_id + 1
                new_geo_id = feature.feature_code + '__' +  int_to_str(current_geo_id)
                current_geo_id = new_geo_id
                geo_id, geo_data_obj = _insert_geo_data(ona_data, feature, table_geo_data, unique_id, new_geo_id)

                geo_data_objs.append(geo_data_obj)

                m_d_data = _insert_m_datas(ona_data, feature, new_geo_id, columns, unique_id)
                m_datas_object = m_datas_object + m_d_data
                success_count = success_count + 1
            MGeoDatas.objects.bulk_create(geo_data_objs)
            MDatas.objects.bulk_create(m_datas_object)
            current_data_counts = current_data_counts + SELECTCOUNT-1
    except Exception:
        failed_count += 1
        pass

    return success_count, failed_count, count


def _insert_single_table(ano_db, ano_db_table_pg, cursor):
    table_info = []
    table_name = ano_db_table_pg.table_name
    field_config = ano_db_table_pg.field_config.replace("'", '"')
    columns = utils.json_load(field_config)
    feature_code = ano_db_table_pg.feature_code
    feature = LFeatures.objects.filter(feature_code=feature_code).first()
    success_count, failed_count, total_count = _insert_to_geo_db(ano_db, ano_db_table_pg, table_name, cursor, columns, feature)
    table_info_text = '''
        {table_name} хүснэгт
        нийт {total_count} мөр дата-наас
        "{feature_name}" feature-д
        амжилттай орсон {success_count}
        амжилтгүй {failed_count}
        '''.format(
            table_name=table_name,
            total_count=total_count,
            success_count=success_count,
            failed_count=failed_count,
            feature_name=feature.feature_name
        )

    table_info.append(table_info_text)
    ano_db.database_updated_at = datetime.datetime.now()
    ano_db.save()
    return table_info


@require_GET
@csrf_exempt
@user_passes_test(lambda u: u.is_superuser)
def refresh_all_conn(request, id):
    ano_db = get_object_or_404(AnotherDatabase, pk=id)
    ano_db_table_pg = AnotherDatabaseTable.objects
    ano_db_table_pg = ano_db_table_pg.filter(another_database=ano_db)

    cursor_pg = utils.get_cursor_pg(id)
    table_info = []
    info = ''
    success = True

    if ano_db_table_pg:
        for table in ano_db_table_pg:
            single_table_info = _insert_single_table(ano_db, table, cursor_pg)
            table_info.append(single_table_info)
        ano_db.database_updated_at = datetime.datetime.now()
        ano_db.save()
    return JsonResponse({
        'success': success,
        'table_info': table_info,
    })


@require_GET
@csrf_exempt
@user_passes_test(lambda u: u.is_superuser)
def insert_single_table(request, id, table_id):
    ano_db = get_object_or_404(AnotherDatabase, pk=id)
    ano_db_table_pg = AnotherDatabaseTable.objects
    ano_db_table_pg = ano_db_table_pg.filter(id=table_id).first()

    cursor_pg = utils.get_cursor_pg(id)
    success = True
    single_table_info = _insert_single_table(ano_db, ano_db_table_pg, cursor_pg)
    ano_db.database_updated_at = datetime.datetime.now()
    ano_db.save()
    return JsonResponse({
        'success': success,
        'table_info': single_table_info,
    })


def _refresh_feature(items):
    feature_code = items.feature_code
    feature_qs = LFeatures.objects
    feature_qs = feature_qs.filter(feature_code=feature_code).first()
    view_name = utils.make_view_name(feature_qs)
    has_mat = utils.has_materialized_view(view_name)
    if has_mat:
        utils.refreshMaterializedView(feature_qs.feature_id)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def refresh_view(request, payload):
    id = payload.get('id')
    table_id = payload.get('table_id')
    initial_qs = AnotherDatabaseTable.objects

    if table_id :
        ano_db_table_pg = initial_qs.filter(id=table_id).first()
        # _refresh_feature(ano_db_table_pg)

    else :
        ano_db_table_pg = initial_qs.filter(another_database_id=id)

        # for item in ano_db_table_pg:
            # _refresh_feature(item)

    return JsonResponse({
        'success': True
    })