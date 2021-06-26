from django.urls import re_path, path, include
from llc.backend import llc_request

from llc.backend.llc_conf import views as llc_views
from llc.backend.llc_request import views as llc_request_views

urlpatterns = [
    path('', include(([
        path('', llc_views.llc_frontend, name='frontend'),
        path('get_tool_datas/', llc_views.get_tool_datas, name='get_tool_datas')
    ], 'llc'))),

    path('backend/', include(([
        path('get-all-geo_json/', llc_request_views.get_all_geo_json, name='get_all_geo_json'),
        path('llc-request-list/', llc_request_views.llc_request_list, name='llc_request_list'),
        path('save-request/', llc_request_views.save_request, name=' save_request'),
        path('<int:id>/get-file-shapes/', llc_request_views.get_file_shapes, name=' save_request'),
        path('<int:id>/send-request/', llc_request_views.send_request, name=' send_request'),
        path('<int:id>/remove-request/', llc_request_views.remove_request, name=' remove_request'),
        path('<int:id>/get-request-data/', llc_request_views.get_request_data, name='get_request_data'),
        path('get-search-field/', llc_request_views.get_search_field, name='get_search_field'),
        path('get_count/', llc_request_views.get_count, name='get_count'),
    ], 'llc_requests'))),

    re_path('^.*', llc_views.llc_frontend, name='frontend'),
]
