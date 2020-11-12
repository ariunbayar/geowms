from django.urls import re_path, path, include

from govorg.backend.org import views as org_views
from govorg.backend.bundle import views as bundle_views
from govorg.backend.employee import views as employee_views
from govorg.backend.system import views as system_views
from govorg.backend.org_request import views as org_request_views
from  govorg.backend.govorg_inspire import views as govorg_inspire_views
from  govorg.backend.meta_data import views as meta_data_views

urlpatterns = [
    path('api/', include(([

        path('employee/', include(([
            path('', employee_views.employees, name='employees'),
        ], 'employee'))),
        path('system/', system_views.systemList, name='system'),
        path('bundle/', bundle_views.bundle, name='bundle'),
        path('inspire/', include(([
            path('', govorg_inspire_views.changeset_all),
            path('<int:pid>/<int:fid>/getRoles/', govorg_inspire_views.getRoles),
            path('table_list/', govorg_inspire_views.bundleButetsAll),
            path('<int:pid>/<int:fid>/rows/', govorg_inspire_views.rows),
            path('<int:pid>/<int:fid>/geom-type/', govorg_inspire_views.geom_type),
            path('<int:pid>/<int:fid>/add/', govorg_inspire_views.add),
            path('<int:pid>/<str:fid>/save/', govorg_inspire_views.save),
            path('create/', govorg_inspire_views.create),
            path('createDel/', govorg_inspire_views.createDel),
            path('createUpd/', govorg_inspire_views.createUpd),
            path('<str:pk>/<str:fid>/detail/', govorg_inspire_views.detail),
            path('<int:tid>/<int:pid>/<int:fid>/detail/', govorg_inspire_views.detailNone),
            path('<int:pid>/<int:fid>/remove/', govorg_inspire_views.delete),
            path('<int:fid>/geom-update/', govorg_inspire_views.updateGeom),
            path('<int:fid>/add-geom/', govorg_inspire_views.geomAdd),
            path('send-data/<int:tid>/<int:fid>/', govorg_inspire_views.FileUploadSaveData),
        ], 'inspire'))),

        path('org-request/', include(([
            path('', org_request_views.getAll, name="all"),
            path('change-request/', org_request_views.getChangeAll, name="change-request"),
            path('<int:pk>/delete/', org_request_views.requestDelete, name="delete"),
            path('<int:pk>/approve/', org_request_views.requestApprove, name="approve"),
            path('getCount/', org_request_views.getCount, name='getCount'),
        ], 'org-request'))),

        path('meta-data/', include(([
            path('', meta_data_views.all),
            path('<int:pk>/detail/', meta_data_views.detail),
            path('<int:pk>/delete/', meta_data_views.delete),
            path('<int:pk>/edit/', meta_data_views.edit),
            path('create/', meta_data_views.create),
        ], 'meta-data'))),

    ], 'back_org'))),


    path('', include(([
        path('', org_views.frontend, name='frontend'),
    ], 'org'))),

    re_path('^.*', org_views.frontend, name='org'),
]
