from django.apps import apps
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
from datetime import datetime
from django.db.models import Count, F, Func, Q
from main.decorators import ajax_required
from geoportal_app.models import User
from backend.wms.models import WMSLog
from main.components import Datatable


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def login_list(request, payload):

    LoginEvent = apps.get_model('easyaudit', 'LoginEvent')

    def _get_login_type_name(login_type, item):
        return "Нэвтэрсэн" if login_type == 1 else "Системээс гарсан"

    хувьсах_талбарууд = [{"field": "login_type", "action": _get_login_type_name, "new_field": "login_type"}]
    datatable = Datatable(
        model=LoginEvent,
        payload=payload,
        хувьсах_талбарууд=хувьсах_талбарууд,
    )
    items, total_page = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def login_date_count(request):

    LoginEvent = apps.get_model('easyaudit', 'LoginEvent')

    user_login_date_all = LoginEvent.objects.all().order_by('datetime__date').distinct('datetime__date')
    user_login_date = []
    user_login_date_count = []
    for login_date in user_login_date_all:
        user_login_date.append(login_date.datetime.strftime('%Y-%m-%d'))
        user_login_date_count.append(LoginEvent.objects.filter(datetime__date=login_date.datetime).count())

    rsp = {
        'user_log_date': user_login_date,
        'user_log_date_count': user_login_date_count,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def page_list(request, payload):

    RequestEvent = apps.get_model('easyaudit', 'RequestEvent')
    оруулах_талбарууд = ['id', 'url', 'method', 'query_string', 'remote_ip', 'user_id', 'datetime']
    datatable = Datatable(
        model=RequestEvent,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд
    )
    items, total_page = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def page_date_count(request):

    RequestEvent = apps.get_model('easyaudit', 'RequestEvent')

    page_all = RequestEvent.objects.all().order_by('datetime__date').distinct('datetime__date')
    page_date = []
    page_date_count = []
    for page in page_all:
        page_date.append(page.datetime.strftime('%Y-%m-%d'))
        page_date_count.append(RequestEvent.objects.filter(datetime__date=page.datetime).count())

    rsp = {
        'page_date': page_date,
        'page_date_count': page_date_count,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def page_user_count(request):

    RequestEvent = apps.get_model('easyaudit', 'RequestEvent')

    rsp = {
        'user_count': RequestEvent.objects.filter(user_id__isnull=True).count(),
        'user_count_null': RequestEvent.objects.filter(user_id__isnull=False).count()
    }

    return JsonResponse(rsp)


def _get_user_name(user_id, item):

    if user_id:
        return User.objects.filter(id=user_id).values('username').first()['username']
    else:
        return 'Нэвтрээгүй'

def _set_event_type(event_type, item):
    if event_type == 1:
        event_type = 'ШИНЭ'
    elif event_type == 2:
        event_type = 'ЗАССАН'
    elif event_type == 3:
        event_type ='УСТГАСАН'
    elif event_type == 4:
        event_type = 'Many-to-Many Change'
    else:
        event_type = 'Reverse Many-to-Many Change'

    return event_type


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def crudList(request, payload):

    CRUDEvent = apps.get_model('easyaudit', 'CRUDEvent')
    оруулах_талбарууд = ['id', 'event_type', 'object_id', 'object_repr', 'datetime', 'content_type_id', 'user_id', 'user_pk_as_string', 'changed_fields']
    хувьсах_талбарууд = [
        {"field": "user_id", "action": _get_user_name, "new_field": "username"},
        {"field": "event_type", "action": _set_event_type, "new_field": "event_type"},
    ]
    datatable = Datatable(
        model=CRUDEvent,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд,
        хувьсах_талбарууд=хувьсах_талбарууд
    )
    items, total_page = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def crud_method_count(request):

    CRUDEvent = apps.get_model('easyaudit', 'CRUDEvent')

    method_all = CRUDEvent.objects.all().order_by('event_type').distinct('event_type')
    method_id = []
    method_id_count = []
    for login_date in method_all:
        method_id.append(login_date.event_type)
        method_id_count.append(CRUDEvent.objects.filter(event_type=login_date.event_type).count())

    rsp = {
        'method_id': method_id,
        'method_id_count': method_id_count,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def crud_date_count(request):

    CRUDEvent = apps.get_model('easyaudit', 'CRUDEvent')

    date_all = CRUDEvent.objects.all().order_by('datetime__date').distinct('datetime__date')
    crud_date = []
    crud_date_count = []
    for crud in date_all:
        crud_date.append(crud.datetime.strftime('%Y-%m-%d'))
        crud_date_count.append(CRUDEvent.objects.filter(datetime__date=crud.datetime).count())

    rsp = {
        'crud_date': crud_date,
        'crud_date_count': crud_date_count,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def wms_log_list(request, payload):
    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('perpage')
    wms_log_all_display = []
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    logins = WMSLog.objects.annotate(search=SearchVector(
        'qs_all',
        'qs_request',
        'rsp_status',
        'rsp_size',
        'created_at',
        'system_id',
        'wms_id',
    )).filter(search__icontains=query).order_by(sort_name)

    total_items = Paginator(logins, per_page)
    items_page = total_items.page(page)

    for wms_log_all in items_page.object_list:
        wms_log_all_display.append({
            'qs_all': wms_log_all.qs_all,
            'qs_request': wms_log_all.qs_request,
            'rsp_status': wms_log_all.rsp_status,
            'rsp_size': wms_log_all.rsp_size,
            'created_at': wms_log_all.created_at,
            'system_id': wms_log_all.system_id,
            'wms_id': wms_log_all.wms_id,
        })

    total_page = total_items.num_pages

    rsp = {
        'items': wms_log_all_display,
        'page': page,
        'total_page': total_page,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def wms_date_count(request):
    wms_login_date_all = WMSLog.objects.all().order_by('created_at__date').distinct('created_at__date')
    wms_login_date = []
    wms_login_date_count = []
    for login_date in wms_login_date_all:
        wms_login_date.append(login_date.created_at.strftime('%Y-%m-%d'))
        wms_login_date_count.append(WMSLog.objects.filter(created_at__date=login_date.created_at).count())

    rsp = {
        'wms_log_date': wms_login_date,
        'wms_log_date_count': wms_login_date_count,
    }
    return JsonResponse(rsp)


# LoginEvent = apps.get_model('easyaudit', 'LoginEvent')
# now = datetime.now()
# all_object = LoginEvent.objects.filter(
#     datetime__year__gte=now.year,
#     datetime__month__gte=now.month,
#     datetime__day__gte=now.day
# ).order_by('id')



# sssss = all_object.annotate(num_login_type=Count('login_type', distinct=True))
# for i in sssss:
#     print(i)

# print(sssss)



@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_card_field(request):
    check_array = list()
    send_fields = list()
    prev_name = ''
    outlet_log = inlet_log = 0
    today = datetime.today().strftime('%Y-%m-%d')
    LoginEvent = apps.get_model('easyaudit', 'LoginEvent')
    all_object = LoginEvent.objects.all().order_by('id')
    if all_object:
        check_array.append(LoginEvent.objects.filter(pk=1).first().username)
        for index in all_object:
            check_data = index
            if today == check_data.datetime.strftime('%Y-%m-%d'):
                if check_data.login_type == 0:
                    outlet_log += 1
                elif check_data.login_type == 1:
                    inlet_log += 1
                else:
                    outlet_log += 1
            catche_name = check_data.username
            if prev_name != catche_name:
                prev_name = catche_name
            if prev_name not in check_array:
                check_array.append(prev_name)
        length = len(check_array)
        del check_array[:]

        cards = [
            {
                'value': length,
            },
            {
                'value': inlet_log,
            },
            {
                'value': outlet_log,
            },
        ]

        for index in cards:
            send_fields.append(index)
        rsp = {
            'success': True,
            'fields': send_fields,
        }
        return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_post_detail(request):
    send_fields = list()
    get_status = post_status = 0
    RequestEvent = apps.get_model('easyaudit', 'RequestEvent')
    all_object = RequestEvent.objects.all().order_by('id')
    if all_object:
        for index in all_object:
            method = index.method
            if(method == 'GET'):
                get_status += 1
            else:
                post_status += 1

        cards = [
            {
                'value': get_status,
            },
            {
                'value': post_status,
            },
        ]

        for index in cards:
            send_fields.append(index)

        rsp = {
                'success': True,
                'fields': send_fields,
            }
        return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_crud_events(request):
    send_fields = list()
    crud_created = crud_deleted = crud_updated = cruds = 0
    CrudEvent = apps.get_model('easyaudit', 'CrudEvent')
    all_object = CrudEvent.objects.all().order_by('id')
    if all_object:
        for index in all_object:
            cruds = index.event_type
            if cruds == 1:
                crud_created += 1
            elif cruds == 2:
                crud_updated += 1
            elif cruds == 3:
                crud_deleted += 1

        cards = [
            {
                'value': crud_created,
            },
            {
                'value': crud_updated,
            },
            {
                'value': crud_deleted,
            },
        ]

        for index in cards:
            send_fields.append(index)

        rsp = {
                'success': True,
                'fields': send_fields,
            }
        return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_rsp_status(request):
    send_fields = list()
    rsp_status_200 = rsp_status_301 = rsp_status_404 = rsp_status_500 = 0
    all_object = WMSLog.objects.all().order_by('id')
    if all_object:
        max_size = WMSLog.objects.filter(pk=1).first().rsp_size
        min_size = WMSLog.objects.filter(pk=1).first().rsp_size
        for index in all_object:
            rsp_status = index.rsp_status
            rsp_size = index.rsp_size
            if rsp_size >= max_size:
                max_size = rsp_size
            if rsp_size <= min_size:
                min_size = rsp_size
            if rsp_status == 200:
                rsp_status_200 += 1
            elif rsp_status == 301:
                rsp_status_301 += 1
            elif rsp_status == 404:
                rsp_status_404 += 1
            else:
                rsp_status_500 += 1

        cards = [
                {
                    'value': max_size,
                },
                {
                    'value': min_size,
                },
                {
                    'value': rsp_status_200,
                },
                {
                    'value': rsp_status_301,
                },
                {
                    'value': rsp_status_404,
                },
                {
                    'value': rsp_status_500,
                },
            ]

        for index in cards:
            send_fields.append(index)

        rsp = {
                'success': True,
                'fields': send_fields,
            }
        return JsonResponse(rsp)









