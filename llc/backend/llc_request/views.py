from main.decorators import ajax_required
from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required

# Create your views here.

@require_GET
@ajax_required
def initial_func(request):
    print("Start")
    print("Start")
    print("Start")
