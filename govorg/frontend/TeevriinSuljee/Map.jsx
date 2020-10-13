import React, { Component } from 'react';
import 'ol/ol.css';
import "./styles.css"
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Draw, Modify, Select, Snap} from 'ol/interaction';
import {OSM, Vector as VectorSource} from 'ol/source';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { service } from './service';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import {ModifyButton} from './controls/Modify/ModifyButton'
import {ModifyBarButton} from './controls/Modify/ModifyBarButton'
import {LineBarButton} from './controls/Line/LineBarButton'
import {LineButton} from './controls/Line/LineButton'
import {PointBarButton} from './controls/Point/PointBarButton'
import {PointButton} from './controls/Point/PointButton'
import {PolygonBarButton} from './controls/Polygon/PolygonBarButton'
import {PolygonButton} from './controls/Polygon/PolygonButton'
import {RemoveBarButton} from './controls/Remove/RemoveBarButton'
import {RemoveButton} from './controls/Remove/RemoveButton'
import { set } from 'ol/transform';
import {Modal} from "../../../src/components/MapModal/Modal"
import {AddButton} from "./controls/Add/AddButton"

export default class TeevriinSuljee extends Component{

    constructor(props){
      super(props)
      this.type = 'Point'
      this.state = {
          format: new GeoJSON(),
          GeoJson: [],
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
          tables: [{"table_name": "test_point"}, {"table_name": "test_polygon"}],
          select_table:'',
          is_sidebar_open: false,
          oid: this.props.match.params.oid,

          rows: [],

          featureID: null,
          featureID_list: [],
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
        modifyBtn: new ModifyButton(),
        lineBtn: new LineButton(),
        pointBtn: new PointButton(),
        polygonBtn: new PolygonButton(),
        removeBtn: new RemoveButton(),
        modal: new Modal(),
      }

      this.modifyE = this.ExampleModify()
      this.drawE = this.ExampleDraw()

      this.loadMap = this.loadMap.bind(this)
      this.loadData = this.loadData.bind(this)
      this.loadRows = this.loadRows.bind(this)
      this.clearMap = this.clearMap.bind(this)
      this.remove = this.remove.bind(this)
      this.saveData = this.saveData.bind(this)
      this.updateGeom = this.updateGeom.bind(this)
      this.ModifyButton = this.ModifyButton.bind(this)
      this.LineButton = this.LineButton.bind(this)
      this.PointButton = this.PointButton.bind(this)
      this.PolygonButton = this.PolygonButton.bind(this)
      this.AddButton = this.AddButton.bind(this)
      this.RemoveButton = this.RemoveButton.bind(this)
      this.modifiedFea = this.modifiedFea.bind(this)
      this.featureSelected = this.featureSelected.bind(this)
      this.drawed = this.drawed.bind(this)
      this.snap = this.snap.bind(this)
      this.createGeom = this.createGeom.bind(this)
    }

    componentDidMount(){
      this.loadMap()
      this.loadRows()
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
        rows.map((value) => {
          const styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
          };
          const geoObject = value.geom
          const vs = new VectorSource({
          features: new GeoJSON().readFeatures(geoObject, {
              dataProjection: this.state.dataProjection,
              featureProjection: this.state.featureProjection,
              name: 'GEOJSON'
          })
          });
          vs.getFeatures().forEach(function(f) {
            f.setProperties({
              id: value.id
            })
          });
          const vectorLayer = new VectorLayer({
              name: 'vector_layer',
              source: vs,
              style: styleFunction,
          });
          map.addLayer(vectorLayer)
          this.snap(vectorLayer)

          this.vectorLayer = vectorLayer
        })
    }

    loadMap(){
      const raster = new TileLayer({
        source: new OSM(),
      });
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
      });
      this.vector = vector
      const map = new Map({
        layers: [raster, vector],
        target: 'map',
        controls: defaultControls().extend([
          new ModifyBarButton({ModifyButton: this.ModifyButton}),
          new LineBarButton({LineButton: this.LineButton}),
          new PointBarButton({PointButton: this.PointButton}),
          new PolygonBarButton({PolygonButton: this.PolygonButton}),
          new RemoveBarButton({RemoveButton: this.RemoveButton}),
          new AddButton({AddButton: this.AddButton}),
          this.controls.modifyBtn,
          this.controls.lineBtn,
          this.controls.pointBtn,
          this.controls.polygonBtn,
          this.controls.modal,
        ]),
        view: new View({
          center: this.state.Mongolia,
          zoom: 5,
        }),
      });
      this.map = map
      this.snap(vector)
      this.setState({ type: 'Point' })
      this.modifyE.funct()
    }

    ExampleModify(){
      const init = () => {
        const select = new Select();
        this.map.addInteraction(select);
        select.on("select", event => this.featureSelected(event));
        const modify = new Modify({
          features: select.getFeatures(),
        })
        modify.on("modifyend", event => this.modifiedFea(event));
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

    ExampleDraw(){
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
      return { init, init, getActive: getActive, setActive: setActive }
    };

    featureSelected(event){
      if(event.selected[0])
      {
        const featureID_list = this.state.featureID_list
        const selectedFeature_ID = event.selected[0].getProperties()['id']
        if(selectedFeature_ID){
          if(this.state.modifyend_selected_feature_check && selectedFeature_ID !== this.state.modifyend_selected_feature_ID){
            if(this.state.modifyend_selected_feature_ID < 999999)
            {
              this.controls.modal.showModal(this.updateGeom, true, "Тийм", `${this.state.modifyend_selected_feature_ID} дугаартай мэдээллийг хадгалах уу`, null, null, "Үгүй")
              this.setState({modifyend_selected_feature_check: false})
            }
          }
        }
        featureID_list.push(selectedFeature_ID)
        this.setState({ send: true, featureID_list, selectedFeature_ID, modifyend_selected_feature_ID:selectedFeature_ID })
      }
      else
      {
        this.setState({ send: false })
      }
    }

    modifiedFea (event) {
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
                this.setState({ rows })
                this.loadData()
            })
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
      var featureID = this.state.featureID
      const vectorLayer = this.vectorLayer
      const format = this.state.format
      let area = format.writeFeatureObject(feature,  {
        dataProjection: this.state.dataProjection,
        featureProjection: this.state.featureProjection,
      })
      featureID += 1000000
      feature.setProperties({
          'id': featureID
      })
      const properties = feature.getProperties();
      featureID = properties.id;
      const drawed = JSON.stringify(area)
      this.setState({drawed})
    }

    clearMap() {
      const vector = this.vector
      vector.getSource().clear();
    }

    RemoveButton() {
      this.remove()
    }

    remove(){
      const vector = this.vector
      const featureID_list = this.state.featureID_list
      const vectorLayer = this.vectorLayer
      var features = vector.getSource().getFeatures();
      if (features != null && features.length > 0) {
        features.map((x) => {
          var id = x.getProperties()['id']
          featureID_list.map((data, idx) =>
            id == data && vector.getSource().removeFeature(x)
           )
        })
        this.setState({featureID_list: []})
      }
    }

    AddButton(){
      if(this.state.modifyend_selected_feature_ID){
            this.controls.modal.showModal(this.updateGeom, true, "Тийм", `${this.state.modifyend_selected_feature_ID} дугаартай мэдээллийг хадгалах уу`, null, null, "Үгүй")
            this.setState({modifyend_selected_feature_check: false})
      }
      else{
        this.controls.modal.showModal(this.createGeom, true, "Тийм", "Мэдээллийг шинээр үүсгэх үү.", null, null, "Үгүй")
      }
    }

    updateGeom(){
      const id = this.state.selectedFeature_ID
      const oid = this.state.oid
      const json = JSON.parse(this.state.changedFeature)
      const datas = json.geometry
      service.geomUpdate(datas, oid, id).then(({success, info}) => {
        if(success) alert(info)
        else alert(info)
      })
    }

    createGeom(){
      const oid = this.state.oid
      const json = JSON.parse(this.state.drawed)
      const datas = json.geometry
      const row_id = 30
      service.geomAdd(datas, oid).then(({success, info, row_id}) => {
        if(success){
          alert(info)
          if(row_id){
            this.props.history.push(`/gov/барилга-суурин-газар/${oid}/маягт/${row_id}/засах/`)
          }
        }
        else
        {
          alert(info)
        }
      })
    }


    saveData() {
      const vectorLayer = this.vectorLayer
      const {format} = this.state
      data = format.writeFeatures(vectorLayer.getSource().getFeatures());
    }

    ModifyButton(){
      this.drawE.setActive(false);
      this.modifyE.setActive(true);
    }

    LineButton(){
      this.setState({ type: 'LineString' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    PointButton(){
      this.setState({ type: 'Point' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    PolygonButton(){
      this.setState({ type: 'Polygon' })
      this.drawE.getActive()
      this.drawE.setActive(true);
      this.modifyE.setActive(false);
    }

    render(){
        return (
            <div className="col-md-12">
                  <div id="map"></div>
            </div>
        )
    }
}