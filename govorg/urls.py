from django.urls import re_path, path, include

from govorg.backend.org import views as org_views
from govorg.backend.bundle import views as bundle_views
from govorg.backend.employee import views as employee_views
from govorg.backend.system import views as system_views

urlpatterns = [
    path('api/', include(([
        path('employee/', employee_views.employees, name='employees'),
        path('bundle/', bundle_views.bundle, name='bundle'),
    ], 'back_org'))),

    path('', include(([
        path('', org_views.frontend, name='frontend'),
    ], 'org'))),

    re_path('^.*', org_views.frontend, name='org'),
]