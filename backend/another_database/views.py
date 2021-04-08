from backend.inspire.models import LFeatures, LPackages, LThemes
import requests
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_POST, require_GET
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector
from api.utils import replace_src_url
from backend.payment.models import PaymentLayer
from main.decorators import ajax_required
from main.components import Datatable
from main import utils
from .models import AnotherDatabaseTable, AnotherDatabase
from .mongo_utils import mogno_db_collection_names, _mongo_settings, mongo_config, mogno_db_collection_field_names
from backend.inspire.models import LPackages, LFeatures


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pagination(request, payload):

    def _get_data_type_name(data_type, item):
        for id, name in AnotherDatabase.DB_CHOICES:
            if id == data_type:
                return name


    оруулах_талбарууд = ['id', 'name', 'definition', 'unique_id', 'database_updated_at', 'created_at', 'updated_at', 'db_type']
    хувьсах_талбарууд = [{"field": "db_type", "action": _get_data_type_name, "new_field": "db_type"}]

    datatable = Datatable(
        model=AnotherDatabase,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд,
        хувьсах_талбарууд=хувьсах_талбарууд
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
@user_passes_test(lambda u: u.is_superuser)
def mongo_get(request, pk):
    another_db = get_object_or_404(AnotherDatabase, pk=pk)
    connection = utils.json_load(another_db.connection)

    form_datas = {
        'id': pk,
        'name': another_db.name,
        'definition': another_db.definition,
        'mongo_engine': connection.get('mongo_engine'),
        'mongo_client_host': connection.get('mongo_client_host'),
        'mongo_client_username': connection.get('mongo_client_username'),
        'mongo_client_password': connection.get('msssql_password'),
        'mongo_database': connection.get('mongo_database'),
    }

    rsp = {
        'success': True,
        'values': form_datas
    }

    return JsonResponse(rsp)


def get_unique_id():
    obj = AnotherDatabase.objects.all().order_by('unique_id').first()
    if obj:
        return obj.unique_id + -1
    else:
        return -1


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def mongo_save(request, payload):

    connection = {
        'mongo_engine': payload.get('mongo_engine'),
        'mongo_database': payload.get('mongo_database'),
        'mongo_client_host': payload.get('mongo_client_host'),
        'mongo_client_username': payload.get('mongo_client_username'),
        'mongo_client_password': payload.get('mongo_client_password'),
    }

    connection = utils.json_dumps(connection)
    db_type = AnotherDatabase.MONGODB
    name = payload.get('name')
    definition = payload.get('definition')

    pk = payload.get('id')

    unique_id = get_unique_id()

    AnotherDatabase.objects.update_or_create(
        pk=pk,
        defaults={
            'connection': connection,
            'db_type': db_type,
            'name': name,
            'definition': definition,
            'unique_id': unique_id
        }
    )

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def mssql_get(request, pk):
    another_db = get_object_or_404(AnotherDatabase, pk=pk)
    connection = utils.json_load(another_db.connection)

    form_datas = {
        'id': pk,
        'name': another_db.name,
        'definition': another_db.definition,
        'msssql_server': connection.get('msssql_server'),
        'msssql_port': connection.get('msssql_port'),
        'msssql_username': connection.get('msssql_username'),
        'msssql_password': connection.get('msssql_password'),
        'msssql_database': connection.get('msssql_database'),
    }

    rsp = {
        'success': True,
        'values': form_datas
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def mssql_save(request, payload):

    connection = {
        'msssql_server': payload.get('msssql_server'),
        'msssql_port': payload.get('msssql_port'),
        'msssql_username': payload.get('msssql_username'),
        'msssql_password': payload.get('msssql_password'),
        'msssql_database': payload.get('msssql_database'),
    }

    connection = utils.json_dumps(connection)
    db_type = AnotherDatabase.MSSSQL
    name = payload.get('name')
    definition = payload.get('definition')

    pk = payload.get('id')

    unique_id = get_unique_id()

    AnotherDatabase.objects.update_or_create(
        pk=pk,
        defaults={
            'connection': connection,
            'db_type': db_type,
            'name': name,
            'definition': definition,
            'unique_id': unique_id
        }
    )

    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove(request, pk):

    another_db = get_object_or_404(AnotherDatabase, pk=pk)
    another_db.delete()
    connection = utils.json_load(another_db.connection)
    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def mongo_sables(request, pk):

    feautures = []
    cursor = _mssql_settings(pk)
    table_names = mogno_db_collection_names(cursor)

    for fea in LFeatures.objects.all():
        feautures.append({
            'name': fea.feature_name,
            'code': fea.feature_code,
        })
    rsp = {
        'success': True,
        'table_names': table_names or [],
        'features': feautures
    }

    return JsonResponse(rsp)



@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def mongo_fields(request, pk, name):
    print(pk, name)
    print(pk, name)
    print(pk, name)

    feautures = []
    cursor = _mongo_settings(pk)
    table_names = mogno_db_collection_names(cursor)

    for fea in LFeatures.objects.all():
        feautures.append({
            'name': fea.feature_name,
            'code': fea.feature_code,
        })
    rsp = {
        'success': True,
        'table_names': table_names or [],
        'features': feautures
    }

    return JsonResponse(rsp)

cursor = _mongo_settings(23)
mogno_db_collection_field_names(cursor, 'urban')
def get_inspire_shatlal(request):

    theme_list = list()
    theme_qs = LThemes.objects.all()
    for theme in theme_qs:
        theme_dict = dict()
        theme_dict['id'] = theme.theme_id
        theme_dict['code'] = theme.theme_code
        theme_dict['name'] = theme.theme_name
        package_qs = LPackages.objects.filter(theme_id=theme.theme_id)
        package_list = list()
        for pack in package_qs:
            package_dict = dict()
            package_dict['id'] = pack.package_id
            package_dict['code'] = pack.package_code
            package_dict['name'] = pack.package_name
            feature_qs = LFeatures.objects.filter(package_id=pack.package_id)
            feature_list = list()
            for feature in feature_qs:
                feature_dict = dict()
                feature_dict['id'] = feature.feature_id
                feature_dict['code'] = feature.feature_code
                feature_dict['name'] = feature.feature_name
                feature_list.append(feature_dict)
            package_dict['children'] = feature_list
            package_list.append(package_dict)

        theme_dict['children'] = package_dict
        theme_list.append(theme_dict)

    rsp = {
        'datas': theme_list,
    }

    return JsonResponse(rsp)
