from django.urls import path, include

from api.govorg import views as govorg_views
from api.public import views as public_views

app_name = 'api'
urlpatterns = [
    path('service/', include(([
        path('WMS/<int:bundle_id>/<int:wms_id>/', public_views.proxy, name='wms_proxy'),
        path('<str:token>/all/', govorg_views.proxy, name='system_proxy'),
        path('net-local/<str:token>/all/', govorg_views.proxy, name='local_system_proxy'),
        path('<str:token>/<str:code>.geojson', govorg_views.json_proxy, name='system_json_proxy'),
        path('net-local/<str:token>/<str:code>.geojson', govorg_views.json_proxy, name='local_system_json_proxy'),
        path('<str:token>/<int:pk>/', govorg_views.proxy, name='proxy'),
        path('<str:token>/', govorg_views.qgis_proxy, name='qgis-proxy'),
        path('<str:token>/qgis-submit/', govorg_views.qgis_submit, name='qgis_submit'),
        path('geo_design_proxy/<str:veiw_name>/', govorg_views.geo_design_proxy, name='geo_design_proxy')
    ], 'service'))),
]
