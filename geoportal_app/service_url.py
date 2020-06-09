from django.urls import path
from geoportal_app import views

urlpatterns = [
    path('serv1', views.service1, name='service1'),
    path('serv2', views.service2, name='service2'),
    # path('page/<int:t>', views.showPage, name="showpage"),
]