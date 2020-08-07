from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from main.decorators import ajax_required
from easyaudit.models import RequestEvent, CRUDEvent, LoginEvent
from geoportal_app.models import User


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def login_all(request):

    login_log_all_display = []

    for login_log_all in LoginEvent.objects.all():
        login_log_all_display.append({
            'id': login_log_all.id,
            'login_type': login_log_all.login_type,
            'username': login_log_all.username,
            'datetime': login_log_all.datetime.strftime('%Y-%m-%d'),
            'user_id': login_log_all.user_id,
            'remote_ip': login_log_all.remote_ip,
        })
    return JsonResponse({'login_log_all': login_log_all_display})


@require_POST
@ajax_required
def loginSearch(request, payload):
    query = payload.get('query')
    login_log_all_display = []

    for login_log_all in LoginEvent.objects.annotate(search=SearchVector('id', 'login_type', 'user_id', 'remote_ip') + SearchVector('username'),).filter(search__contains=query):
        login_log_all_display.append({
            'id': login_log_all.id,
            'login_type': login_log_all.login_type,
            'username': login_log_all.username,
            'datetime': login_log_all.datetime.strftime('%Y-%m-%d'),
            'user_id': login_log_all.user_id,
            'remote_ip': login_log_all.remote_ip,
        })
    return JsonResponse({'login_log_all': login_log_all_display})



@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def login_date_count(request):
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


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pageAll(request):
    log_display = []

    for log in RequestEvent.objects.all():
        log_display.append({
            'id':log.id,
            'url': log.url,
            'method': log.method,
            'query_string': log.query_string,
            'remote_ip': log.remote_ip,
            'user_id': log.user_id,
            'datetime': log.datetime.strftime('%Y-%m-%d'),

        })
    return JsonResponse({'page_logs':  log_display})


@require_POST
@ajax_required
def pageSearch(request, payload):
    query = payload.get('query')
    log_display = []
    for log in RequestEvent.objects.annotate(search=SearchVector('url','id', 'method', 'remote_ip', 'user_id') + SearchVector('url'),).filter(search__contains=query):
        log_display.append({
            'id':log.id,
            'url': log.url,
            'method': log.method,
            'query_string': log.query_string,
            'remote_ip': log.remote_ip,
            'user_id': log.user_id,
            'datetime': log.datetime.strftime('%Y-%m-%d'),

        })
    return JsonResponse({'page_logs':  log_display})

@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def page_date_count(request):
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

    rsp = {
        'user_count': RequestEvent.objects.filter(user_id__isnull=True).count(),
        'user_count_null':RequestEvent.objects.filter(user_id__isnull=False).count()
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def crud_event_all(request):
    crud_event_display = []
    for crud_event in CRUDEvent.objects.all():
        crud_event_display.append({
            'id': crud_event.id,
            'event_type': crud_event.event_type,
            'object_id': crud_event.object_id,
            'object_repr': crud_event.object_repr,
            'datetime': crud_event.datetime.strftime('%Y-%m-%d'),
            'content_type_id': crud_event.content_type_id,
            'username': User.objects.filter(id=crud_event.user_id).values('username').first()['username'],
            'user_id': crud_event.user_id,
            'user_pk_as_string': crud_event.user_pk_as_string,
            'changed_fields': crud_event.changed_fields,
        })
    return JsonResponse({'crud_event_display': crud_event_display})


@require_POST
@ajax_required
def crudSearch(request, payload):
    query = payload.get('query')
    crud_event_display = []
    for crud_event in CRUDEvent.objects.annotate(search=SearchVector('event_type', 'object_id', 'content_type_id', 'user_id', 'changed_fields') + SearchVector('object_repr'),).filter(search__contains=query):
        crud_event_display.append({
            'id': crud_event.id,
            'event_type': crud_event.event_type,
            'object_id': crud_event.object_id,
            'object_repr': crud_event.object_repr,
            'datetime': crud_event.datetime.strftime('%Y-%m-%d'),
            'content_type_id': crud_event.content_type_id,
            'username': User.objects.filter(id=crud_event.user_id).values('username').first()['username'],
            'user_id': crud_event.user_id,
            'user_pk_as_string': crud_event.user_pk_as_string,
            'changed_fields': crud_event.changed_fields,
        })
    return JsonResponse({'crud_event_display': crud_event_display})

@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def crud_method_count(request):
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