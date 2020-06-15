from django.urls import re_path, path, include

from frontend.bundle import views as bundle_views
from frontend.суурь_давхарга import views as суурь_давхарга


urlpatterns = [

    path('', include(([
        path('', bundle_views.all, name='all'),
        path('дэд-сан/<int:pk>/', bundle_views.detail, name='detail'),
        path('дэд-сан/<int:pk>/давхаргууд/', bundle_views.wms_layers, name='wms-layers'),
    ], 'bundle'))),

    path('суурь-давхарга/', include(([
        path('', суурь_давхарга.all, name='all'),
    ], 'суурь-давхарга'))),

]
