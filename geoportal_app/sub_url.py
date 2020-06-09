from django.urls import path
from geoportal_app import views

urlpatterns = [
    path('sub1', views.sub1, name='sub1'),
    path('sub2', views.sub2, name='sub2'),
]