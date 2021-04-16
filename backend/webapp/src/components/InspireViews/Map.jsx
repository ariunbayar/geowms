import React, { Component } from "react"
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import Tile from 'ol/layer/Tile'
import {OSM, Vector as VectorSource, TileWMS} from 'ol/source'
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Style, Circle as CircleStyle, RegularShape, Image} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';
import { service } from './service'


export default class StyleMap extends Component {
    constructor(props) {
            super(props)
            this.state = {
                geojson: [],
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
                style_name: props.style_name,
                view_name : props.view_name ? props.view_name : 'geoserver_desing_view',
                url: props.url,
                defualt_url: props.defualt_url,
                geom_type: props.geom_type,
                is_loading: false
            }
            this.loadMapData = this.loadMapData.bind(this)
            this.loadMap = this.loadMap.bind(this)
        }

    componentDidMount() {
        this.loadMap()
        this.loadMapData()
    }

    componentDidUpdate(pP, pS){
        if(pP.geom_type !=this.props.geom_type){
            this.setState({geom_type:this.props.geom_type})
        }
    }

    loadMap(){
        const map = new Map({
            layers: [
                new TileLayer({
                source: new OSM(),
                }),
            ],
            target: 'map',
            view: new View({
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            }),
        });
        this.map = map
    }

    loadMapData(){
        const {
            style_name, url,
            defualt_url, geom_type,
            dataProjection, featureProjection,
        } = this.state
        var params = []
        if ( style_name){
            params= {
                'FORMAT': 'image/png',
                'styles': style_name,
            }
        }
        else{
            params= {
                'FORMAT': 'image/png',
                'cql_filter':  `field_type like '${geom_type}'`
            }
        }

        const updata_layer = {
            tile: new Tile({
            source: new TileWMS({
                projection: featureProjection,
                url: url ? url : defualt_url,
                params: params
            }),
        })}

        this.map.addLayer(updata_layer.tile)
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12 m-1 h-100 w-100">
                    <div id="map" style={{height:"calc( 49vh - 34px - 7px)"}}></div>
                </div>
                {this.state.is_loading ? <span className="text-center d-block text-sp" style={{position:"fixed", top:"60%", right:"20%"}}> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </span> :null}
            </div>
        )
    }
}
