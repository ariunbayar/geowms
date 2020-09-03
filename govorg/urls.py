from django.urls import re_path, path, include

from govorg.org import views as org_views

urlpatterns = [
      path('', include(([
        path('', org_views.all, name='all'), 
        path('employee/', org_views.employees, name='employees'),
        path('bundle/', org_views.all, name='bundle'),   
    ], 'org'))),
    re_path('^.*', org_views.all, name='org'),
]
