from django.urls import re_path, path, include

from govorg.backend.org import views as org_views
from govorg.backend.bundle import views as bundle_views
from govorg.backend.employee import views as employee_views
from govorg.backend.system import views as system_views
from govorg.backend.bair_zuin_zurag import views as bair_zuin_zurag_views
from govorg.backend.barilga_suurin_gazar import views as barilga_suurin_gazar_views
from govorg.backend.ded_butets import views as ded_butets_veiws
from govorg.backend.teevriin_suljee import views as teevriin_suljee_views
from govorg.backend.org_request import views as org_request_views

import govorg.backend.barilga_suurin_gazar.views
from  govorg.backend.govorg_inspire import views as govorg_inspire_views

urlpatterns = [
    path('api/', include(([

        path('employee/', employee_views.employees, name='employees'),
        path('system/', system_views.systemList, name='system'),
        path('bundle/', bundle_views.bundle, name='bundle'),

        path('bair_zuin_zurag/', include(([
            path('', govorg.backend.bair_zuin_zurag.views.changeset_all),
            path('table_list/', govorg.backend.bair_zuin_zurag.views.table_list),
            path('<int:oid>/rows/', govorg.backend.bair_zuin_zurag.views.rows),
            path('<int:oid>/geom-type/', govorg.backend.bair_zuin_zurag.views.geom_type),
            path('<int:oid>/<str:pk>/save/', govorg.backend.bair_zuin_zurag.views.save),
            path('<int:oid>/add/', govorg.backend.bair_zuin_zurag.views.add),
            path('<int:oid>/<str:pk>/remove/', govorg.backend.bair_zuin_zurag.views.delete),
            path('<int:oid>/<str:pk>/detail/', govorg.backend.bair_zuin_zurag.views.detail),
            path('<int:oid>/<str:pk>/geom-update/', govorg.backend.bair_zuin_zurag.views.updateGeom),
            path('<int:oid>/add-geom/', govorg.backend.bair_zuin_zurag.views.geomAdd),
        ], 'bair_zuin_zurag'))),


        path('barilga_suurin_gazar/', include(([
            path('', govorg.backend.barilga_suurin_gazar.views.changeset_all),
            path('table_list/', govorg.backend.barilga_suurin_gazar.views.bundleButetsAll),
            path('<int:pid>/<int:fid>/rows/', govorg.backend.barilga_suurin_gazar.views.rows),
            path('<int:pid>/<int:fid>/geom-type/', govorg.backend.barilga_suurin_gazar.views.geom_type),
            path('<int:pid>/<int:fid>/add/', govorg.backend.barilga_suurin_gazar.views.add),
            path('<int:pid>/<str:fid>/save/', govorg.backend.barilga_suurin_gazar.views.save),
            path('<str:pk>/detail/', govorg.backend.barilga_suurin_gazar.views.detail),
            path('<int:pid>/<int:fid>/remove/', govorg.backend.barilga_suurin_gazar.views.delete),
            path('<int:fid>/geom-update/', govorg.backend.barilga_suurin_gazar.views.updateGeom),
            path('<int:fid>/add-geom/', govorg.backend.barilga_suurin_gazar.views.geomAdd),
        ], 'barilga_suurin_gazar'))),

        path('ded_butets/', include(([
            path('', govorg.backend.ded_butets.views.changeset_all),
            path('table_list/', govorg.backend.ded_butets.views.table_list),
            path('<int:oid>/rows/', govorg.backend.ded_butets.views.rows),
            path('<int:oid>/geom-type/', govorg.backend.ded_butets.views.geom_type),
            path('<int:oid>/add/', govorg.backend.ded_butets.views.add),
            path('<int:oid>/<str:pk>/save/', govorg.backend.ded_butets.views.save),
            path('<int:oid>/<str:pk>/detail/', govorg.backend.ded_butets.views.detail),
            path('<int:oid>/<str:pk>/remove/', govorg.backend.ded_butets.views.delete),
            path('<int:oid>/<str:pk>/geom-update/', govorg.backend.ded_butets.views.updateGeom),
            path('<int:oid>/add-geom/', govorg.backend.ded_butets.views.geomAdd),
        ], 'ded_butets'))),

        path('teevriin_suljee/', include(([
            path('', govorg.backend.teevriin_suljee.views.changeset_all),
            path('table_list/', govorg.backend.teevriin_suljee.views.table_list),
            path('<int:oid>/rows/', govorg.backend.teevriin_suljee.views.rows),
            path('<int:oid>/geom-type/', govorg.backend.teevriin_suljee.views.geom_type),
            path('<int:oid>/<str:pk>/save/', govorg.backend.teevriin_suljee.views.save),
            path('<int:oid>/add/', govorg.backend.teevriin_suljee.views.add),
            path('<int:oid>/<str:pk>/detail/', govorg.backend.teevriin_suljee.views.detail),
            path('<int:oid>/<str:pk>/remove/', govorg.backend.teevriin_suljee.views.delete),
            path('<int:oid>/<str:pk>/geom-update/', govorg.backend.teevriin_suljee.views.updateGeom),
            path('<int:oid>/add-geom/', govorg.backend.teevriin_suljee.views.geomAdd),
        ], 'teevriin_suljee'))),
        
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
            
        ], 'inspire'))),

        path('org-request/', include(([
            path('', org_request_views.getAll),
            path('<int:pk>/delete/', org_request_views.requestDelete),
            path('<int:pk>/approve/', org_request_views.requestApprove),
        ], 'org-request'))),

    ], 'back_org'))),


    path('', include(([
        path('', org_views.frontend, name='frontend'),
    ], 'org'))),

    re_path('^.*', org_views.frontend, name='org'),
]
