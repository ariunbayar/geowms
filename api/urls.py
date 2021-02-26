from django.urls import path, include

from api.govorg import views as govorg_views
from api.public import views as public_views
from api.inspire import views as inspire_views
from rest_framework_jwt.views import obtain_jwt_token

app_name = 'api'
urlpatterns = [
    path('service/', include(([
        path('WMS/<int:bundle_id>/<int:wms_id>/<str:url_type>/', public_views.proxy, name='wms_proxy'),
        path('<str:token>/all/', govorg_views.proxy, name='system_proxy'),
        path('net-local/<str:token>/all/', govorg_views.proxy, name='local_system_proxy'),
        path('<str:token>/<str:code>.geojson', govorg_views.json_proxy, name='system_json_proxy'),
        path('net-local/<str:token>/<str:code>.geojson', govorg_views.json_proxy, name='local_system_json_proxy'),
        path('<str:token>/<int:pk>/', govorg_views.proxy, name='proxy'),
        path('<str:token>/', govorg_views.qgis_proxy, name='qgis-proxy'),
        path('<str:token>/qgis-submit/', govorg_views.qgis_submit, name='qgis_submit'),
        path('geo_design_proxy/<str:veiw_name>/', govorg_views.geo_design_proxy, name='geo_design_proxy')
    ], 'service'))),

    path('inspire/', include(([
        path('token-auth/', obtain_jwt_token, name='token-auth'),
        path('create/', inspire_views.create, name='create'),
        path('update/', inspire_views.update, name='update'),
        path('remove/', inspire_views.remove, name='remove'),
        path('select/', inspire_views.select, name='select')
    ], 'inspire'))),
]
