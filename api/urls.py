from django.urls import path, include

from api.govorg import views as govorg_views


app_name = 'api'
urlpatterns = [

    path('govorg/', include(([
        path('<str:token>/<int:pk>/', govorg_views.proxy, name='proxy'),
    ], 'govorg'))),

]
