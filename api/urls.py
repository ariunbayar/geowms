from django.urls import path, include

from api.govorg import views as govorg_views
from api.public import views as public_views

app_name = 'api'
urlpatterns = [
    path('service/', include(([
        path('<str:token>/<int:pk>/', govorg_views.proxy, name='proxy'),
        path('WMS/<int:wms_id>', public_views.proxy, name='wms_proxy'),
    ], 'service'))),
]