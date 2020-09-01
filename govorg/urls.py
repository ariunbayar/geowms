from django.urls import re_path, path, include

from govorg.org import views as org_views


app_name = 'govorg'
urlpatterns = [
      path('org/', include(([
        path('', org_views.all, name='all'),
    ], 'org'))),
    re_path('^.*', org_views.all, name='all'),
]
