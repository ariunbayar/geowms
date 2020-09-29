from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from geoportal_app.models import User
from backend.bundle.models import Bundle
from backend.wmslayer.models import WMSLayer
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db import connections


def system(request):
    return render(request, 'page/service.html', {"org": "govorg"})
