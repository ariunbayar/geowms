import React, { Component } from "react"

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import { service } from "./service"
import "./styles.css"
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'

import {Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import {SidebarButton} from './controls/SidebarButton'
import {Modal} from './controls/Modal'

export default class TeevriinSuljee extends Component {

    constructor(props) {

        super(props)

        this.state = {
            GeoJson: [],
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
            tables: [{"table_name": "test_point"}, {"table_name": "test_polygon"}],
            select_table:'',
            is_sidebar_open: false
        }

        this.controls = {
            modal: new Modal(),
        }

        this.loadMapData = this.loadMapData.bind(this)
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
    componentDidMount() {

        service.geom().then(({GeoJson}) => {
            if(GeoJson){
                this.setState({
                    GeoJson
                })
                this.loadMapData(GeoJson)
            }
        })

    }

    loadMapData(GeoJson){

        const styles = {
              'MultiPolygon': new Style({
                stroke: new Stroke({
                  color: 'yellow',
                  width: 1,
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 0, 0.1)',
                }),
              }),
            };

        const styleFunction = function (feature) {
          return styles[feature.getGeometry().getType()];
        };

        const geojsonObject =  GeoJson

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonObject, {
            dataProjection: this.state.dataProjection,
            featureProjection: this.state.featureProjection,
          }),
        });

        const vectorLayer = new VectorLayer({
              source: vectorSource,
              style: styleFunction,
            });

        const map = new Map({
            layers: [
                new TileLayer({
                  source: new OSM(),
                }),
                vectorLayer
            ],
            target: 'map',
            controls: defaultControls().extend([
                new SidebarButton({toggleSidebar: this.toggleSidebar}),
                this.controls.modal,
            ]),
            view: new View({
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            }),
        });
        map.on('click', this.handleMapClick)
        this.map = map
    }
    render() {
        return (
            <div className="row ">
                <div className="col-md-12 px-0">
                    <div id="map"></div>
                </div>
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