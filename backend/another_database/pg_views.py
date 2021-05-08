import datetime

from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import Polygon, MultiPolygon, MultiPoint, MultiLineString
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import user_passes_test
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
    another_database = get_object_or_404(AnotherDatabase, pk=pk)
    get_base = AnotherDatabaseTable.objects.filter(another_database=another_database)
    feature_codes = get_base.values_list('feature_code', flat=True)
    оруулах_талбарууд = ['id', 'table_name', 'feature_code', 'updated_at', 'created_at', 'another_database_id']
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
        initial_qs=initial_qs
    )

    items, total_page = datatable.get()

    for item in items:
        for code in feature_codes:
            data = LFeatures.objects.filter(feature_code=code).first()
            feature_name = data.feature_name
            item['feature_code']=feature_name

    rsp = {
        'items': items,
        'page': payload.get("page"),
        'total_page': total_page
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_pg_table_names(request, conn_id):
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
                        'code_list': code_data_list
                    })

            data_types_datas.append({
                'data_type_name': data_types.data_type_name,
                'data_type_eng': data_types.data_type_name_eng,
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
    result = []
    cursor_pg = utils.get_cursor_pg(id)

    feature_name = get_object_or_404(LFeatures, feature_id=feature_name)
    another_database = get_object_or_404(AnotherDatabase, pk=id)
    if not table_id:
        sql = '''
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE  table_schema = 'public'
                    AND    table_name   = '{table_name}'
                );
        '''.format(table_name=table_name)
        result= utils.get_sql_execute(sql, cursor_pg, 'one')
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
            'created_by': request.user
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
    field_config = utils.json_load(field_config)
    feature = LFeatures.objects.filter(feature_code=another_db_tb.feature_code).first()
    package = LPackages.objects.filter(package_id=feature.package_id).first()

    form_datas = {
        'id_list': field_config,
        'table_name': another_db_tb.table_name,
        'feature_name': feature.feature_id,
        'theme_name': package.theme_id,
        'package_name': package.package_id
    }

    return JsonResponse({
        'success': True,
        'form_datas': form_datas
    })


def _get_all_datas(feature_id, columns, properties, feature_config_ids):
    query = '''
            SELECT
                d.geo_id,
                ST_AsGeoJSON(ST_Transform(d.geo_data,4326)) as geo_data,
                {columns},
                d.feature_id
            FROM
                crosstab('
                    select
                        b.geo_id,
                        b.property_id,
                        COALESCE(
                            b.code_list_id::character varying(1000),
                            b.value_text::character varying(1000),
                            b.value_number::character varying(1000),
                            b.value_date::character varying(1000)
                        ) as value_text
                    from
                        public.m_datas b
                    inner join
                        m_geo_datas mg
                    on
                        mg.geo_id = b.geo_id
                    and
                        mg.feature_id = {feature_id}
                    where
                        b.property_id in ({properties})
                    and
                        feature_config_id in ({feature_config_id})
                    group by (
						b.property_id, b.geo_id, b.code_list_id,
						b.value_text, b.value_number, b.value_date
					)
                    order by 1,2'::text
                )
            ct(geo_id character varying(100), {create_columns})
            JOIN m_geo_datas d ON ct.geo_id::text = d.geo_id::text
        '''.format(
                columns=', '.join(['ct.{}'.format(f) for f in properties]),
                properties=', '.join(['{}'.format(f) for f in columns]),
                feature_config_id=', '.join(['{}'.format(f) for f in feature_config_ids]),
                create_columns=', '.join(['{} character varying(100)'.format(f) for f in properties]),
                feature_id=feature_id,
        )
    cursor = connections['default'].cursor()
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


def _drop_table(table_name, cursor, schema):
    detete_query = '''
        DROP TABLE IF EXISTS {schema}.{table_name}
    '''.format(
        table_name=table_name,
        schema=schema
    )
    cursor.execute(detete_query)

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


def _insert_to_someone_db(table_name, cursor, columns, feature_code, pg_schema):

    columns.sort()
    feature_id = LFeatures.objects.filter(feature_code=feature_code).first().feature_id
    fields = list(LProperties.objects.filter(property_id__in=columns).order_by('property_id').values_list('property_code', flat=True))
    feature_config_ids = list(LFeatureConfigs.objects.filter(feature_id=feature_id).values_list('feature_config_id', flat=True))

    _drop_table(table_name, cursor, pg_schema)
    _create_extension(cursor, pg_schema)
    _create_code_list_table(cursor, columns, pg_schema)

    property_columns = []
    for feild in range(len(fields)):
        property_split = '''
            {code} character varying(100)
            '''.format(
                code=fields[feild].lower()
            )
        property_columns.append(property_split)

    _create_table(cursor, table_name, property_columns, pg_schema)
    data_lists = _get_all_datas(feature_id, columns, fields, feature_config_ids)
    success_count = 0
    failed_count = 0
    total_count = len(data_lists)
    for data in data_lists:
        property_data = []

        for field in fields:
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
                    columns=','.join(fields),
                    columns_data=', '.join(property_data),
                    schema=pg_schema
                )
            cursor.execute(insert_query)
            success_count = success_count + 1
        except Exception:
            pass
    failed_count = total_count - success_count
    return success_count, failed_count, total_count


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove_pg_table(request, id, table_id):

    pg_table = AnotherDatabaseTable.objects.filter(pk=table_id).first()
    pg_table.delete()
    try:
        cursor_pg = utils.get_cursor_pg(id)
        _drop_table(pg_table.table_name, cursor_pg)
    except Exception:
        return False

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
            table_name = table.table_name
            field_config = table.field_config.replace("'", '"')
            columns = utils.json_load(field_config)
            feature_code = table.feature_code
            success_count, failed_count, total_count = _insert_to_someone_db(table_name, cursor_pg, columns, feature_code, pg_schema)
            table_info_text = '''
                "{table_name}" хүснэгт
                нийт: {total_count} мөр датанаас
                амжилттай орсон: {success_count},
                амжилтгүй: {failed_count}.
                '''.format(
                    table_name=table_name,
                    total_count=total_count,
                    success_count=success_count,
                    failed_count=failed_count
                )
            table_info.append(table_info_text)

        ano_db.database_updated_at = datetime.datetime.now()
        ano_db.save()
    return JsonResponse({
        'success': success,
        'info': info,
        'table_info': table_info,
    })

