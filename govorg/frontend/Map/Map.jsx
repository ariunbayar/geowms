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
import {FormBarButton} from './controls/Forms/FormBarButton'
import {SaveBtn} from "./controls/Add/AddButton"
import {Modal} from "../../../src/components/MapModal/Modal"

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
          null_form_isload: false
      }

      this.controls = {
        modal: new Modal(),
      }

      this.modifyE = this.Modify()
      this.drawE = this.Draw()
      this.getRole = this.getRole.bind(this)
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
      

    }

    componentDidMount(){
      const {pid, fid} = this.state
      this.getRole(pid, fid)
      service
          .geomType(pid, fid)
          .then(({ type }) => {
              this.setState({ type })
              this.loadControls()
          })
      
      this.loadRows()
      this.loadMap()
    }

    getRole(pid, fid){
      service
          .getRole(pid, fid)
          .then(({ success, roles }) => {
              if(success){
                this.setState({
                  roles
                })
              }
          })

    }


    loadControls(){
      const map = this.map
      const { type, roles } = this.state
      map.addControl(this.controls.modal)
      if(roles[1]){
        if(type.includes("Line")) map.addControl(new LineBarButton({LineButton: this.LineButton}))
        if(type.includes("Point")) map.addControl(new PointBarButton({PointButton: this.PointButton}))
        if(type.includes("Polygon")) map.addControl(new PolygonBarButton({PolygonButton: this.PolygonButton}))
      }
      if(roles[1] || roles[3]) map.addControl(new SaveBtn({SaveBtn: this.SaveBtn}))
      if(roles[2]) map.addControl(new RemoveBarButton({RemoveButton: this.RemoveButton}))
      
      if(roles[3]){
        map.addControl(new FormBarButton({FormButton: this.FormButton}))
        map.addControl(new ModifyBarButton({ModifyButton: this.ModifyButton}))
      }
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
          .rows(this.state.pid, this.state.fid)
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
      const tid = this.state.tid
      const fid = this.state.fid
      const pid = this.state.pid
      if(selectedFeature_ID){
          if(this.state.roles[4] || this.state.roles[5] || this.state.roles[6]){
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
      const {tid, fid, pid} = this.state
      const id = this.state.selectedFeature_ID
      const json = JSON.parse(this.state.changedFeature)
      const datas = json.geometry
      this.setState({ is_loading:true })
      if(this.state.roles[4] || this.state.roles[5] || this.state.roles[6]){
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
      if(this.state.roles[4] || this.state.roles[5] || this.state.roles[6]){
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
                    <div id="map"></div>
                  </div>
                </div>
                {this.state.is_loading ? <span className="text-center d-block" style={{position:"fixed", top:"50%", left:"50%"}}> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </span> :null}
            </div>
        )
    }
}