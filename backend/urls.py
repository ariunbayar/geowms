from django.urls import re_path, path, include

from backend.bundle import views as bundle_views
from backend.webapp import views as webapp_views
from backend.wms import views as wms_views


app_name = 'backend'
urlpatterns = [

    path('wms/', include(([
        path('all/', wms_views.all, name='all'),
        path('create/', wms_views.create, name='create'),
        path('update/', wms_views.update, name='update'),
        path('delete/', wms_views.delete, name='delete'),
        path('WMS/<int:wms_id>/', wms_views.proxy, name='proxy'),
    ], 'wms'))),

    path('bundle/', include(([
        path('all/', bundle_views.all, name='all'),
        path('create/', bundle_views.create, name='create'),
        path('update/', bundle_views.update, name='update'),
        path('remove/', bundle_views.remove, name='remove'),
        path('wms-layers/', bundle_views.wms_layers),
    ], 'bundle'))),

    re_path('^.*', webapp_views.index, name='webapp'),

]
