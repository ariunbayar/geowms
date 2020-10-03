from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_GET


from main.decorators import ajax_required


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def schema_list(request):
    sql = "SELECT schema_name FROM information_schema.schemata"
    sql = "SELECT nspname FROM pg_catalog.pg_namespace"

    rsp = {
        'items': [
            'pg_toast',
            'pg_temp_1',
            'pg_toast_temp_1',
            'pg_catalog',
            'public',
            'information_schema',
            'topology',
            'qgis',
            'TopographicMap',
            'HentiiDedBut',
            'Bayankhongor',
        ],
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def table_list(request):

    sql = """
        SELECT
           schemaname,
           tablename
        FROM
            pg_catalog.pg_tables
        WHERE
            schemaname != 'pg_catalog' AND
            schemaname != 'information_schema'
    """

    # TODO

    rsp = {
        'items': [
             ['public', 'spatial_ref_sys'],
             ['public', 'SPA'],
             ['public', 'AdmUnitAimag'],
             ['public', 'AdministrativeUnit'],
             ['public', 'power_station'],
             ['TopographicMap', 'Parcel'],
        ],
    }

    return JsonResponse(rsp)
