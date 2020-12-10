import React, { Component } from 'react'

import 'ol/ol.css';
import {Map, Feature, View, Overlay} from 'ol';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {Draw, Modify, Select, Snap, DragBox, MouseWheelZoom} from 'ol/interaction'
import {OSM, Vector as VectorSource, TileWMS} from 'ol/source'
import {unByKey} from 'ol/Observable';
import {GeoJSON} from 'ol/format'
import {transform as transformCoordinate, toLonLat, fromLonLat} from 'ol/proj'
import {format as coordinateFormat, toStringHDMS, createStringXY} from 'ol/coordinate'
import {platformModifierKeyOnly} from 'ol/events/condition';
import * as geom_type from 'ol/geom'


import {ModifyBarButton} from './controls/Modify/ModifyBarButton'
import {LineBarButton} from './controls/Line/LineBarButton'
import {PointBarButton} from './controls/Point/PointBarButton'
import {PolygonBarButton} from './controls/Polygon/PolygonBarButton'
import {RemoveBarButton} from './controls/Remove/RemoveBarButton'
import {FormBarButton} from './controls/Forms/FormBarButton'
import {SaveBtn} from "./controls/Add/AddButton"
import {UploadButton} from './controls/FileUpload/UploadButton'
import {UploadBtn} from './controls/FileUpload/UploadPopUp'
import {MetaBarButton} from './controls/MetaData/MetaBarButton'
import {MetaList} from './controls/MetaData/MetaList'

import {CoordList} from './controls/CoordinateList/CordList'

import {SideBarBtn} from "./controls/SideBar/SideButton"
import {Sidebar} from "./controls/SideBar/SideBarButton"
import {Modal} from "../../../../src/components/MapModal/Modal"

import "./styles.css"
import { service } from './service'
import Маягт from "./Маягт"
import {Mongolia_boundary} from './MongoliaBorder'

export default class BarilgaSuurinGazar extends Component{

    constructor(props){
      super(props)

      this.featureNames = []
      this.featuresForCollection = []

      this.sendCoordinateList = [] //boxEnd
      this.turningPoint = [] //boxEnd
      this.inspire_roles = []
      this.property_ids = []

      this.state = {
          format: new GeoJSON(),
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857', 
          tid: props.match.params.tid,
          pid: props.match.params.pid,
          fid: props.match.params.fid,
          rows: [],
          roles:[],
          is_loading:true,
          featureID: null,
          featureID_list: [],
          remove_button_active: false,
          modify_button_active: false,
          selectedFeature_ID: null,
          modifyend_selected_feature_ID: null,
          modifyend_selected_feature_check: false,
          send: false,
          changedFeature: '',
          Mongolia: [11461613.630815497, 5878656.0228370065],
          chkbox: true,
          type: '',
          drawed: null,
          togle_islaod: true,
          geojson: {},
          null_form_isload: false,
          showUpload: false,
          is_sidebar_open: true,
          wms_map_list: [],
          isMeta: false,
          pointFeature: null,
          is_not_mongolia: false,
          update_geom_from_list: false,
      }

      this.controls = {
        modal: new Modal(),
        upload: new UploadBtn(),
        sidebar: new Sidebar(),
        metaList: new MetaList(),
        coordList: new CoordList(),
      }

      this.modifyE = this.Modify()
      this.drawE = this.Draw()
      this.addNotif = this.props.addNotif

      this.loadMap = this.loadMap.bind(this)
      this.loadData = this.loadData.bind(this)
      this.loadControls = this.loadControls.bind(this)
      this.loadRows = this.loadRows.bind(this)
      this.clearMap = this.clearMap.bind(this)
      this.updateGeom = this.updateGeom.bind(this)
      this.ModifyButton = this.ModifyButton.bind(this)
      this.LineButton = this.LineButton.bind(this)
      this.PointButton = this.PointButton.bind(this)
      this.PolygonButton = this.PolygonButton.bind(this)
      this.SaveBtn = this.SaveBtn.bind(this)
      this.RemoveButton = this.RemoveButton.bind(this)
      this.FormButton = this.FormButton.bind(this)
      this.remove = this.remove.bind(this)
      this.requestRemove = this.requestRemove.bind(this)
      this.removeModal = this.removeModal.bind(this)
      this.modifiedFeature = this.modifiedFeature.bind(this)
      this.featureSelected = this.featureSelected.bind(this)
      this.drawed = this.drawed.bind(this)
      this.snap = this.snap.bind(this)
      this.createGeom = this.createGeom.bind(this)
      this.showUploadBtn = this.showUploadBtn.bind(this)
      this.closeUploadBtn = this.closeUploadBtn.bind(this)
      this.SideBarBtn = this.SideBarBtn.bind(this)
      this.WmsTile = this.WmsTile.bind(this)
      this.mapPointerMove = this.mapPointerMove.bind(this)
      this.onClickCloser = this.onClickCloser.bind(this)
      this.MetaButton = this.MetaButton.bind(this)
      this.getRole = this.getRole.bind(this)
      this.flyTo = this.flyTo.bind(this)
      this.getTurningPoints = this.getTurningPoints.bind(this)
      this.DrawButton = this.DrawButton.bind(this)
      this.updateFromList = this.updateFromList.bind(this)
      this.transformToMapCoordinate = this.transformToMapCoordinate.bind(this)
      this.transformToLatLong = this.transformToLatLong.bind(this)
      this.callModalWithMeta = this.callModalWithMeta.bind(this)
      this.hideMetaList = this.hideMetaList.bind(this)
      this.hideShowList = this.hideShowList.bind(this)
      this.getTypeFunction = this.getTypeFunction.bind(this)

    }

    componentDidMount(){
      const {pid, fid} = this.state
      service.geomType(pid, fid).then(({type}) => {
          this.setState({ type })
        })
      this.loadRows()
      this.loadMap()
    }

    getRole(){
      const fid = this.state.fid
      var perm_approve = false
      var perm_create = false
      var perm_update = false
      var perm_remove = false
      var perm_revoke = false
      const properties = this.props.property
      if(properties){
        
        properties.forEach(property => {
          if(property.parent_id==fid){
                if (property.roles['PERM_CREATE']) perm_create = true
                if (property.roles['PERM_UPDATE']) perm_update = true
                if (property.roles['PERM_REMOVE']) perm_remove  = true
                if (property.roles['PERM_APPROVE']) perm_approve = true
                if (property.roles['PERM_REVOKE']) perm_revoke = true
                this.property_ids.push({
                  'property_id': property.id, 
                  'roles': {
                    'PERM_VIEW': property.roles['PERM_REVOKE'] ? true : false,
                    'PERM_UPDATE': property.roles['PERM_UPDATE'] ? true : false
                  }
              })
              }
          })

          this.inspire_roles.push({
            'PERM_CREATE': perm_create,
            'PERM_UPDATE': perm_update,
            'PERM_REMOVE': perm_remove,
            'PERM_APPROVE': perm_approve,
            'PERM_REVOKE': perm_revoke
          })

        this.loadControls()
      }
    }

    loadControls(){
      const map = this.map
      const {PERM_CREATE, PERM_UPDATE, PERM_REMOVE, PERM_APPROVE} = this.inspire_roles[0]
      const { type } = this.state
      map.addControl(new ScaleLine())
      map.addControl(this.controls.modal)
      if(PERM_CREATE){
        if(type.includes("Line")) map.addControl(new LineBarButton({LineButton: this.LineButton}))
        else if(type.includes("Point")) map.addControl(new PointBarButton({PointButton: this.PointButton}))
        else if(type.includes("Polygon")) map.addControl(new PolygonBarButton({PolygonButton: this.PolygonButton}))
        else {
          this.addNotif('warning', type, 'times')
          map.addControl(new LineBarButton({LineButton: this.LineButton, 'null': true}))
          map.addControl(new PointBarButton(({PointButton: this.PointButton, 'null': true})))
          map.addControl(new PolygonBarButton(({PolygonButton: this.PolygonButton, 'null': true})))
        }
      }
      if(PERM_CREATE || PERM_UPDATE) {
        map.addControl(new SaveBtn({SaveBtn: this.FormButton}))
        map.addControl(new MetaBarButton({MetaButton: this.MetaButton}))
        map.addControl(this.controls.upload)
        map.addControl(this.controls.metaList)
        map.addControl(this.controls.sidebar)
      }
      if(PERM_REMOVE) map.addControl(new RemoveBarButton({RemoveButton: this.RemoveButton}))

      map.addControl(new UploadButton({showUploadBtn: this.showUploadBtn}))
      map.addControl(new SideBarBtn({SideBarBtn: this.SideBarBtn}))

      if(PERM_UPDATE){
        map.addControl(this.controls.coordList)
        map.addControl(new FormBarButton({FormButton: this.FormButton}))
        map.addControl(new ModifyBarButton({ModifyButton: this.ModifyButton}))
      }
      if(PERM_APPROVE){
        if(type.includes("Line")) map.addControl(new LineBarButton({LineButton: this.LineButton}))
        else if(type.includes("Point")) map.addControl(new PointBarButton({PointButton: this.PointButton}))
        else if(type.includes("Polygon")) map.addControl(new PolygonBarButton({PolygonButton: this.PolygonButton}))
        else {
          this.addNotif('warning', type, 'times')
          map.addControl(new LineBarButton({LineButton: this.LineButton, 'null': true}))
          map.addControl(new PointBarButton(({PointButton: this.PointButton, 'null': true})))
          map.addControl(new PolygonBarButton(({PolygonButton: this.PolygonButton, 'null': true})))
        }
        map.addControl(new SaveBtn({SaveBtn: this.FormButton}))
        map.addControl(new MetaBarButton({MetaButton: this.MetaButton}))
        map.addControl(new RemoveBarButton({RemoveButton: this.RemoveButton}))
        map.addControl(new UploadButton({showUploadBtn: this.showUploadBtn}))
        map.addControl(new SideBarBtn({SideBarBtn: this.SideBarBtn}))
        map.addControl(new FormBarButton({FormButton: this.FormButton}))
        map.addControl(new ModifyBarButton({ModifyButton: this.ModifyButton}))
        map.addControl(this.controls.upload)
        map.addControl(this.controls.metaList)
        map.addControl(this.controls.sidebar)
      }

      this.setState({ is_loading:false})
    }
    loadData(){

        const rows = this.state.rows
        const map = this.map
        const styles = {
          'MultiPolygon': new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
            }),
            text: new Text({
              font: '15px Calibri,sans-serif',
              stroke: new Stroke({
                color: 'white',
                width: 3,
              }),
              textAlign: 'center'
            }),
          }),
          'Polygon': new Style({
            stroke: new Stroke({
              color: 'orange',
              width: 4,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
            }),
            text: new Text({
              font: '15px Calibri,sans-serif',
              stroke: new Stroke({
                color: 'white',
                width: 3,
              }),
              textAlign: 'center'
            }),
          }),
          'Point': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'blue',
              }),
            }),
            text: new Text({
              font: '8px Calibri,sans-serif',
              stroke: new Stroke({
                color: 'white',
                width: 3,
              }),
            }),
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
            text: new Text({
              font: '8px Calibri,sans-serif',
              stroke: new Stroke({
                color: 'white',
                width: 3,
              }),
            }),
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
            text: new Text({
              font: '8px Calibri,sans-serif',
              stroke: new Stroke({
                color: 'white',
                width: 3,
              }),
            }),
          }),
          'MultiPoint': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'orange',
              }),
            }),
            text: new Text({
              font: '8px Calibri,sans-serif',
              stroke: new Stroke({
                color: 'white',
                width: 3,
              }),
            }),
          }),
        };

      const features = []
      rows.map((row) => {
          const { id, geom } = row
          if (geom){
            const feature = (new GeoJSON().readFeatures(geom, {
                dataProjection: this.state.dataProjection,
                featureProjection: this.state.featureProjection,
            }))[0]
            feature.setProperties({ id })
            features.push(feature)
          }
      })

      const Mongolia_feaure = (new GeoJSON().readFeatures(Mongolia_boundary, {
          dataProjection: this.state.dataProjection,
          featureProjection: this.state.featureProjection,
      }))[0]
      Mongolia_feaure.setProperties({ id: 'Mongolia' })
      this.setState({ Mongolia_feaure })

      const vectorSource = new VectorSource({
        features: features,
      })
      const vectorLayer = new VectorLayer({
            name: 'vector_layer',
            source: vectorSource,
        })

      vectorLayer.setStyle((feature, resolution) => {
        let text = ''
        const type = feature.getGeometry().getType()
        if (type.includes('Point') || type.includes('Line')) {
          text = resolution < 400 ? feature.get('id') : ''
        } else {
          text = feature.get('id')
        }
        const styleWithType = styles[type]
        styleWithType.getText().setText(text)
        return styleWithType
      })

      map.addLayer(vectorLayer)
      this.snap(vectorLayer)
      this.vectorLayer = vectorLayer
      this.vectorSource = vectorSource
      this.getRole()
  }

    loadMap(){

      const raster = new TileLayer({
          source: new OSM(),
      })

      const vector = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33',
            }),
          }),
        }),
      })

        this.container = document.getElementById('popup')

       const overlay = new Overlay({
         element: this.container,
         autoPan: true,
         autoPanAnimation: {
           duration: 250,
         },
       });

      const map = new Map({
        layers: [raster, vector],
        target: 'map',
        view: new View({
          center: this.state.Mongolia,
          zoom: 5,
        }),
        overlays: [overlay],
      })
      this.map = map
      this.overlay = overlay
      this.vector = vector
      this.snap(vector)
      this.setState({ type: 'Point' })
      this.modifyE.funct()
    }


    Modify(){
      const init = () => {
        const select = new Select();
        this.map.addInteraction(select);
        select.on("select", event => this.featureSelected(event));

        const modify = new Modify({
          features: select.getFeatures(),
        })

        modify.on("modifystart", event => this.mapPointerMove(event));
        modify.on("modifyend", event => this.modifiedFeature(event));
        this.map.addInteraction(modify);

        this.select = select
        this.modify = modify
        this.modifyE.setEvents()
      }

      const setEvents = () => {
        var selectedFeatures = this.select.getFeatures();
        this.select.on('change:active', () => {
          selectedFeatures.forEach(function (each) {
            selectedFeatures.remove(each);
          });
        });
      }

      const setActive = (active) => {
        this.select.setActive(active);
        this.modify.setActive(active);
      }
      return { funct: init, setEvents: setEvents, setActive: setActive }
    }

    featureSelected(event){
      if(event.selected[0])
      {
        const { isMeta } = this.state
        if (!isMeta) {
          this.addNotif('warning', 'CTRL+MOUSE зэрэг дарж байгаад зурж цэгийн мэдээллийг харж болно', 'exclamation')
          this.removeTurning()
          const featureID_list = this.state.featureID_list
          const selectedFeature_ID = event.selected[0].getProperties()['id']
          this.DrawButton()
          this.setState({ send: true, featureID_list, selectedFeature_ID, modifyend_selected_feature_ID:selectedFeature_ID, null_form_isload:false, selected_feature: event.selected[0] })
          featureID_list.push(selectedFeature_ID)
          if(this.state.remove_button_active) this.removeModal()
        } else {
          const feature = event.selected[0]
          this.collectFeatures(feature)
        }
      }
      else
      {
        this.setState({ send: false })
      }
    }

    collectFeatures(feature) {
      const collection = this.select.getFeatures()
      this.featureNames.push(feature.get('id'))
      this.featuresForCollection.push(feature)
      this.featuresForCollection.map((feat, idx) => {
        collection.push(feat)
      })
      this.controls.metaList.showMetaList(true, this.featureNames, this.callModalWithMeta,  this.addNotif)
    }

    getTypeFunction(feature) {
      var features_multi = null
      if(feature.getType().includes("Polygon")) {
        features_multi = feature.getPolygons()
      }
      if(feature.getType().includes("Line")) {
        features_multi = feature.getLineStrings()
      }
      if(feature.getType().includes("Point")) {
        features_multi = feature.getPoints()
      }
      return features_multi
    }

    checkInMongolia(features) {
      var checkInMGL = true
      const { Mongolia_feaure } = this.state
      this.feature_coordinates = []
      const feature_type = features[0].getGeometry().getType()
      features.map((feature, idx) => {
        if (feature_type.includes('Multi')){
          const features_multi = this.getTypeFunction(feature.getGeometry())
          features_multi.map((feature_multi, idx) => {
            feature_multi.getCoordinates().map((coordiates, ix) => {
              this.feature_coordinates.push(coordiates)
            })
          })
        } else {
          feature.getGeometry().getCoordinates().map((coords, ix) => {
            this.feature_coordinates.push(coords)
          })
        }
      })
      if (feature_type.includes('Poly')) {
          this.feature_coordinates = this.feature_coordinates[0]
      }
      if (!feature_type.includes("Point")) {
        for(let i=0; i < this.feature_coordinates.length; i++) {
          const check = Mongolia_feaure.getGeometry().containsXY(this.feature_coordinates[i][0], this.feature_coordinates[i][1])
          if (!check) {
            checkInMGL = false
            break
          }
        }
      } else {
        const check = Mongolia_feaure.getGeometry().containsXY(this.feature_coordinates[0], this.feature_coordinates[1])
        if (!check) {
          checkInMGL = false
        }
      }
      return checkInMGL
    }

    modifiedFeature(event) {

      const features = event.features.getArray()
      const check = this.checkInMongolia(features)
      if (check) {
        this.setState({ is_not_mongolia: false })
        const {format} = this.state
        const data = format.writeFeatureObject(features[0], {
          dataProjection: this.state.dataProjection,
          featureProjection: this.state.featureProjection,
        })
        const changedFeature = JSON.stringify(data)
        this.setState({ changedFeature, modifyend_selected_feature_check: true })
      }
      else {
        this.setState({ xChange: null, yChange: null})
        this.setState({ is_not_mongolia: true })
        this.addNotif('warning', 'Монгол улсын газар нутагт байх ёстой', 'exclamation')
      }
      this.onClickCloser()
    }

    mapPointerMove(event) {
      const map = this.map
      const overlay = this.overlay
      const { content, is_not_mongolia } = this.state
      if (!is_not_mongolia) {
        this.content = document.getElementById('popup-content')
        this.key = map.on('pointermove', event => {
          var coordinate = event.coordinate
          const projection = event.map.getView().getProjection()
          const map_coord = transformCoordinate(coordinate, projection.code_, this.state.dataProjection)
          const yChange = coordinateFormat(map_coord, '{y}', 6)
          const xChange = coordinateFormat(map_coord, '{x}', 6)
          this.setState({ xChange, yChange})
          overlay.setPosition(coordinate)
        })
      } else {
        const features = this.vector.getSource().getFeatures();
        if(features.length > 0)
        {
            const lastFeature = features[features.length - 1];
            this.vector.getSource().removeFeature(lastFeature);
        }
      }
    }

    onClickCloser(){
      const overlay = this.overlay
      this.closer = document.getElementById('popup-closer')
      const closer = this.closer
      overlay.setPosition(undefined);
      closer.blur();
      unByKey(this.key);
    }

    loadRows() {
      service
          .rows(this.state.pid, this.state.fid)
          .then(({ rows }) => {
              this.setState({ rows })
              this.loadData()
          })
    }

    Draw(){
      const init = (elem) => {
        this.map.addInteraction(elem);
        elem.setActive(false);
      }
      const getActive = () => {
        return this.draw ? this.draw.getActive() : false;
      }
      const setActive = (active) => {
        if (active) {
          this.draw.setActive(true);
        } else {
          this.draw.setActive(false);
        }
      }
      return { init, getActive: getActive, setActive: setActive }
    }

    componentDidUpdate(prevProps, prevState) {
        const oid_old = prevProps.match.params.oid
        const old_roles = prevState.roles
        const roles = this.inspire_roles[0]
        const oid = this.props.match.params.oid
        const type = this.state.type
        if(prevState.type !== type){
          this.map.removeInteraction(this.draw);
          const draw = new Draw({
            source: this.vector.getSource(),
            type: type,
          })
          this.snap(this.vector)
          this.draw = draw
          draw.setActive(true);
          this.modifyE.setActive(false);
          this.drawE.init(draw)
          draw.on('drawstart', event => this.mapPointerMove(event))
          draw.on('drawend', event => this.drawed(event))
        }
        if (oid_old != oid) {
          this.setState({ oid }, () => {
              this.loadRows()
          })
        }
        if(old_roles != roles) {
          this.setState({
            roles
          })
        }
        if (prevState.changedFeature !== this.state.changedFeature) {
          this.setState({ changedFeature: this.state.changedFeature })
        }
    }

    snap(vector){
      const snap = new Snap({
        source: vector.getSource(),
      });
      this.map.addInteraction(snap);
    }

    drawed(event){
      const features = this.vector.getSource().getFeatures();
      this.setState({modifyend_selected_feature_ID: null})

      if(features.length > 0)
      {
          const lastFeature = features[features.length - 1];
          this.vector.getSource().removeFeature(lastFeature);
      }

      const feature = event.feature
      const check = this.checkInMongolia([feature])
      if (check) {
        this.setState({ is_not_mongolia: false })
        const featureID = this.state.featureID
        const format = this.state.format
        let area = format.writeFeatureObject(feature,  {
          dataProjection: this.state.dataProjection,
          featureProjection: this.state.featureProjection,
        })

        const drawed = JSON.stringify(area)
        this.setState({drawed, selectedFeature_ID: null, null_form_isload: true})
      } else {
        this.setState({ is_not_mongolia: true })
        this.addNotif('warning', 'Монгол улсын газар нутагт байх ёстой', 'exclamation')
      }
      this.onClickCloser()
    }

    clearMap() {
      const vector = this.vector
      vector.getSource().clear();
    }

    RemoveButton() {
      this.hideMetaList()
      this.drawE.setActive(false);
      this.modifyE.setActive(true);
      if(this.state.remove_button_active)
      {
        document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({ remove_button_active: false })
      }
      else
      {
        document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,9.5)'
        if(this.state.selectedFeature_ID) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({ remove_button_active: true, modify_button_active: false })
      }
    }

    FormButton(){
      this.setState(prevState => ({togle_islaod: !prevState.togle_islaod}))
    }

    removeModal(values){

      if(this.state.selectedFeature_ID){
          this.controls.modal.showModal(() => this.remove(values), true, "Тийм", `${this.state.selectedFeature_ID} дугаартай мэдээллийг хянуулах уу`, null, 'danger', "Үгүй")
      }
      else
      {
        if(this.state.drawed) this.controls.modal.showModal(this.remove, true, "Тийм", `Шинээр үүссэн цэгийг устгах уу`, null, 'danger', "Үгүй")
        else this.addNotif('danger', "Хоосон байна идэвхжүүлнэ үү", 'times')
      }
    }

    requestRemove(values) {
      const tid = this.state.tid
      const fid = this.state.fid
      const pid = this.state.pid
      const selectedFeature_ID = this.state.selectedFeature_ID
      service.createDel(tid, pid, fid, selectedFeature_ID, values).then(({ success }) => {
        if (success) {
          this.props.refreshCount()
          this.addNotif('success', 'Устгах хүсэлт үүслээ', 'check')
          this.setState({ featureID_list: [], selectedFeature_ID: null, togle_islaod: true })
        }
      })
    }

    remove(values){
      const vector = this.vector
      const vectorLayer = this.vectorLayer
      const {tid, fid, pid, selectedFeature_ID} = this.state

      const features_new = vector.getSource().getFeatures();
      const features = vectorLayer.getSource().getFeatures();

      if(selectedFeature_ID){
            this.setState({ togle_islaod: false })
      }
      else
      {
        if (features_new != null && features_new.length > 0) {
          features_new.map((x) => {
            var id = x.getProperties()['id']
            id == selectedFeature_ID && vector.getSource().removeFeature(x)
          })
          this.addNotif('success', "Шинээр үүссэн мэдээллийг устгав.", 'check')
          this.setState({featureID_list: [], drawed: null})
        }
      }
    }

    SaveBtn(form_values) {
      this.hideMetaList()
      const {modifyend_selected_feature_ID, modifyend_selected_feature_check, update_geom_from_list, build_name } = this.state
      if(modifyend_selected_feature_ID){
          if(modifyend_selected_feature_check || update_geom_from_list)
          {
              this.controls.modal.showModal(
                    () => this.updateGeom(form_values),
                    true,
                    "Тийм",
                    `${modifyend_selected_feature_ID || build_name} дугаартай мэдээллийг хянуулах уу`,
                    null, 
                    null,
                    "Үгүй"
              )
              this.setState({ modifyend_selected_feature_check: false, update_geom_from_list: false })
          }
          else{
            this.addNotif('warning', 'Өөрчлөлт алга байна.', 'exclamation')
          }
      }
      else{
        if(this.state.drawed) this.controls.modal.showModal(this.createGeom, true, "Тийм", "Мэдээллийг шинээр үүсгэх үү.", null, null, "Үгүй")
        else this.addNotif('warning', "Шинэ мэдээлэл алга байна.", 'exclamation')
      }
    }

    updateGeom(values){
      const {tid, fid, pid, is_not_mongolia} = this.state
      if (!is_not_mongolia) {
        const id = this.state.selectedFeature_ID
        const { changedFeature, changedJson } = this.state
        this.feature = ''
        if (changedJson) {
          this.feature = changedJson
        } else {
          this.feature = changedFeature
        }
        const json = JSON.parse(this.feature)
        const datas = json.geometry
        this.setState({ is_loading:true })
        service.createUpd(tid, pid, fid, values, datas, id).then(({success}) => {
          if(success){
            this.addNotif('success', 'Хүсэлтийг үүсгэлээ', 'check')
            this.props.refreshCount()
            this.setState({is_loading:false})
          }
          else {
            this.addNotif('danger', 'Хүсэлт үүсгэхэд алдаа гарсан байна', 'times')
            this.setState({is_loading:false})
          }
        })
      } else {
        this.addNotif('warning', 'Монгол улсын газарт байгаа эсэхийг шалгана уу', 'exclamation')
      }
    }

    createGeom(){
      const { is_not_mongolia } = this.state
      if (!is_not_mongolia) {
        const fid = this.state.fid
        const json = JSON.parse(this.state.drawed)
        const datas = json.geometry
          this.setState({ is_loading: false, geojson: datas, togle_islaod: false})
      } else {
        this.addNotif('warning', 'Монгол улсын газарт байгаа эсэхийг шалгана уу', 'exclamation')
      }
      this.is_save = true
    }

    ModifyButton(){
      if(this.state.modify_button_active){
        if(this.inspire_roles[0].PERM_UPDATE) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({modify_button_active: false})
      }
      else{
        if(this.inspire_roles[0].PERM_UPDATE) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,9.5)'
        if(this.inspire_roles[0].PERM_REMOVE) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({modify_button_active: true,  remove_button_active: false})
      }
      this.drawE.setActive(false);
      this.modifyE.setActive(true);
      this.hideMetaList()
    }

    LineButton(){
      if(this.inspire_roles[0].PERM_UPDATE) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      if(this.inspire_roles[0].PERM_REMOVE) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'LineString' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
      this.hideMetaList()
    }

    PointButton(){
      if(this.inspire_roles[0].PERM_UPDATE) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      if(this.inspire_roles[0].PERM_REMOVE) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'Point' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
      this.hideMetaList()
    }

    PolygonButton(){
      if(this.inspire_roles[0].PERM_UPDATE) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      if(this.inspire_roles[0].PERM_REMOVE) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'Polygon' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
      this.hideMetaList()
    }

    MetaButton() {
      this.drawE.getActive()
      this.drawE.setActive(false);
      this.modifyE.setActive(false);
      const map = this.map
      this.select.setActive(true)
      this.setState({ isMeta: true })
    }

    showUploadBtn(){
      this.controls.upload.showUpload(true, this.state.fid, this.closeUploadBtn, this.loadRows, this.addNotif, this.props.match.params.tid)
      this.setState({ showUpload: true })
    }

    closeUploadBtn(){
      this.controls.upload.showUpload(false)
      this.setState({ showUpload: false })
    }

    SideBarBtn(){
      const bundle_id = 7
      service.loadWMSLayers(bundle_id).then(({wms_list}) => {
        this.WmsTile(wms_list)
      })
    }

    WmsTile(wms_list){
      const map = this.map
      const wms_map_list = wms_list.map(({layers, url, name}) => {
        return {
            name,
            layers: layers.map((layer) => {
              return {
                ...layer,
                tile: new TileLayer({
                  source: new TileWMS({
                    url: url,
                      params: {
                        'LAYERS': layer.code,
                        //'FORMAT': 'image/svg+xml',
                        'FORMAT': 'image/png',
                    },
                    serverType: 'geoserver',
                    // Countries have transparency, so do not fade tiles:
                    transition: 0,
                  }),
                })
              }
          })
        }
      })
      this.setState({wms_map_list})
      wms_map_list.map((wms, idx) => {
        wms_map_list[idx].layers.map((layer,idx) => {
          map.addLayer(layer.tile)
          layer.defaultCheck == 0 && layer.tile.setVisible(false)
          layer['legend'] = layer.tile.getSource().getLegendUrl()
        })
      })
      const vectorLayer = this.vectorLayer
      vectorLayer.setZIndex(100)
      this.setState(prevState => ({
        is_sidebar_open: !prevState.is_sidebar_open,
      }))
      if(this.state.is_sidebar_open){
        this.controls.sidebar.showSideBar(wms_map_list, true)
      }else{
        this.controls.sidebar.showSideBar(wms_map_list, false)
      }
    }

    getTurningPoints(extent, feature) {
      var insideCoordinates = []
      var bound = ''
      if (extent) {
        bound = extent.getGeometry()
      }
      for (let i = 0; i < feature.length; i ++){
        const check = bound.containsXY(feature[i][0], feature[i][1])
        // const check = bound.intersectsExtent(feature.getGeometry().getExtent()) // ogtloltsdog eseh
        if (check) {
          var coord_info = {
            'coordinate': feature[i],
            'turning': i + 1
          }
          insideCoordinates.push(coord_info)
        }
      }
      return insideCoordinates
    }

    addMarker(coord) {
      const point_geom = coord.coordinate
      const point_turning = coord.turning.toString()
      const coordinate = [point_geom[0], point_geom[1]]
      const source = this.vectorSource

      const point = new geom_type.Point(coordinate)
      const feature = new Feature({
        geometry: point,
        id: "TurningPoint"
      });

      const style = new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: '#2F9A00',
          }),
        }),
        text: new Text({
          text: point_turning,
          font: '30px Calibri,sans-serif',
          stroke: new Stroke({
            color: 'white',
            width: 3,
          }),
          offsetY: -18
        }),
      });

      feature.setStyle(style)
      this.setState({ pointFeature: feature })
      source.addFeature(feature)
    }

    sendToShowList(data) {
      var coordinateList = null
      var name = null

      if (data['geometry']) {
        coordinateList = data['geometry'].getCoordinates()[0]
      } else {
        coordinateList = [data['geom']]
      }
      this.list = []
      const geom = this.transformToLatLong(coordinateList)
      geom.map((coordinate, idx) => {
        const rsp = {
          'geom': coordinate,
          'turning': data['turning'] ? data['turning'][idx] : null
        }
        this.list.push(rsp)
      })

      if (data['id']) {
        name = data['id']
      } else {
        name = this.state.build_name
      }
      const sendGeom = {
        "data": this.list,
        'id': name,
        'last': data['last'],
        'type': data['type'],
      }
      this.controls.coordList.showList(true, sendGeom, this.flyTo, () => this.listToModal(), this.updateFromList)
    }

    DrawButton() {
      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
      });
      this.map.addInteraction(dragBox);
      dragBox.setActive(true)
      dragBox.on('boxstart', () => this.BoxStart())
      dragBox.on('boxend', () => this.BoxEnd(dragBox))
      this.dragBox = dragBox
    }

    removeTurning() {
      const { pointFeature } = this.state
      if ( pointFeature !== null ) {
        const source = this.vectorSource
        const features = source.getFeatures()
        if (features != null && features.length > 0) {
          features.map((x) => {
            const id = x.getProperties()['id']
            id == pointFeature.get('id') && source.removeFeature(x)
          })
        }
        this.setState({ pointFeature: null })
      }
    }

    BoxStart() {
      this.removeTurning()
      const selectedFeatures = this.select.getFeatures();
      selectedFeatures.clear();
    }

    BoxEnd(dragBox) {
      const source = this.vectorSource
      const selectedFeatures = this.select.getFeatures();
      const {selected_feature} = this.state
      const extent = dragBox.getGeometry().getExtent();
      this.sendCoordinateList = []
      this.turningPoint = []
      source.forEachFeatureIntersectingExtent(extent, (feature) => {
        var feats = []
        const feat_type = feature.getGeometry().getType()
        this.feat_type = feat_type
        if (feat_type.includes('MultiPolygon')) {
          const feat_multi = this.getTypeFunction(feature.getGeometry())
          feat_multi.map((feature_multi, idx) => {
            feats.push(feature_multi)
          })
        } else {
          feats.push(feature)
        }
        feats.map((feat_mutli, idx) => {
          var checkBounds = null
          if (feat_type.includes('MultiPolygon')) {
            checkBounds = feat_mutli.getCoordinates()
          }
          else if (feat_type.includes('MultiPoint')){
            checkBounds = [feat_mutli.getGeometry().getCoordinates()]
          }
          else if (feat_type == 'Point'){
            checkBounds = [[feat_mutli.getGeometry().getCoordinates()]]
          }
          else {
            checkBounds = feat_mutli.getGeometry().getCoordinates()
          }
          checkBounds.map((checkBound, idx) => {
            const lastElement = checkBound.length
            this.lastElement = lastElement
            for (let i = 0; i < checkBound.length; i ++){
              const check = selected_feature.getGeometry().containsXY(checkBound[i][0], checkBound[i][1])
              if (check) {
                const coordinates = this.getTurningPoints(dragBox, checkBound)
                this.dupl = true
                if (coordinates.length > 0) {
                  if (this.turningPoint.length > 0) {
                    const duplicate = this.turningPoint.every((item) => {
                      const item_check = coordinates.map((coord, idx) => {
                        return coord.turning
                      })
                      if (item == item_check[0]) {
                        this.dupl = false
                      }
                    })
                  }
                  if (this.dupl) {
                    selectedFeatures.push(feature);
                    this.setState({ build_name: feature.get('id') })
                    coordinates.map((coordinate, i) => {
                      this.sendCoordinateList.push(coordinate.coordinate)
                      this.turningPoint.push(coordinate.turning)
                      if (!feat_type.includes("Point") && lastElement !== coordinate.turning) {
                        this.addMarker(coordinate)
                      }
                    })
                  }
                }
              }
            }
          })
        })
      });
      const data = {
        'geom': this.sendCoordinateList,
        'turning': this.turningPoint,
        'last': this.lastElement,
        'type': this.feat_type,
      }
      this.sendToShowList(data)
    }

    listToModal() {
      this.controls.modal.showModal(() => this.hideShowList(), true, "Тийм", `Буцахдаа итгэлтэй байна уу`, null, 'danger', "Үгүй")
    }

    hideShowList() {
      this.controls.coordList.showList(false)
      this.select.setActive(false)
      this.removeTurning()
    }

    transformToLatLong(coordinateList) {
      const geom = coordinateList[0].map((coord, idx) => {
          const map_coord = transformCoordinate(coord, this.state.featureProjection, this.state.dataProjection)
            return map_coord
      })
      return geom
    }

    transformToMapCoordinate(coordinateList) {
      const geom = coordinateList.map((coord, idx) => {
        const map_coord = transformCoordinate(coord, this.state.dataProjection, this.state.featureProjection)
          return map_coord
      })
      return geom
    }

    flyTo(point) {
      const map = this.map
      const duration = 2000;
      const view = map.getView()
      const zoom = 25
      const setPoint = fromLonLat(point)
      view.animate(
        {
          center: setPoint,
          duration: duration,
          zoom: zoom,
        },
      );
    }

    updateFromList(coord_list) {
      const source = this.vectorSource
      const id = coord_list.id
      const coords = coord_list.data.map(({geom, turning}) => {
        const conv_geom = transformCoordinate(geom, this.state.dataProjection, this.state.featureProjection)
        return {conv_geom, turning}
      })
      const {selected_feature} = this.state
      const feature_id = selected_feature.get('id')
      if (feature_id == id) {
        const getType = selected_feature.getGeometry().getType()
        var geom_coordinate = []
        if (getType.includes('MultiPolygon')) {
          geom_coordinate = selected_feature.getGeometry().getCoordinates()
        }
        else if (getType.includes('MultiPoint')){
          geom_coordinate = selected_feature.getGeometry().getCoordinates()
        }
        else if (getType == 'Point'){
          geom_coordinate = selected_feature.getGeometry().getCoordinates()
        }
        else {
          geom_coordinate = selected_feature.getGeometry().getCoordinates()
        }
        if (getType.includes('MultiPolygon')) {
          geom_coordinate.map((geo, idx) => {
            geo.map((g, ix) => {
              coords.map(({conv_geom, turning}) => {
                geom_coordinate[idx][ix][turning - 1] = conv_geom
              })
            })
          })
        }
        else if (getType == 'Point') {
          coords.map(({conv_geom}) => {
            geom_coordinate = conv_geom
          })
        } else if (getType == 'MultiPoint') {
          coords.map(({conv_geom, turning}) => {
            geom_coordinate[turning - 1] = conv_geom
          })
        }
        else {
          geom_coordinate.map((geo, idx) => {
            coords.map(({conv_geom, turning}) => {
              geom_coordinate[idx][turning - 1] = conv_geom
            })
          })
        }
        const geom = new geom_type[getType](geom_coordinate)
        const new_feature = new Feature({
          geometry: geom,
          id: feature_id
        })
        const check = this.checkInMongolia([new_feature])
        if (check) {
          source.removeFeature(selected_feature)
          source.addFeature(new_feature)
          const changedJson = this.writeFeat(new_feature)
          this.setState({ changedJson, is_not_mongolia: false, togle_islaod: false, update_geom_from_list: true })
          this.hideShowList()
        } else {
          this.setState({ is_not_mongolia: true })
          this.addNotif('warning', 'Монгол улсын газар нутагт байх ёстой', 'exclamation')
        }
      }
    }

    writeFeat(features) {
      const {format} = this.state
      const data = format.writeFeatureObject(features, {
        dataProjection: this.state.dataProjection,
        featureProjection: this.state.featureProjection,
      })
      const changedFeature = JSON.stringify(data)
      return changedFeature
    }

    callModalWithMeta(info, func) {
      let elemFunc = null
      if (func) elemFunc = func
      else elemFunc = this.hideMetaList
      this.controls.modal.showModal(elemFunc, true, "Тийм", info, null, 'danger', "Үгүй")
    }

    hideMetaList() {
      this.featureNames = []
      this.featuresForCollection = []
      if (this.state.isMeta) {
        this.controls.metaList.showMetaList(false)
      }
      this.setState({ isMeta: false })
      if (!this.state.modify_button_active) {
        this.select.setActive(false)
      }
    }

    render(){
        return (
            <div className="col-md-12">
                <div className={this.state.togle_islaod ? "toggled" : ""} id="wrapper-map" >
                  <div id="sidebar-wrapper-map" className="overflow-auto">
                    <div className="card-body">
                        <Маягт
                          tid = {this.props.match.params.tid}
                          pid = {this.props.match.params.pid}
                          fid = {this.props.match.params.fid}
                          geojson = {this.state.geojson}
                          roles = {this.inspire_roles[0]}
                          property_ids = {this.property_ids}
                          gid = {this.state.selectedFeature_ID}
                          togle_islaod = {this.state.togle_islaod}
                          null_form_isload = {this.state.null_form_isload}
                          addNotif = {this.addNotif}
                          SaveBtn={this.SaveBtn}
                          requestRefreshCount={this.props.refreshCount}
                          modifyend_selected_feature_check={this.state.modifyend_selected_feature_check}
                          requestRemove={this.requestRemove}
                          remove_button_active={this.state.remove_button_active}
                          update_geom_from_list={this.state.update_geom_from_list}
                        >
                        </Маягт>
                      </div>
                  </div>
                  <div className="content-wrapper-map">
                    <div id="map" className={(this.state.is_loading ? 'opac' : '')}></div>
                    <div id="popup" className="ol-popup">
                    <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                      <div id="popup-content">
                        <span>{this.state.xChange || ''}</span>
                        <span>{this.state.yChange || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.is_loading ? <span className="text-center d-block text-sp" style={{position:"fixed", top:"50%", left:"50%"}}> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </span> :null}
            </div>
        )
    }
}
