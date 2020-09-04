from django.urls import re_path, path, include

from govorg.org import views as org_views

urlpatterns = [
      path('api/', include(([
        path('employee/', org_views.employees, name='employees'),
        path('bundle/', org_views.bundle, name='bundle'),   
    ], 'back_org'))),

    path('', include(([
        path('', org_views.all, name='all'),
    ], 'org'))),

    re_path('^.*', org_views.all, name='org'),
]
