from django.urls import re_path, path, include
from llc.backend import llc_request

from llc.backend.llc_conf import views as llc_views
from llc.backend.llc_request import views as llc_request_views

urlpatterns = [
    path('', include(([
        path('', llc_views.llc_frontend, name='frontend'),
        path('example/', llc_request_views.initial_func, name='backend'),
    ], 'llc'))),

    re_path('^.*', llc_views.llc_frontend, name='llc'),
]
