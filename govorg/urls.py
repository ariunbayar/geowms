from django.urls import re_path, path, include

from govorg.org import views as org_views

urlpatterns = [
    path('api/', include(([
        path('employee/', org_views.employees, name='employees'),
        path('bundle/', org_views.bundle, name='bundle'),
    ], 'back_org'))),

    path('zip-code/', include(([
        path('aimag/', org_views.aimag, name='aimag'),
        path('sum/', org_views.sum, name='sum'),
        path('bag-horoo/', org_views.bagaHoroo, name='bag-horoo'),
        path('wms-layer/', org_views.wmsLayer, name='wms-layer'),
    ], 'zip_code'))),

    path('', include(([
        path('', org_views.all, name='all'),
    ], 'org'))),

    re_path('^.*', org_views.all, name='org'),
]
