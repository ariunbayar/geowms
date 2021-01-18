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
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'
import Tile from 'ol/layer/Tile'
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
import {CancelBarButton} from './controls/Cancel/CancelBarButton'
import {QgisButton} from './controls/QgisLink/QgisButton'
import {QgisModal} from './controls/QgisLink/QgisPopUp'
import {CoordList} from './controls/CoordinateList/CordList'
import {SideBarBtn} from "./controls/SideBar/SideButton"
import {Sidebar} from "./controls/SideBar/SideBarButton"
import {Modal} from "../../../../src/components/MapModal/Modal"
import { service } from './service'
import Маягт from "./Маягт"
import {Mongolia_boundary} from './MongoliaBorder'
import "./styles.css"

export default class BarilgaSuurinGazar extends Component{

    constructor(props){
      super(props)

      this.featureNames = []
      this.featuresForCollection = []

      this.sendCoordinateList = [] //boxEnd
      this.turningPoint = [] //boxEnd

      this.state = {
          format: new GeoJSON(),
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
          tid: props.match.params.tid,
          pid: props.match.params.pid,
          fid: props.match.params.fid,
          button_ids: [
            'side', 'remove', 'qgis',
            'polygon', 'point', 'modify',
            'meta', 'form', 'upload',
            'shapeDraw', 'cancel', 'add'
          ],
          roles:[],
          is_loading:true,
          featureID: null,
          featureID_list: [],
          remove_button_active: false,
          cancel_button_active: false,
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
          map_wms: [],
          vector_layer: null,
          draw_is_active: false,
          wms_layer: {},
          layer_choices: [],
          emp_perm_prefix: '',
          wms_url: '',
          wfs_url: ''
      }

      this.controls = {
        modal: new Modal(),
        upload: new UploadBtn(),
        qgis: new QgisModal(),
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
      this.CancelButton = this.CancelButton.bind(this)
      this.FormButton = this.FormButton.bind(this)
      this.remove = this.remove.bind(this)
      this.requestRemove = this.requestRemove.bind(this)
      this.requestCancel = this.requestCancel.bind(this)
      this.removeModal = this.removeModal.bind(this)
      this.cancelModal = this.cancelModal.bind(this)
      this.modifiedFeature = this.modifiedFeature.bind(this)
      this.featureSelected = this.featureSelected.bind(this)
      this.drawed = this.drawed.bind(this)
      this.snap = this.snap.bind(this)
      this.createGeom = this.createGeom.bind(this)
      this.showUploadBtn = this.showUploadBtn.bind(this)
      this.showQgisBtn = this.showQgisBtn.bind(this)
      this.closeQgisBtn = this.closeQgisBtn.bind(this)
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
      this.setInActiveButtonStyle = this.setInActiveButtonStyle.bind(this)
      this.getTypeFunction = this.getTypeFunction.bind(this)
      this.handleMapClick = this.handleMapClick.bind(this)
      this.showFeaturesAt = this.showFeaturesAt.bind(this)
    }

    componentDidMount(){
      const {pid, fid} = this.state
      service.qgisGetUrl().then(({wms_url, wfs_url}) => {
        this.setState({ wms_url, wfs_url })
      })
      service.geomType(pid, fid).then(({type}) => {
        this.setState({ type })
        this.loadRows()
      })
      this.loadMap()
    }

    getRole(){
      const fid = this.state.fid

      service
          .getRole(fid)
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
      if(roles.PERM_CREATE){
        if(type.includes("Line") || type.includes("MultiLine")) map.addControl(new LineBarButton({LineButton: this.LineButton}))
        else if(type.includes("Point") || type.includes("MultiPoint")) map.addControl(new PointBarButton({PointButton: this.PointButton}))
        else if(type.includes("Polygon") || type.includes("MultiPolygon")) map.addControl(new PolygonBarButton({PolygonButton: this.PolygonButton}))
        else {
          this.addNotif('warning', type, 'times')
          map.addControl(new LineBarButton({LineButton: this.LineButton, 'null': true}))
          map.addControl(new PointBarButton(({PointButton: this.PointButton, 'null': true})))
          map.addControl(new PolygonBarButton(({PolygonButton: this.PolygonButton, 'null': true})))
        }
      }
      if(roles.PERM_CREATE || roles.PERM_UPDATE) {
        map.addControl(new SaveBtn({SaveBtn: this.FormButton}))
        map.addControl(new MetaBarButton({MetaButton: this.MetaButton}))
        map.addControl(this.controls.upload)
        map.addControl(this.controls.qgis)
        map.addControl(this.controls.metaList)
        map.addControl(this.controls.sidebar)
      }
      if(roles.PERM_REMOVE) map.addControl(new RemoveBarButton({RemoveButton: this.RemoveButton}))
      if(roles.PERM_REVOKE) map.addControl(new CancelBarButton({CancelButton: this.CancelButton}))

      map.addControl(new UploadButton({showUploadBtn: this.showUploadBtn}))
      map.addControl(new SideBarBtn({SideBarBtn: this.SideBarBtn}))
      map.addControl(new QgisButton({showQgisBtn: this.showQgisBtn}))

      if(roles.PERM_UPDATE){
        map.addControl(this.controls.coordList)
        map.addControl(new FormBarButton({FormButton: this.FormButton}))
        map.addControl(new ModifyBarButton({ModifyButton: this.ModifyButton}))
      }
      this.setState({ is_loading:false, roles})
    }

    loadData(){

      const wms_layer = this.state.wms_layer
      this.setState({emp_perm_prefix: wms_layer.url})

      const map_wms = {
        tile: new Tile({
        source: new TileWMS({
            projection: this.state.projection,
            url: wms_layer.url,
            params: {
                'LAYERS': wms_layer.code,
                'FORMAT': 'image/png',
            }
        }),
      })}

      this.setState({map_wms})
      this.map.addLayer(map_wms.tile);

      const Mongolia_feaure = (new GeoJSON().readFeatures(Mongolia_boundary, {
          dataProjection: this.state.dataProjection,
          featureProjection: this.state.featureProjection,
      }))[0]

      Mongolia_feaure.setProperties({ id: 'Mongolia' })
      this.setState({ Mongolia_feaure })
      this.getRole()
    }

    loadMap(){
      const vector_layer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            stroke: new Stroke({
                color: 'rgba(100, 255, 0, 1)',
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(100, 255, 0, 0.3)'
            })
        })
      })
      this.setState({vector_layer})
      vector_layer.setZIndex(101)
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
        layers: [
          raster,
          vector,
          vector_layer
        ],
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
      this.vector_layer = vector_layer
      this.snap(vector)
      this.setState({ type: 'Point' })
      this.modifyE.funct()
    }

    handleMapClick(event) {
      const coordinate = event.coordinate
      if(!this.state.draw_is_active) this.showFeaturesAt(coordinate)
    }

    showFeaturesAt(coordinate) {
      const view = this.map.getView()
      const projection = view.getProjection()
      const resolution = view.getResolution()
      this.setState({pay_modal_check: false})
      const map_wms = this.state.map_wms
      const wms_source = map_wms.tile.getSource()
      const url = wms_source.getFeatureInfoUrl(
          coordinate,
          resolution,
          projection,
          {
              'INFO_FORMAT': 'application/vnd.ogc.gml',
          }
      )
      if (url) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
              const parser = new WMSGetFeatureInfo()
              const features = parser.readFeatures(text)
              if(features.length > 0){
                const source = new VectorSource({
                    features: features
                });
                const feature_info = features.map((feature) => {
                    const geometry_name = feature.getGeometryName()
                    const values =
                        feature.getKeys()
                        .filter((key) => key != geometry_name)
                        .map((key) => [key, feature.get(key)])
                    return [feature.getId(), values]
                })
                if(feature_info.length > 0 ){
                  feature_info.map(([layer_name, values], idx) => {
                    values.map(([field, value], val_idx) => {
                      if(field == 'inspire_id'){
                        if(this.state.selectedFeature_ID != value)
                        {
                          this.state.vector_layer.setSource(source)
                        }
                        this.setState({selectedFeature_ID: value})
                      }
                    })
                  })
                }
              }
          })
      } else {
          /* TODO */
          console.log('no feature url', wms_source);
      }
    }

    Modify(){
      const init = () => {
        const select = new Select();
        this.map.on('click', this.handleMapClick)
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
          if (this.state.modify_button_active) this.addNotif('warning', 'CTRL+MOUSE зэрэг дарж байгаад зурж цэгийн мэдээллийг харж болно', 'exclamation')
          this.removeTurning()
          const featureID_list = this.state.featureID_list
          if (this.state.modify_button_active) this.DrawButton()
          const selectedFeature_ID = this.state.selectedFeature_ID
          this.setState({ send: true, featureID_list, selectedFeature_ID, modifyend_selected_feature_ID:selectedFeature_ID, null_form_isload:false, selected_feature: event.selected[0] })
          featureID_list.push(selectedFeature_ID)
          if(this.state.remove_button_active) this.removeModal()
          if(this.state.cancel_button_active){
            const geom_for_revoke = event.selected[0]
            this.setState({ geom_for_revoke })
            this.cancelModal()
          }
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
      this.featureNames.push(feature.get('inspire_id'))
      this.featuresForCollection.push(feature)
      this.featuresForCollection.map((feat, idx) => {
        collection.push(feat)
      })
      this.controls.metaList.showMetaList(true, this.featureNames, this.callModalWithMeta, this.addNotif)
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
          .getWmsLayer(this.state.tid, this.state.pid, this.state.fid)
          .then((wms_layer) => {
              this.setState({ wms_layer })
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
        if (prevState.changedFeature !== this.state.changedFeature) {
          this.setState({ changedFeature: this.state.changedFeature })
        }
    }

    setInActiveButtonStyle(active_id, second_active_id) {
      const { button_ids } = this.state
      if (active_id) {
        document.getElementById('⚙-toggle-' + active_id + '-id').style.backgroundColor = 'rgba(0,60,136,9.5)'
        button_ids.map((in_active, idx) => {
          if (in_active != active_id && in_active != second_active_id) {
            const element = document.getElementById('⚙-toggle-' + in_active + '-id')
            if (element) {
              element.style.backgroundColor = 'rgba(0,60,136,0.5)'
            }
          }
        })
      }
      else {
        button_ids.map((in_active, idx) => {
          const element = document.getElementById('⚙-toggle-' + in_active + '-id')
          if (element) {
            element.style.backgroundColor = 'rgba(0,60,136,0.5)'
          }
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
      this.setState({draw_is_active: false})
      if(this.state.remove_button_active)
      {
        this.setState({ remove_button_active: false })
        this.setInActiveButtonStyle()
      }
      else
      {
        this.setInActiveButtonStyle('remove')
        this.setState({ remove_button_active: true, modify_button_active: false, cancel_button_active: false })
      }
    }

    FormButton(add){
      const { remove_button_active, togle_islaod, modify_button_active } = this.state
      if(add) {
        this.setInActiveButtonStyle(add)
      }
      else {
        if (remove_button_active) {
          this.setInActiveButtonStyle('form', 'remove')
        }
        if (modify_button_active) {
          this.setInActiveButtonStyle('form', 'modify')
        }
        if (!remove_button_active && !modify_button_active) {
          this.setInActiveButtonStyle('form')
        }
      }
      if (!togle_islaod && remove_button_active) {
        this.setInActiveButtonStyle('remove')
      }
      else if (!togle_islaod && modify_button_active) {
        this.setInActiveButtonStyle('modify')
      }
      else if (!togle_islaod && !remove_button_active && !modify_button_active) {
        this.setInActiveButtonStyle()
      }
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
      service.createDel(tid, pid, fid, selectedFeature_ID, values).then(({ success, info}) => {
        if (success) {
          this.props.refreshCount()
          this.addNotif('success', info, 'check')
          this.setState({ featureID_list: [], selectedFeature_ID: null, togle_islaod: true })
        }
      else{
        this.addNotif('danger', info, 'warning')
        this.setState({ featureID_list: [], selectedFeature_ID: null, togle_islaod: true })
      }
      })
    }

    remove(values){
      const vector = this.vector
      const {tid, fid, pid, selectedFeature_ID} = this.state

      const features_new = vector.getSource().getFeatures();

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

    CancelButton() {
      this.hideMetaList()
      this.drawE.setActive(false);
      this.modifyE.setActive(true);
      if (this.state.cancel_button_active) {
        this.setState({ cancel_button_active: false })
        this.setInActiveButtonStyle()
        this.modifyE.setActive(false);
      }
      else {
        this.setInActiveButtonStyle('cancel')
        this.setState({ cancel_button_active: true, modify_button_active: false })
      }
    }

    cancelModal(){

      if(this.state.selectedFeature_ID){
          this.controls.modal.showModal(() => this.setState({ togle_islaod: false }), true, "Тийм", `${this.state.selectedFeature_ID} дугаартай мэдээллийг цуцлах уу`, null, 'danger', "Үгүй")
      }
      else
      {
        if(this.state.drawed) this.controls.modal.showModal(() => this.setState({ togle_islaod: false }), true, "Тийм", `Шинээр үүссэн цэгийг цуцлах уу`, null, 'danger', "Үгүй")
        else this.addNotif('danger', "Хоосон байна идэвхжүүлнэ үү", 'times')
      }
    }

    requestCancel(order_at, number, form_json) {
      const {tid, fid, pid, selectedFeature_ID, geom_for_revoke} = this.state
      const geo_json = this.writeFeat(geom_for_revoke)

      const parsed_geojson = JSON.parse(geo_json).geometry
      const form_values = new Object()
      form_values['form_values'] = form_json

      service.cancel(pid, fid, tid, selectedFeature_ID, parsed_geojson, form_values, number, order_at).then(({ success, info }) => {
        if (success) {
          this.addNotif('success', info, 'check')
          this.setState({ featureID_list: [], selectedFeature_ID: null, togle_islaod: true })
          this.props.refreshCount()
        }
        else {
          this.addNotif('danger', info, 'times')
        }
      })
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
                    "warning",
                    "Үгүй"
              )
              this.setState({ modifyend_selected_feature_check: false, update_geom_from_list: false })
          }
          else{
            this.addNotif('warning', 'Өөрчлөлт алга байна.', 'exclamation')
          }
      }
      else{
        if(this.state.drawed) this.controls.modal.showModal(this.createGeom, true, "Тийм", "Мэдээллийг шинээр үүсгэх үү.", null, "warning", "Үгүй")
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
        service.createUpd(tid, pid, fid, values, datas, id).then(({success, info}) => {
          if(success){
            this.addNotif('success', info, 'check')
            this.props.refreshCount()
            this.setState({is_loading:false})
          }
          else {
            this.addNotif('danger', info, 'times')
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
        this.setState({modify_button_active: false})
        this.setInActiveButtonStyle()
      }
      else {
        this.setInActiveButtonStyle('modify')
        this.DrawButton()
        this.setState({modify_button_active: true, remove_button_active: false, cancel_button_active: false})
      }
      this.setState({draw_is_active: false})
      this.drawE.setActive(false);
      this.modifyE.setActive(true);
      this.hideMetaList()
    }

    LineButton(){
      this.setInActiveButtonStyle('line')
      this.setState({modify_button_active: false, remove_button_active: false, cancel_button_active: false})
      this.setState({ type: 'LineString' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
      this.hideMetaList()
    }

    PointButton(){
      this.setInActiveButtonStyle('point')
      this.setState({modify_button_active: false,  remove_button_active: false, cancel_button_active: false})
      this.setState({ type: 'Point' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
      this.hideMetaList()
    }

    PolygonButton(){
      this.setInActiveButtonStyle('polygon')
      this.setState({modify_button_active: false,  remove_button_active: false, cancel_button_active: false})
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
      this.select.setActive(true)
      if (this.state.isMeta) {
        this.hideMetaList()
        this.setInActiveButtonStyle()
      }
      else {
        this.setInActiveButtonStyle('meta')
        this.setState({ isMeta: true, draw_is_active: false })
      }
    }

    showUploadBtn(){
      this.setInActiveButtonStyle('upload')
      this.controls.upload.showUpload(true, this.state.fid, this.closeUploadBtn, this.loadRows, this.addNotif, this.props.match.params.tid)
      this.setState({ showUpload: true })
    }

    showQgisBtn(){
      this.setInActiveButtonStyle('qgis')
      this.controls.qgis.showUpload(true, this.closeQgisBtn, this.addNotif, this.state.wfs_url, this.state.wms_url)
    }

    closeQgisBtn(){
      this.controls.qgis.showUpload(false)
    }

    closeUploadBtn(){
      this.controls.upload.showUpload(false)
      this.setState({ showUpload: false })
    }

    SideBarBtn(){
      this.setInActiveButtonStyle('side')
      service.getLayers(this.state.emp_perm_prefix).then((layer_choices) => {
        this.setState({layer_choices})
        this.WmsTile(layer_choices)
      })
    }

    WmsTile(layer_choices){
      const map = this.map
      const wms_map_list = {
            name: "Таны харах эрхтэй давхаргууд",
            layers: layer_choices.slice(1, layer_choices.length).map((layer) => {
              return {
                ...layer,
                tile: new TileLayer({
                  source: new TileWMS({
                    url: this.state.emp_perm_prefix,
                      params: {
                        'LAYERS': layer.code,
                        'FORMAT': 'image/png',
                    },
                    serverType: 'geoserver',
                    transition: 0,
                  }),
                })
              }
          })
        }

      this.setState({wms_map_list})
      wms_map_list.layers.map((layer, idx) => {
        map.addLayer(layer.tile)
        layer.tile.setVisible(false)
        layer['legend'] = layer.tile.getSource().getLegendUrl()
      })

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
      const source = this.vector_layer.getSource()

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
      source.addFeature(feature)

      this.setState({ pointFeature: feature })
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
        const source = this.vector_layer.getSource()
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
      const {selected_feature} = this.state
      const selectedFeatures = this.select.getFeatures();
      const extent = dragBox.getGeometry().getExtent();
      this.sendCoordinateList = []
      this.turningPoint = []
      const feat_type = selected_feature.getGeometry().getType()
      this.feat_type = feat_type
      var feature = []
      if (feat_type.includes('MultiPolygon')) {
        const feat_multi = this.getTypeFunction(selected_feature.getGeometry())
        feat_multi.map((feature_multi, idx) => {
          feature = feature_multi
        })
      } else {
        feature = selected_feature
      }
      var checkBounds = null
      if (feat_type.includes('MultiPolygon')) {
        checkBounds = feature.getCoordinates()
      }
      else if (feat_type.includes('MultiPoint')){
        checkBounds = [feature.getGeometry().getCoordinates()]
      }
      else if (feat_type == 'Point'){
        checkBounds = [[feature.getGeometry().getCoordinates()]]
      }
      else {
        checkBounds = feature.getGeometry().getCoordinates()
      }
      checkBounds.map((checkBound, idx) => {
        const lastElement = checkBound.length
        this.lastElement = lastElement
        const coordinates = this.getTurningPoints(dragBox, checkBound)
        selectedFeatures.push(selected_feature);
        this.setState({ build_name: selected_feature.get('inspire_id'), coord_list_geom: checkBound })
        coordinates.map((coordinate, i) => {
          this.sendCoordinateList.push(coordinate.coordinate)
          this.turningPoint.push(coordinate.turning)
          if (feat_type.includes("Line") ||
              (
                !feat_type.includes("Point") &&
                  (feat_type.includes("Polygon") &&
                  lastElement !== coordinate.turning)
              )) {
            this.addMarker(coordinate)
          }
        })
      })
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

      const id = coord_list.id
      const coords = coord_list.data.map(({geom, turning}) => {
        const conv_geom = transformCoordinate(geom, this.state.dataProjection, this.state.featureProjection)
        return {conv_geom, turning}
      })
      const {selected_feature} = this.state
      const feature_id = selected_feature.get('inspire_id')
      if (feature_id == id) {
        const getType = selected_feature.getGeometry().getType()
        const geom_coordinate = selected_feature.getGeometry().getCoordinates()
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
        const changedJson = this.writeFeat(new_feature)
        this.setState({ changedJson, is_not_mongolia: false, update_geom_from_list: true, null_form_isload: false })
        this.FormButton()
        this.hideShowList()
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
                          tid={this.props.match.params.tid}
                          pid={this.props.match.params.pid}
                          fid={this.props.match.params.fid}
                          geojson={this.state.geojson}
                          gid={this.state.selectedFeature_ID}
                          togle_islaod={this.state.togle_islaod}
                          null_form_isload={this.state.null_form_isload}
                          addNotif={this.addNotif}
                          SaveBtn={this.SaveBtn}
                          requestRefreshCount={this.props.refreshCount}
                          modifyend_selected_feature_check={this.state.modifyend_selected_feature_check}
                          requestRemove={this.requestRemove}
                          requestCancel={this.requestCancel}
                          remove_button_active={this.state.remove_button_active}
                          cancel_button_active={this.state.cancel_button_active}
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