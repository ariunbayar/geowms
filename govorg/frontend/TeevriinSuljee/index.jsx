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
        info: [],
        id:'',
        Mongolia: [11461613.630815497, 5878656.0228370065],
      }

      this.controls = {
        modal: new Modal(),
      }

      this.loadMap = this.loadMap.bind(this)
      this.loadData = this.loadData.bind(this)
      this.onChange = this.onChange.bind(this)
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
      service.getGeom('haha').then(({success, info})=>{
            if (success) {
                this.loadData(info)
            }
        })
    }

    loadData(info){
        console.log(info)
        // info.map((value) => {
        //     geom = value
        // })
        // const geom = {"type":"MultiPolygon","coordinates":[[[[107.260879,47.77587802],[107.26073371,47.77567475],[107.26119903,47.77530457],[107.26063096,47.77483557],[107.25995576,47.77382535],[107.2598343,47.7737316],[107.25883712,47.7731151],[107.25856845,47.77327556],[107.25874692,47.77341471],[107.25911591,47.77381566],[107.25920155,47.77443947],[107.25977703,47.77554745],[107.26001767,47.77588702],[107.26008549,47.77590351],[107.26045863,47.77594883],[107.26085648,47.77588831],[107.260879,47.77587802]]]]}
        const map = this.map
        const styles = {
            'MultiPolygon': new Style({
              stroke: new Stroke({
                color: 'blue',
                width: 5,
              }),
              fill: new Fill({
                color: 'rgba(255, 255, 0, 0.1)',
              }),
            }),
          };
        const styleFunction = function (feature) {
        return styles[feature.getGeometry().getType()];
        };

        var vs = new VectorSource({
        features: new GeoJSON().readFeatures(geom, {
            dataProjection: this.state.dataProjection,
            featureProjection: this.state.featureProjection,
        })
        });

        const vectorLayer = new VectorLayer({
            source: vs,
            style: styleFunction,
        });
        map.addLayer(vectorLayer)
        // var v2 = new View({
        //     center: this.state.Mongolia,
        //     zoom: 15,
        // });

        // map.setView(v2)
        var snap2 = new Snap({
            source: vectorLayer.getSource(),
        });
        map.addInteraction(snap2);
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
        },
        Point: new Draw({
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
          console.log(type)
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

      this.loadData()
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
              <div id="map" className="map"></div>
              {this.state.is_sidebar_open ?
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
                }
            </div>
        )
    }
}