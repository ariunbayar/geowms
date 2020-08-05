from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST
import datetime

from main.decorators import ajax_required
from .models import UserLog

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

