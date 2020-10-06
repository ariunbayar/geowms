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

export default class ГазрынЗураг extends Component{

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
        Mongolia: [11461613.630815497, 5878656.0228370065],
      }

      this.controls = {
        modal: new Modal(),
      }

      this.loadMap = this.loadMap.bind(this)
      this.loadData = this.loadData.bind(this)
      this.onChange = this.onChange.bind(this)
      this.loadRows = this.loadRows.bind(this)
      this.toggleSidebar = this.toggleSidebar.bind(this)
      this.handleMapClick = this.handleMapClick.bind(this)
    }

    toggleSidebar() {
      this.setState(prevState => ({
          is_sidebar_open: !prevState.is_sidebar_open,
      }))
    }

    handleMapClick(event){
        this.controls.modal.showModal(null, true)
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
              source: vs,
              style: styleFunction,
          });
          map.addLayer(vectorLayer)
          var snap2 = new Snap({
              source: vectorLayer.getSource(),
          });
          map.addInteraction(snap2);
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

      var ExampleModify = {
        init: function () {
          this.select = new Select();
          this.select.getFeatures().on('add', function (event) {
            var properties = event.element.getProperties();
            // selectedFeatureID = properties.id;
            console.log(properties)
          })
          map.addInteraction(this.select);
          this.modify = new Modify({
            features: this.select.getFeatures(),
          });
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
      ExampleDraw.Point.on('drawstart', function(e){
        if(selected === 'Point'){
          clearMap()
        }
      })
      ExampleDraw.LineString.on('drawstart', function(e){
        if(selected === 'LineString'){
          clearMap()
        }
      })
      ExampleDraw.Polygon.on('drawstart', function(e){
        if(selected === 'Polygon'){
          clearMap()
        }
      })
      ExampleDraw.Circle.on('drawstart', function(e){
        if(selected === 'Circle'){
          clearMap()
        }
      })
      ExampleDraw.Point.on('drawend', function(e){
        $('#data').val('')
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        $('#data').val(JSON.stringify(area, null, 4));
        //   e.feature.setProperties({
        //       'id': featureID
        //   })
        // var properties = e.feature.getProperties();
        // selectedFeatureID = properties.id;
      })
      ExampleDraw.LineString.on('drawend', function(e){
        $('#data').val('')
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        $('#data').val(JSON.stringify(area, null, 4));
        //   e.feature.setProperties({
        //       'id': featureID
        //   })
        // var properties = e.feature.getProperties();
        // selectedFeatureID = properties.id;
      })
      ExampleDraw.Polygon.on('drawend', function(e){
        $('#data').val('')
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        $('#data').val(JSON.stringify(area, null, 4));
        //   e.feature.setProperties({
        //       'id': featureID
        //   })
        // var properties = e.feature.getProperties();
        // selectedFeatureID = properties.id;
      })
      ExampleDraw.Circle.on('drawend', function(e){
        $('#data').val('')
        let area = parser.writeFeatureObject(e.feature, {featureProjection: 'EPSG:3857'});
        $('#data').val(JSON.stringify(area, null, 4));
        //   e.feature.setProperties({
        //       'id': featureID
        //   })
        // var properties = e.feature.getProperties();
        // selectedFeatureID = properties.id;
      })

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
              <div className="row">
                <div className="col-md-12 px-0">
                    <div id="map" className="map"></div>
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