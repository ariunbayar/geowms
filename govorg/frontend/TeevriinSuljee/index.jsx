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
import {SidebarButton} from './controls/SidebarButton'
import {Modal} from './controls/Modal'
import { service } from './service';
import GeoJSON from 'ol/format/GeoJSON';
import DataTable from './DataTable';
import { Feature } from 'ol';
import { set } from 'ol/transform';

export default class TeevriinSuljee extends Component{

    constructor(props){
      super(props)
      this.state = {
        GeoJson: [],
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
        tables: [{"table_name": "test_point"}, {"table_name": "test_polygon"}],
        select_table:'',
        is_sidebar_open: false,
        oid: this.props.match.params.oid,
        data: {
            fields: [],
            rows: [],
        },
        featureID: null,
        featureID_list: [],
        send: false,
        changedFeature: '',
        Mongolia: [11461613.630815497, 5878656.0228370065],
        chkbox: true
      }

      this.controls = {
        modal: new Modal(),
      }

      this.loadMap = this.loadMap.bind(this)
      this.loadData = this.loadData.bind(this)
      this.onChange = this.onChange.bind(this)
      this.loadRows = this.loadRows.bind(this)
      this.clearMap = this.clearMap.bind(this)
      this.deleteLinked = this.deleteLinked.bind(this)
      this.remove = this.remove.bind(this)
      this.removeWithKey = this.removeWithKey.bind(this)
      this.addModifyInteraction = this.addModifyInteraction.bind(this)
      this.saveData = this.saveData.bind(this)
      this.sendData = this.sendData.bind(this)
    }

    componentDidMount(){
      this.loadMap()
      this.loadRows()
    }

    loadData(){
        const data = this.state.data
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
            stroke: new Stroke({
              color: 'red',
              width: 10,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
            }),
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 8,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
            }),
          }),
          'MultiPoint': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 8,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
            }),
          }),
        };
        data.rows.map((value) => {
          console.log(value.geom)
          const styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
          };
          const geoObject = value.geom
          var vs = new VectorSource({
          features: new GeoJSON().readFeatures(geoObject, {
              dataProjection: this.state.dataProjection,
              featureProjection: this.state.featureProjection,
              name: 'GEOJSON'
          })
          });
          vs.getFeatures().forEach(function(f) {
            console.log(f.getProperties())
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
          var snap2 = new Snap({
              source: vectorLayer.getSource(),
          });
          map.addInteraction(snap2);

          this.vectorLayer = vectorLayer
        })
        // var v2 = new View({
        //     center: this.state.Mongolia,
        //     zoom: 15,
        // });

        // map.setView(v2)
    }

    loadMap(){
      const raster = new TileLayer({
        source: new OSM(),
      });
      // const path = 'frontend/data/geojson/zip.geojson'
      const vector = new VectorLayer({
        source: new VectorSource({
          // features: new GeoJSON().readFeatures(path),
        }),
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

      const map = new Map({
        layers: [raster, vector],
        target: 'map',
        controls: defaultControls().extend([
            new SidebarButton({toggleSidebar: this.toggleSidebar}),
            this.controls.modal,
        ]),
        view: new View({
          center: this.state.Mongolia,
          zoom: 5,
        }),
      });
    //   map.on('click', this.handleMapClick)
      this.map = map

      const ExampleModify = {
        init: function () {
          this.select = new Select();
          map.addInteraction(this.select);
          this.select.on("select", event => featureSelected(event));

          this.modify = new Modify({
            features: this.select.getFeatures(),
          });
          this.modify.on("modifyend", event => modifiedFea(event));
          this.modify.on("modifystart", event => startModFea(event));
          map.addInteraction(this.modify);
          this.setEvents();
        },
        setEvents: function () {
          var selectedFeatures = this.select.getFeatures();
          this.select.on('change:active', function () {
            selectedFeatures.forEach(function (each) {
              selectedFeatures.remove(each);
            });
          });
        },
        setActive: function (active) {
          this.select.setActive(active);
          this.modify.setActive(active);
        },
      };
      this.setState({ ExampleModify })
      ExampleModify.init();

      var optionsForm = document.getElementById('options-form');
      var ExampleDraw = {
        init: function () {
          map.addInteraction(this.Point);
          this.Point.setActive(false);
          map.addInteraction(this.LineString);
          this.LineString.setActive(false);
          map.addInteraction(this.Polygon);
          this.Polygon.setActive(false);
          map.addInteraction(this.Circle);
          this.Circle.setActive(false);
          map.addInteraction(this.MultiPoint);
          this.MultiPoint.setActive(false);
        },
        Point: new Draw({
          source: vector.getSource(),
          type: 'Point',
        }),
        MultiPoint: new Draw({
          source: vector.getSource(),
          type: 'Point',
        }),
        LineString: new Draw({
          source: vector.getSource(),
          type: 'LineString',
        }),
        Polygon: new Draw({
          source: vector.getSource(),
          type: 'Polygon',
        }),
        Circle: new Draw({
          source: vector.getSource(),
          type: 'Circle',
        }),
        getActive: function () {
          return this.activeType ? this[this.activeType].getActive() : false;
        },
        setActive: function (active) {
          var type = optionsForm.elements['draw-type'].value;
          if (active) {
            this.activeType && this[this.activeType].setActive(false);
            this[type].setActive(true);
            this.activeType = type;
          } else {
            this.activeType && this[this.activeType].setActive(false);
            this.activeType = null;
          }
        },
      };
      this.setState({ ExampleDraw })
      ExampleDraw.init();
      ExampleDraw.setActive(true);
      ExampleModify.setActive(false);
      // The snap interaction must be added after the Modify and Draw interactions
      // in order for its map browser event handlers to be fired first. Its handlers
      // are responsible of doing the snapping.
      var snap = new Snap({
        source: vector.getSource(),
      });
      map.addInteraction(snap);
      this.vector = vector
      const featureSelected = (event) => {
        console.log("selected data")
        if(event.selected[0]){
          console.log("id", event.selected[0].getProperties()['id'])
          const featureID_list = this.state.featureID_list
          console.log("id2", featureID_list)
          
          featureID_list.push(event.selected[0].getProperties()['id'])
          this.setState({ send: true, featureID_list})
        }else{
          this.setState({ send: false })
        }
      }
      const modifiedFea = (event) => {
        console.log("modified end")
        const features = event.features.getArray();
        console.log(features)
        console.log("feature changed id is",features[0]);
        const format = new GeoJSON(),
        data = format.writeFeatureObject(features[0]);
        const changedFeature = JSON.stringify(data, null, 4)
        console.log("changed Data");
        this.setState({ changedFeature })
        this.sendData(changedFeature)
        console.log(changedFeature);
      }
      const startModFea = (event) => {
        console.log("started modify")
      }
    }

    loadRows() {
        service
            .rows(this.state.oid)
            .then(({ data }) => {
                this.setState({ data })
                this.loadData()
            })
    }

    componentDidUpdate(prevProps, prevState) {
        const oid_old = prevProps.match.params.oid
        const oid = this.props.match.params.oid
        if (oid_old != oid) {
            this.setState({ oid }, () => {
                this.loadRows()
            })
        }
    }

    onChange(e){
      const ExampleDraw = this.state.ExampleDraw
      const ExampleModify = this.state.ExampleModify
      const parser = new GeoJSON();
      var type = e.target.getAttribute('name');
        var value = e.target.value;
        if (type == 'draw-type') {
          ExampleDraw.getActive() && ExampleDraw.setActive(true);
        } else if (type == 'interaction') {
          if (value == 'modify') {
            ExampleDraw.setActive(false);
            ExampleModify.setActive(true);
          } else if (value == 'draw') {
            ExampleDraw.setActive(true);
            ExampleModify.setActive(false);
          }
        }
      // ExampleDraw.Point.on('drawstart', function(e){
      //   if(value === 'Point'){
      //     this.clearMap()
      //   }
      // })
      // ExampleDraw.LineString.on('drawstart', function(e){
      //   if(value === 'LineString'){
      //     this.clearMap()
      //   }
      // })
      // ExampleDraw.Polygon.on('drawstart', function(e){
      //   if(value === 'Polygon'){
      //     this.clearMap()
      //   }
      // })
      // ExampleDraw.Circle.on('drawstart', function(e){
      //   if(value === 'Circle'){
      //     this.clearMap()
      //   }
      // })
      var featureID = this.state.featureID
      const vectorLayer = this.vectorLayer
      ExampleDraw.Point.on('drawend', function(e){
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        console.log(JSON.stringify(area, null, 4));
        featureID += 1
        e.feature.setProperties({
            'id': featureID
        })
        const properties = e.feature.getProperties();
        featureID = properties.id;
      })
      ExampleDraw.LineString.on('drawend', function(e){
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        console.log(JSON.stringify(area, null, 4));
        featureID += 1
        e.feature.setProperties({
            'id': featureID
        })
        const properties = e.feature.getProperties();
        featureID = properties.id;
      })
      ExampleDraw.Polygon.on('drawend', function(e){
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        console.log(JSON.stringify(area, null, 4));
        featureID += 1
        e.feature.setProperties({
            'id': featureID
        })
        const properties = e.feature.getProperties();
        featureID = properties.id;
        const format = new GeoJSON(),
        data = format.writeFeatures(vectorLayer.getSource().getFeatures());
        console.log(JSON.stringify(data, null, 4));
      })
      ExampleDraw.Circle.on('drawend', function(e){
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        console.log(JSON.stringify(area, null, 4));
        featureID += 1
        e.feature.setProperties({
            'id': featureID
        })
        const properties = e.feature.getProperties();
        featureID = properties.id;
      })
      this.setState({ featureID: featureID })
    }

    clearMap() {
      const vector = this.vector
      vector.getSource().clear();
    }

    deleteLinked(){
      this.removeSelectedFeature()
    }

    removeSelectedFeature() {
      this.remove()
    }

    removeWithKey(e){
      if (e.keyCode == 48){
        this.remove()
      }
    }

    remove(){
      const vector = this.vector
      const featureID_list = this.state.featureID_list
      const vectorLayer = this.vectorLayer
      var features = vector.getSource().getFeatures();
      console.log("feature_id",featureID_list )
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

    sendData(data){
      const oid = this.state.oid
      service.sendFea({data}, oid).then(({success}) => {
        console.log(success, "hadgalsan data")
        console.log(success, "hadgalsan data")
        console.log(success, "hadgalsan data")
        console.log(success, "hadgalsan data")
      })
    }

    addModifyInteraction() {
      console.log("ADADDADADA")
      const map = this.map
      const vectorLayer = this.vectorLayer
      const select_interaction = new Select({
        layers: function(vectorLayer) {
          return vectorLayer.get('name') === 'vector_layer';
        }
      });
      const modify = new ol.interaction.Modify({
        features: select_interaction.getFeatures()
      });
      map.getInteractions().extend([select_interaction, modify]);
      const selected_features = select_interaction.getFeatures();

      selected_features.on('add', function(event){
        console.log("add")
        const feature = event.element;
        const vectorLayer = this.vectorLayer
        feature.on('modifyend', function(event){
          console.log("chancajncjasnklfnsdlk")
        })
        feature.on('change', function(event){
          console.log(event.target.getGeometry().getCoordinates())
        })
        var format = new GeoJSON(),
        data = format.writeFeatures(feature.getSource().getFeatures());
        console.log(JSON.stringify(data, null, 4));
      })
    }

    saveData() {
      console.log("sAVESARATATATA orj bna")
      const vectorLayer = this.vectorLayer
      var format = new GeoJSON(),
      data = format.writeFeatures(vectorLayer.getSource().getFeatures());
      console.log(JSON.stringify(data, null, 4));
    }

    render(){
        return (
            <div>
              <form id="options-form" autoComplete="off" onChange={(e) => this.onChange(e)}>
                <div className="radio">
                  <label>
                    <input type="radio" name="interaction" value="draw" id="draw" defaultChecked={this.state.chkbox}/>
                    Draw &nbsp;
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" name="interaction" value="modify"/>
                    Modify &nbsp;
                  </label>
                </div>
                <div className="form-group">
                  <label>Draw type &nbsp;</label>
                  <select name="draw-type" id="draw-type">
                    <option value="Point">Point</option>
                    <option value="LineString">LineString</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Circle">Circle</option>
                  </select>
                </div>
              </form>
              <button className="btn btn-danger" onClick={() => this.deleteLinked()} onKeyDown={(e) => this.removeWithKey(e)}>Арилгах</button>
              <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-8 m-0 p-0 border border-danger">
                    <div id="map" className="map"></div>
                </div>
                <div className="col-xs-6 col-md-4 border border-danger">
                    <DataTable  data={ this.state.data } send={this.state.send}/>
                </div>
              </div>
              {/* {this.state.is_sidebar_open ?
                    <div className="map-menu col-md-2 card">
                        <div className="card-body">
                            <select className="form-control" id="select_table" value={this.state.select_table} onChange={(e) => this.setState({select_table: e.target.value})}>
                                {this.state.tables.map((value, idx) =>
                                    <option key={idx} value={value['table_name']}>{value['table_name']}</option>
                                )}
                            </select>
                            {this.state.select_table}
                        </div>
                    </div>
                    :
                    null
                } */}
            </div>
        )
    }
}