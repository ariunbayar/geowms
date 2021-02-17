
from django.shortcuts import get_object_or_404, get_list_or_404
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, FileResponse, Http404
from geojson import FeatureCollection

from main.decorators import ajax_required
from main import utils
from backend.org.models import EmployeeErguul

def index(request):

    context = {
        'covid': "covid"
    }

    return render(request, 'covid/index.html', context)
