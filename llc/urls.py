from django.urls import re_path, path, include
from llc.backend import llc_request

from llc.backend.llc_conf import views as llc_views
from llc.backend.llc_request import views as llc_request_views

urlpatterns = [
    path('', include(([
        path('', llc_views.llc_frontend, name='frontend'),
        path('llc-request-list/', llc_request_views.llc_request_list, name='llc_request_list'),
        path('save_requests/', llc_request_views. save_requests, name=' save_requests'),
    ], 'llc'))),

    re_path('^.*', llc_views.llc_frontend, name='llc'),
]
