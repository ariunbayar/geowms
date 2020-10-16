import React, { Component } from 'react'

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON'
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {Draw, Modify, Select, Snap} from 'ol/interaction'
import {OSM, Vector as VectorSource} from 'ol/source'
import { Feature } from 'ol'
import { set } from 'ol/transform'

import {ModifyBarButton} from './controls/Modify/ModifyBarButton'
import {LineBarButton} from './controls/Line/LineBarButton'
import {PointBarButton} from './controls/Point/PointBarButton'
import {PolygonBarButton} from './controls/Polygon/PolygonBarButton'
import {RemoveBarButton} from './controls/Remove/RemoveBarButton'
import {SaveBtn} from "./controls/Add/AddButton"
import {Modal} from "../../../src/components/MapModal/Modal"

import "./styles.css"
import { service } from './service'

export default class BairZuinZurag extends Component{

    constructor(props){
      super(props)

      this.state = {
          format: new GeoJSON(),
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
          oid: this.props.match.params.oid,
          rows: [],
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
          drawed: null
      }

      this.controls = {
        modal: new Modal(),
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
      this.remove = this.remove.bind(this)
      this.removeModal = this.removeModal.bind(this)
      this.modifiedFeature = this.modifiedFeature.bind(this)
      this.featureSelected = this.featureSelected.bind(this)
      this.drawed = this.drawed.bind(this)
      this.snap = this.snap.bind(this)
      this.createGeom = this.createGeom.bind(this)
    }

    componentDidMount(){
      service
          .geomType(this.state.oid)
          .then(({ type }) => {
              this.setState({ type })
              this.loadControls()
          })
      this.loadRows()
      this.loadMap()
    }

    loadControls(){
      const map = this.map
      const { type } = this.state

      map.addControl(new ModifyBarButton({ModifyButton: this.ModifyButton}))
      map.addControl(new RemoveBarButton({RemoveButton: this.RemoveButton}))
      map.addControl(new SaveBtn({SaveBtn: this.SaveBtn}))
      map.addControl(this.controls.modal)

      if (type.includes("LINE"))
        map.addControl(new LineBarButton({LineButton: this.LineButton}))
      if (type.includes("POINT"))
        map.addControl(new PointBarButton({PointButton: this.PointButton}))
      if (type.includes("POLYGON"))
        map.addControl(new PolygonBarButton({PolygonButton: this.PolygonButton}))

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
          }),
          'Polygon': new Style({
            stroke: new Stroke({
              color: 'orange',
              width: 4,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
            }),
          }),
          'Point': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'blue',
              }),
            }),
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
          }),
          'MultiPoint': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'orange',
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
            style: (feature) => styles[feature.getGeometry().getType()],
        })

      map.addLayer(vectorLayer)
      this.snap(vectorLayer)
      this.vectorLayer = vectorLayer
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

      const map = new Map({
        layers: [raster, vector],
        target: 'map',
        view: new View({
          center: this.state.Mongolia,
          zoom: 5,
        }),
      })

      this.map = map
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
        this.setState({ send: true, featureID_list, selectedFeature_ID, modifyend_selected_feature_ID:selectedFeature_ID })
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
      const {format} = this.state
      const data = format.writeFeatureObject(features[0],  {
        dataProjection: this.state.dataProjection,
        featureProjection: this.state.featureProjection,
    })
      const changedFeature = JSON.stringify(data)
      this.setState({ changedFeature, modifyend_selected_feature_check: true })
    }

    loadRows() {
      service
          .rows(this.state.oid)
          .then(({ rows }) => {
              this.setState({ rows,  is_loading:false })
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
          draw.on('drawend', event => this.drawed(event))
        }
        if (oid_old != oid) {
          this.setState({ oid }, () => {
              this.loadRows()
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
      this.setState({drawed})
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
        document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({ remove_button_active: true, modify_button_active: false })
      }
    }
    removeModal(){
      if(this.state.selectedFeature_ID) this.controls.modal.showModal(this.remove, true, "Тийм", `${this.state.selectedFeature_ID} дугаартай мэдээллийг устгах уу`, null, 'danger', "Үгүй")
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
      const oid = this.state.oid
      if(selectedFeature_ID){
        service.remove(oid, selectedFeature_ID).then(({ success, info }) => {
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
            this.controls.modal.showModal(this.updateGeom, true, "Тийм", `${this.state.modifyend_selected_feature_ID} дугаартай мэдээллийг хадгалах уу`, null, null, "Үгүй")
            this.setState({modifyend_selected_feature_check: false})
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
      const id = this.state.selectedFeature_ID
      const oid = this.state.oid
      const json = JSON.parse(this.state.changedFeature)
      const datas = json.geometry
      this.setState({ is_loading:true })

      service.geomUpdate(datas, oid, id).then(({success, info}) => {
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

    createGeom(){
      const oid = this.state.oid
      const json = JSON.parse(this.state.drawed)
      const datas = json.geometry
      this.setState({ is_loading:true })

      service.geomAdd(datas, oid).then(({success, info, row_id}) => {
        if(success){
          {
            this.addNotif('success', info, 'check')
            this.setState({
              is_loading:false
            })
          }
          if(row_id){
            this.props.history.push(`/gov/байр-зүйн-зураг/${oid}/маягт/${row_id}/засах/`)
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

    ModifyButton(){
      if(this.state.modify_button_active){
        document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({modify_button_active: false})
      }
      else{
        document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,9.5)'
        document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
        this.setState({modify_button_active: true,  remove_button_active: false})
      }
      this.drawE.setActive(false);
      this.modifyE.setActive(true);
    }

    LineButton(){
      document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'LineString' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    PointButton(){
      document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'Point' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    PolygonButton(){
      document.getElementById('⚙-toggle-modify-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      document.getElementById('⚙-toggle-remove-id').style.backgroundColor = 'rgba(0,60,136,0.5)'
      this.setState({modify_button_active: false,  remove_button_active: false})
      this.setState({ type: 'Polygon' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    render(){
        return (
            <div className="col-md-12">
                  {this.state.is_loading ? <span className="text-center d-block"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </span> :null}
                  <div id="map"></div>
            </div>
        )
    }
}