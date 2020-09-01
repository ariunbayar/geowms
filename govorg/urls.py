from django.urls import re_path, path, include

from govorg.org import views as org_views

urlpatterns = [
      path('', include(([
        path('all/', org_views.all, name='all'),
        path('system/', org_views.system, name='system'),
        path('employees/', org_views.employees, name='employees'),
    ], 'org'))),
]
