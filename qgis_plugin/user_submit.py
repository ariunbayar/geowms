# -*- coding: utf-8 -*-
"""
/***************************************************************************
 User_Login
                                 A QGIS plugin
 identify user login information
 Generated by Plugin Builder: http://g-sherman.github.io/Qgis-Plugin-Builder/
                              -------------------
        begin                : 2020-09-23
        git sha              : $Format:%H$
        copyright            : (C) 2020 by Utility Solution
        email                : sdelgermaa47@gmail.com
 ***************************************************************************/

/***************************************************************************
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 ***************************************************************************/
"""
import json
import os.path
import psycopg2
import requests
from PyQt5.QtWidgets import QMessageBox
from qgis.PyQt.QtCore import QSettings, QTranslator, QCoreApplication
from qgis.PyQt.QtGui import QIcon
from qgis.PyQt.QtWidgets import QAction
from qgis.core import QgsProject, QgsCoordinateReferenceSystem, QgsCoordinateTransform, QgsDataSourceUri, QgsProviderRegistry
from qgis.core import QgsProject, QgsFeature, QgsFeatureRequest, QgsExpression
from .resources import *
import datetime
import re

class UserSubmit:
    """QGIS Plugin Implementation."""

    def __init__(self, iface):
        """Constructor.

        :param iface: An interface instance that will be passed to this class
            which provides the hook by which you can manipulate the QGIS
            application at run time.
        :type iface: QgsInterface
        """
        self.iface = iface
        # initialize plugin directory
        self.plugin_dir = os.path.dirname(__file__)
        # initialize locale
        locale = QSettings().value('locale/userLocale')[0:2]
        locale_path = os.path.join(
            self.plugin_dir,
            'i18n',
            'User_Login_{}.qm'.format(locale))

        if os.path.exists(locale_path):
            self.translator = QTranslator()
            self.translator.load(locale_path)
            QCoreApplication.installTranslator(self.translator)

        # Declare instance attributes
        self.actions = []
        self.menu = self.tr(u'&User Login')
        # Check if plugin was started the first time in current QGIS session
        # Must be set in initGui() to survive plugin reloads
        self.first_start = None
        self.submit_url = ''

    def tr(self, message):
        """Get the translation for a string using Qt translation API.

        We implement this ourselves since we do not inherit QObject.

        :param message: String for translation.
        :type message: str, QString

        :returns: Translated version of message.
        :rtype: QString
        """
        # noinspection PyTypeChecker,PyArgumentList,PyCallByClass
        return QCoreApplication.translate('User_Login', message)


    def add_action(
        self,
        icon_path,
        text,
        callback,
        enabled_flag=True,
        add_to_menu=True,
        add_to_toolbar=True,
        status_tip=None,
        whats_this=None,
        parent=None):
        """Add a toolbar icon to the toolbar.

        :param icon_path: Path to the icon for this action. Can be a resource
            path (e.g. ':/plugins/foo/bar.png') or a normal file system path.
        :type icon_path: str

        :param text: Text that should be shown in menu items for this action.
        :type text: str

        :param callback: Function to be called when the action is triggered.
        :type callback: function

        :param enabled_flag: A flag indicating if the action should be enabled
            by default. Defaults to True.
        :type enabled_flag: bool

        :param add_to_menu: Flag indicating whether the action should also
            be added to the menu. Defaults to True.
        :type add_to_menu: bool

        :param add_to_toolbar: Flag indicating whether the action should also
            be added to the toolbar. Defaults to True.
        :type add_to_toolbar: bool

        :param status_tip: Optional text to show in a popup when mouse pointer
            hovers over the action.
        :type status_tip: str

        :param parent: Parent widget for the new action. Defaults None.
        :type parent: QWidget

        :param whats_this: Optional text to show in the status bar when the
            mouse pointer hovers over the action.

        :returns: The action that was created. Note that the action is also
            added to self.actions list.
        :rtype: QAction
        """

        icon = QIcon(icon_path)
        action = QAction(icon, text, parent)
        action.triggered.connect(callback)
        action.setEnabled(enabled_flag)

        if status_tip is not None:
            action.setStatusTip(status_tip)

        if whats_this is not None:
            action.setWhatsThis(whats_this)

        if add_to_toolbar:
            # Adds plugin icon to Plugins toolbar
            self.iface.addToolBarIcon(action)

        if add_to_menu:
            self.iface.addPluginToVectorMenu(
                self.menu,
                action)

        self.actions.append(action)

        return action

    def initGui(self):
        """Create the menu entries and toolbar icons inside the QGIS GUI."""
        icon_path = ':/plugins/user_login/icon.png'

        self.add_action(
            icon_path,
            text=self.tr(u'User login '),
            callback=self.run,
            parent=self.iface.mainWindow())

        # will be set False in run()
        self.first_start = True


    def unload(self):
        """Removes the plugin menu item and icon from QGIS GUI."""
        for action in self.actions:
            self.iface.removePluginVectorMenu(
                self.tr(u'&User Login'),
                action)
            self.iface.removeToolBarIcon(action)


    def run(self):
        """Run method that performs all the real work"""

        # Create the dialog with elements (after translation) and keep reference
        # Only create GUI ONCE in callback, so that it will only load when the plugin is started
        if self.first_start == True:
            self.first_start = False
            self.activ_layer()


    def get_update_items(self, layer, projection, xform, changed_geom, fieldnames):
        updates = []
        change_geoms = changed_geom.changedGeometries()
        for j, feature_geom in change_geoms.items():
            feature_geom.transform(xform)
            for feature in layer.getFeatures(QgsFeatureRequest(j)):
                attributes = {}
                for j in range(len(layer.fields())):
                    attributes[str(fieldnames[j])] = str(feature[str(fieldnames[j])])
                updates.append({
                    "geom": feature_geom.asJson(),
                    "att": attributes,
                    "projection": projection if projection else ''
                })

        return updates


    def get_delete_items(self, layer, projection, xform, changed_geom, fieldnames):
        deletes = []
        delete_ids = changed_geom.deletedFeatureIds()
        for feature in layer.dataProvider().getFeatures(QgsFeatureRequest().setFilterFids(delete_ids)):
            geom = feature.geometry()
            geom.transform(xform)
            attributes = {}
            for j in range(len(layer.fields())):
                attributes[str(fieldnames[j])] = str(feature[str(fieldnames[j])])
            deletes.append({
                "geom": geom.asJson(),
                "att": attributes,
                "projection": projection if projection else ''
            })

        return deletes

    def get_create_items(self, layer, projection, xform, changed_geom, fieldnames):
        create = []
        for feature in layer.getFeatures():
            attrs = feature.attributes()
            if not attrs[0]:
                attributes = {}
                geom = feature.geometry()
                for j in range(len(layer.fields())):
                    attributes[str(fieldnames[j])] = str(feature[str(fieldnames[j])])
                create.append({
                    "geom": geom.asJson(),
                    "att": attributes,
                    "projection": projection if projection else ''
                })
        return create


    def submit(self, data, layer_name):
        try:
            rsp = requests.post(self.submit_url + 'qgis-submit/', data=data, verify=False)
            if rsp.json():
                check = rsp.json()
                if check['success']:
                    QMessageBox.about(self.iface.mainWindow(), 'Мэдэгдэл', layer_name[:-2] + '. Амжилттай хадгаллаа. <a href="https://nsdi.gov.mn/gov/history/">Энд дарж</a> хүсэлтээ баталгаажуулна уу.')
                else:
                    QMessageBox.about(self.iface.mainWindow(), 'Мэдэгдэл', layer_name[:-2] + ',' + check['msg'])
        except Exception:
            QMessageBox.about(self.iface.mainWindow(), 'Мэдэгдэл', layer_name[:-2] + ', Холболт ажилтгүй боллоо')


    def activ_layer(self):
        active_layers = self.iface.mapCanvas().layers()
        if not active_layers:
            return
        layer_name = ''
        updates = []
        deletes = []
        creates = []
        for layer in active_layers:
            data_source_uri = layer.dataProvider().dataSourceUri(expandAuthConfig=False)
            match_result = re.search("(?P<url>https?://[^\s]+)", data_source_uri)
            if match_result:
                wfs_url = match_result.group("url")[:-1]
                if wfs_url.find('/api/qgis/') > 0 and wfs_url:
                    self.submit_url = wfs_url
                    layer_name = layer_name + layer.name() + ', '
                    changed_geom = layer.editBuffer()
                    fieldnames = [field.name() for field in layer.fields()]
                    projection = layer.crs().authid()
                    xform = QgsCoordinateTransform(QgsCoordinateReferenceSystem(projection), QgsCoordinateReferenceSystem("EPSG:4326"), QgsProject.instance())
                    if changed_geom:
                        updates = self.get_update_items(layer, projection, xform, changed_geom, fieldnames)
                        deletes = self.get_delete_items(layer, projection, xform, changed_geom, fieldnames)

                    creates = self.get_create_items(layer, projection, xform, changed_geom, fieldnames)


        data = {'update': json.dumps(updates), 'delete': json.dumps(deletes), 'create': json.dumps(creates)}
        self.submit(data, layer_name)

