import React, { Component } from 'react'

import 'ol/ol.css';
import {Map, Feature, View, Overlay} from 'ol';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {Draw, Modify, Select, Snap, DragBox} from 'ol/interaction'
import {OSM, Vector as VectorSource, TileWMS} from 'ol/source'
import {unByKey} from 'ol/Observable';
import {GeoJSON} from 'ol/format'
import {transform as transformCoordinate, toLonLat, fromLonLat} from 'ol/proj'
import {format as coordinateFormat, toStringHDMS, createStringXY} from 'ol/coordinate'
import {platformModifierKeyOnly} from 'ol/events/condition';
import {containsXY} from 'ol/extent'
import {Point} from 'ol/geom'

import {ModifyBarButton} from './controls/Modify/ModifyBarButton'
import {LineBarButton} from './controls/Line/LineBarButton'
import {PointBarButton} from './controls/Point/PointBarButton'
import {PolygonBarButton} from './controls/Polygon/PolygonBarButton'
import {RemoveBarButton} from './controls/Remove/RemoveBarButton'
import {FormBarButton} from './controls/Forms/FormBarButton'
import {SaveBtn} from "./controls/Add/AddButton"
import {UploadButton} from './controls/FileUpload/UploadButton'
import {UploadBtn} from './controls/FileUpload/UploadPopUp'
import {CoordList} from './controls/CoordinateList/CordList'
import {DrawButton} from './controls/CoordinateList/drawButton'

import {SideBarBtn} from "./controls/SideBar/SideButton"
import {Sidebar} from "./controls/SideBar/SideBarButton"
import {Modal} from "../../../../src/components/MapModal/Modal"

import "./styles.css"
import { service } from './service'
import Маягт from "./Маягт"

export default class BarilgaSuurinGazar extends Component{

    constructor(props){
      super(props)

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
          wms_map_list: []
      }

      this.controls = {
        modal: new Modal(),
        upload: new UploadBtn(),
        sidebar: new Sidebar(),
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
      this.getRole = this.getRole.bind(this)
      this.flyTo =  this.flyTo.bind(this)
      this.getTurningPoints = this.getTurningPoints.bind(this)
      this.DrawButton = this.DrawButton.bind(this)

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
      const {pid, fid} = this.state
      service
          .getRole(pid, fid)
          .then(({ success, roles }) => {
              if(success){
                this.loadControls(roles)
              }
          })
    }

    loadControls(roles){
      const map = this.map
      const { type } = this.state
      map.addControl(new ScaleLine())
      map.addControl(this.controls.modal)
      if(roles[1]){
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
      if(roles[1] || roles[3]) {
        map.addControl(new SaveBtn({SaveBtn: this.SaveBtn}))
        map.addControl(this.controls.upload)
        map.addControl(this.controls.sidebar)
      }
      if(roles[2]) map.addControl(new RemoveBarButton({RemoveButton: this.RemoveButton}))

      map.addControl(new UploadButton({showUploadBtn: this.showUploadBtn}))
      map.addControl(new SideBarBtn({SideBarBtn: this.SideBarBtn}))

      if(roles[3]){
        map.addControl(this.controls.coordList)
        map.addControl(new FormBarButton({FormButton: this.FormButton}))
        map.addControl(new DrawButton({DrawButton: this.DrawButton}))
        map.addControl(new ModifyBarButton({ModifyButton: this.ModifyButton}))
      }
      this.setState({ is_loading:false, roles })
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
        this.select.on('change:active', function () {
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
        const featureID_list = this.state.featureID_list
        const selectedFeature_ID = event.selected[0].getProperties()['id']
        this.sendToShowList(event.selected[0].getProperties())
        this.setState({ send: true, featureID_list, selectedFeature_ID, modifyend_selected_feature_ID:selectedFeature_ID, null_form_isload:false })
        featureID_list.push(selectedFeature_ID)
        if(this.state.remove_button_active) this.removeModal()
      }
      else
      {
        this.setState({ send: false })
      }
    }

    modifiedFeature(event) {

      const features = event.features.getArray()
      this.sendToShowList(features[0].getProperties())
      const {format} = this.state
      const data = format.writeFeatureObject(features[0], {
        dataProjection: this.state.dataProjection,
        featureProjection: this.state.featureProjection,
      })
      const changedFeature = JSON.stringify(data)
      this.setState({ changedFeature, modifyend_selected_feature_check: true })
      this.onClickCloser()
    }

    mapPointerMove(event) {
      const map = this.map
      const overlay = this.overlay
      const { content } = this.state
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
        const roles = this.state.roles
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
      const featureID = this.state.featureID
      const format = this.state.format
      let area = format.writeFeatureObject(feature,  {
        dataProjection: this.state.dataProjection,
        featureProjection: this.state.featureProjection,
      })

      const drawed = JSON.stringify(area)
      this.setState({drawed, selectedFeature_ID: null})
      this.onClickCloser()
    }

    clearMap() {
      const vector = this.vector
      vector.getSource().clear();
    }

    RemoveButton() {
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

    removeModal(){

      if(this.state.selectedFeature_ID){
        if(this.state.roles[6]){
          this.controls.modal.showModal(this.remove, true, "Тийм", `${this.state.selectedFeature_ID} дугаартай мэдээллийг хянуулах уу`, null, 'danger', "Үгүй")
        }else{
          this.controls.modal.showModal(this.remove, true, "Тийм", `${this.state.selectedFeature_ID} дугаартай мэдээллийг устгах уу`, null, 'danger', "Үгүй")
        }
      }
      else
      {
        if(this.state.drawed) this.controls.modal.showModal(this.remove, true, "Тийм", `Шинээр үүссэн цэгийг устгах уу`, null, 'danger', "Үгүй")
        else this.addNotif('danger', "Хоосон байна идэвхжүүлнэ үү", 'times')
      }
    }

    remove(){
      const vector = this.vector
      const vectorLayer = this.vectorLayer
      const selectedFeature_ID = this.state.selectedFeature_ID
      var features_new = vector.getSource().getFeatures();
      var features = vectorLayer.getSource().getFeatures();
      const tid = this.state.tid
      const fid = this.state.fid
      const pid = this.state.pid
      if(selectedFeature_ID){
          if(this.state.roles[6]){
            service.createDel(tid, pid, fid, selectedFeature_ID).then(({ success }) => {
              if (success) {
                this.addNotif('success', 'Амжилттай', 'check')
                this.setState({featureID_list: [], selectedFeature_ID: null})
              }
            })
          }
          else{
            service.remove(pid, fid, selectedFeature_ID).then(({ success, info }) => {
              if (success) {
                this.addNotif('success', info, 'check')
                this.setState({featureID_list: [], selectedFeature_ID: null})
                if (features != null && features.length > 0) {
                  features.map((x) => {
                    const id = x.getProperties()['id']
                    id == selectedFeature_ID && vectorLayer.getSource().removeFeature(x)
                  })
                }
              }
            })
          }
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

    SaveBtn(){
      if(this.state.modifyend_selected_feature_ID){
          if(this.state.modifyend_selected_feature_check)
          {
            if(this.state.roles[6]){
              this.controls.modal.showModal(this.updateGeom, true, "Тийм", `${this.state.modifyend_selected_feature_ID} дугаартай мэдээллийг хянуулах уу`, null, null, "Үгүй")
              this.setState({modifyend_selected_feature_check: false})
            }
            else{
              this.controls.modal.showModal(this.updateGeom, true, "Тийм", `${this.state.modifyend_selected_feature_ID} дугаартай мэдээллийг хадгалах уу`, null, null, "Үгүй")
              this.setState({modifyend_selected_feature_check: false})
            }
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

    updateGeom(){
      const {tid, fid, pid} = this.state
      const id = this.state.selectedFeature_ID
      const json = JSON.parse(this.state.changedFeature)
      const datas = json.geometry
      this.setState({ is_loading:true })
      if(this.state.roles[6]){
        service.createUpd(tid, pid, fid, null, datas, id).then(({success}) => {
          if(success){
            this.addNotif('success', 'Амжилттай', 'check')
            this.setState({is_loading:false})
          }
          else {
            this.addNotif('danger', 'Амжилтгүй', 'times')
            this.setState({is_loading:false})
          }
        })
      }
      else{
        service.geomUpdate(datas, fid, id).then(({success, info}) => {
          if(success){
            this.addNotif('success', info, 'check')
            this.setState({
              is_loading:false
            })
          }
          else {
            this.addNotif('danger', info, 'times')
            this.setState({
              is_loading:false
            })
          }
        })
      }
    }

    createGeom(){
      const fid = this.state.fid
      const json = JSON.parse(this.state.drawed)
      const datas = json.geometry
      this.setState({ is_loading:true })
      if(this.state.roles[6]){
        this.setState({ is_loading:false, geojson: datas, null_form_isload: true, togle_islaod: false})
      }
      else
      {
        service.geomAdd(datas, fid).then(({success, info, id}) => {
          if(success){
            {
              this.addNotif('success', info, 'check')
              this.setState({
                is_loading:false
              })
            }
            if(id && this.state.roles[3]){
              this.setState({selectedFeature_ID: id, togle_islaod: false})
            }
          }
          else
          {
            this.addNotif('danger', info, 'times')
            this.setState({
              is_loading:false
            })
          }
        })
      }
    }

    ModifyButton(){
      if(this.state.modify_button_active){
        if(this.state.roles[3]) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({modify_button_active: false})
      }
      else{
        if(this.state.roles[3]) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,9.5)'
        if(this.state.roles[2]) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({modify_button_active: true,  remove_button_active: false})
      }
      this.drawE.setActive(false);
      this.modifyE.setActive(true);
    }

    LineButton(){
      if(this.state.roles[3]) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      if(this.state.roles[2]) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'LineString' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    PointButton(){
      if(this.state.roles[3]) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      if(this.state.roles[2]) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'Point' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    PolygonButton(){
      if(this.state.roles[3]) document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      if(this.state.roles[2]) document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'Polygon' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
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
          layer.tile.setVisible(false)
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
      const coordinates = feature.getGeometry().getCoordinates()[0]
      var bound = ''
      if (extent) {
        bound = extent.getGeometry()
      }
      for (let i = 0; i < coordinates.length; i ++){
        const check = bound.containsXY(coordinates[i][0], coordinates[i][1])
        // const check = bound.intersectsExtent(feature.getGeometry().getExtent()) // ogtloltsdog eseh
        if (check) {
          var coord_info = {
            'coordinate': coordinates[i],
            'turning': i
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

      const point = new Point(coordinate)
      const feature = new Feature({
        geometry: point,
        id: "tetst"
      });

      const style = new Style({
        text: new Text({
          text: point_turning,
          font: '30px Calibri,sans-serif',
          stroke: new Stroke({
            color: 'white',
            width: 3,
          }),
        }),
      });

      feature.setStyle(style)
      source.addFeature(feature)
      const data = {
        'geom': point_geom,
        'turning': point_turning
      }
      this.sendToShowList(data)
    }

    sendToShowList(data) {
      var coordinateList = null
      var name = null
      if (data['geometry']) {
        coordinateList = data['geometry'].getCoordinates()[0]
      } else {
        coordinateList = [data['geom']]
      }
      console.log(coordinateList, 'list');
      const geom = this.transformToLatLong(coordinateList)
      console.log(data['id'], this.state.build_name);
      if (data['id']) {
        name = data['id']
      } else {
        name = this.state.build_name
      }
      const sendGeom = {
        "geom": geom,
        'id': name,
        'turning': data['turning'] ? data['turning'] : null
      }
      this.controls.coordList.showList(true, sendGeom, this.flyTo, this.hideShowList)
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

    BoxStart() {
      const selectedFeatures = this.select.getFeatures();
      selectedFeatures.clear();
    }

    BoxEnd(dragBox) {
      const source = this.vectorSource
      const selectedFeatures = this.select.getFeatures();
      const extent = dragBox.getGeometry().getExtent();
      source.forEachFeatureIntersectingExtent(extent, (feature) => {
        const coordinates = this.getTurningPoints(dragBox, feature)
        if (coordinates.length > 0) {
          this.setState({ build_name: feature.get('id') })
          coordinates.map((coordinate, idx) => {
            console.log(coordinate);
            this.addMarker(coordinate)
          })
          selectedFeatures.push(feature);
        }
      });
    }

    hideShowList() {
      this.controls.coordList.showList(false)
    }

    transformToLatLong(coordinateList) {
      const geom = coordinateList.map((coord, idx) => {
        const map_coord = transformCoordinate(coord, this.state.featureProjection, this.state.dataProjection)
        return map_coord
      })
      return geom
    }

    flyTo(point) {
      const map = this.map
      const duration = 2000;
      const view = map.getView()
      // const zoom = view.getZoom()
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
                          roles = {this.state.roles}
                          gid = {this.state.selectedFeature_ID}
                          togle_islaod = {this.state.togle_islaod}
                          null_form_isload = {this.state.null_form_isload}
                          addNotif = {this.addNotif}
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