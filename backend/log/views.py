from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required
from .models import UserLog
from easyaudit.models import RequestEvent, CRUDEvent, LoginEvent


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request):
    user_log_display = []

    for user_log in UserLog.objects.all():
        user_log_display.append({
            'username': user_log.username,
            'email': user_log.email,
            'ip_address': user_log.ip_address,
            'browser_name': user_log.browser_name,
            'browser_version': user_log.browser_version,
            'device_name': user_log.device_name,
            'created_at': user_log.created_at.strftime('%Y-%m-%d')
        })

    return JsonResponse({'user_log': user_log_display})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def browser_count(request):
    browser_names = UserLog.objects.all().distinct('browser_name')
    user_browser_names_counts = []
    user_browser_count = []
    for browser in browser_names:
        user_browser_names_counts.append(browser.browser_name)
        user_browser_count.append(UserLog.objects.filter(browser_name=browser.browser_name).count())
    rsp = {
        'user_browser_names_counts': user_browser_names_counts,
        'user_browser_count': user_browser_count,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def browser_login(request):
    user_login_date_all = UserLog.objects.all().distinct('created_at__date')
    user_login_date = []
    user_login_date_count = []
    for login_date in user_login_date_all:
        user_login_date.append(login_date.created_at)
        user_login_date_count.append(UserLog.objects.filter(created_at__date=login_date.created_at).count())
    rsp = {
        'user_login_date': user_login_date,
        'user_login_date_count': user_login_date_count,
    }
    return JsonResponse(rsp)



@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def login_all(request):

    login_log_all_display = []

    for login_log_all in LoginEvent.objects.filter(login_type=0):
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

 
@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def logout_all(request):

    logout_log_all_display = []

    for logout_log_all in LoginEvent.objects.filter(login_type=1):
        logout_log_all_display.append({
            'id': logout_log_all.id,
            'login_type': logout_log_all.login_type,
            'username': logout_log_all.username,
            'datetime': logout_log_all.datetime.strftime('%Y-%m-%d'),
            'user_id': logout_log_all.user_id,
            'remote_ip': logout_log_all.remote_ip,
        })
    return JsonResponse({'logout_log_all': logout_log_all_display})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def login_date_count(request):
    user_login_date_all = LoginEvent.objects.filter(login_type=1).order_by('datetime__date').distinct('datetime__date') 
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
def logout_date_count(request):
    user_login_date_all = LoginEvent.objects.filter(login_type=1).order_by('datetime__date').distinct('datetime__date') 
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
