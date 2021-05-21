from django.urls import re_path, path, include

from llc.backend.llc_conf import views as llc_views

urlpatterns = [
    path('', include(([
        path('', llc_views.llc_frontend, name='frontend'),
    ], 'llc'))),

    re_path('^.*', llc_views.llc_frontend, name='llc'),
]
