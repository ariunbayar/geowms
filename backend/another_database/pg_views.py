import pyodbc
import datetime

from django.contrib.gis.geos import GEOSGeometry
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.db import connections
from django.shortcuts import get_object_or_404

from backend.another_database.models import AnotherDatabase
from backend.another_database.models import AnotherDatabaseTable
from django.views.decorators.csrf import csrf_exempt

from main.decorators import ajax_required
from main import utils


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def config_detail(request, pk):
    another_db = get_object_or_404(AnotherDatabase, pk=pk)
    connection = utils.json_load(another_db.connection)

    form_datas = {
        'id': pk,
        'name': another_db.name,
        'definition': another_db.definition,
        'pg_host': connection.get('server'),
        'pg_port': connection.get('port'),
        'pg_username': connection.get('username'),
        'pg_password': connection.get('password'),
        'pg_database': connection.get('database'),
    }

    rsp = {
        'success': True,
        'values': form_datas
    }
    return JsonResponse(rsp)
