import React, { Component } from "react"
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { defaults as defaultControls } from 'ol/control'
import Tile from 'ol/layer/Tile'
import {OSM, Vector as VectorSource, TileWMS} from 'ol/source'
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Style, Circle as CircleStyle, RegularShape, Image} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';

import { service } from './service'
import {ZoomControl} from './zoom_control'


export default class StyleMap extends Component {
    constructor(props) {
            super(props)

            this.controls = {
                zoomControl: new ZoomControl(),
            }

            this.state = {
                geojson: [],
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
                style_state: props.style_state,
                style_color: props.style_color,
                style_size: props.style_size,
                fill_color: props.fill_color,
                style_name: props.style_name,
                view_name : props.view_name ? props.view_name : 'geoserver_desing_view',
                url: props.url,
                defualt_url: props.defualt_url,
                geom_type: props.geom_type,
                dashed_line_gap: props.dashed_line_gap,
                dashed_line_length: props.dashed_line_length,
                color_opacity: props.color_opacity,
                wellknownname: props.wellknownname,
                is_loading: false,
                style_datas: props.style_datas,
            }

            this.loadMapData = this.loadMapData.bind(this)
            this.loadMap = this.loadMap.bind(this)
            this.handleZoom = this.handleZoom.bind(this)
            this.handleZoomIn = this.handleZoomIn.bind(this)
            this.StyleFunction = this.StyleFunction.bind(this)
            this.getBaseLog = this.getBaseLog.bind(this)

        }

    componentDidMount() {
        this.loadMap()
        if (this.props.only_clicked) {
            this.loadMapData()
        }
    }

    componentDidUpdate(pP, pS){
        const {
            style_color, style_size,
            fill_color, style_name,
            dashed_line_gap, dashed_line_length,
            color_opacity, wellknownname,
            geom_type, only_clicked, style_datas,
            min_range, max_range
        } = this.props

        if (pP.color_opacity != color_opacity) {
            this.setState({color_opacity})
        }

        if (pP.dashed_line_length != dashed_line_length) {
            this.setState({dashed_line_length})
        }

        if (pP.dashed_line_gap != dashed_line_gap) {
            this.setState({dashed_line_gap})
        }

        if (pP.wellknownname != wellknownname) {
            this.setState({wellknownname})
        }

        if (pP.style_size != style_size) {
            this.setState({style_size})
        }

        if (pP.fill_color != fill_color) {
            this.setState({fill_color})
        }

        if (pP.style_color != style_color) {
            this.setState({style_color})
        }

        if (pP.geom_type != geom_type) {
            this.setState({geom_type})
        }

        if (pP.style_datas != style_datas) {
            this.setState({style_datas})
        }

        if (pP.only_clicked != only_clicked) {
            if (this.props.only_clicked) {
                this.loadMapData()
            }
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
        controls: defaultControls().extend([
            this.controls.zoomControl,
        ]),
        view: new View({
            center: [11461613.630815497, 5878656.0228370065],
            zoom: 5.041301562246971,
        }),
        });
        map.on('moveend', this.handleZoom)
        this.map = map
    }

    StyleFunction(style_type, values) {
        const {
            style_color, style_size,
            fill_color, dashed_line_gap,
            dashed_line_length, color_opacity, wellknownname
        } = values
        if (wellknownname){
            var { points, radius, angle, rotation, radius2} = 0
            if (wellknownname == 'square') {
                    points = 4
                    radius = 10
                    angle = Math.PI / 4
            }
            else if (wellknownname == 'triangle'){
                    points = 3
                    radius = 10
                    rotation = Math.PI / 4
                    angle = 0
            }
            else if (wellknownname == 'star'){
                    points = 5
                    radius = 10
                    radius2 = 4
                    angle = 0
            }
            else if (wellknownname == 'x'){
                        points =  4
                        radius = 10
                        radius2 = 0
                        angle = 0
            }
            var point_style = new RegularShape({
                    fill: new Fill({
                        color: fill_color,
                    }),
                    stroke: new Stroke({
                        color: style_color,
                        width: style_size,
                        lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                    }),
                    points: points,
                    radius: radius,
                    radius2: radius2,
                    rotation: rotation,
                    angle: angle
                })
            }
        else{
            var point_style = new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: fill_color,
                    }),
                    stroke: new Stroke({
                        color: style_color,
                        width: style_size,
                    }),
                })
            }

        var styles_new = {
            'MultiPolygon': new Style({
                stroke: new Stroke({
                    color: style_color,
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity
                }),
            }),
            'Polygon': new Style({
                stroke: new Stroke({
                    color: style_color ? style_color : '#21130d',
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity

                }),
            }),
            'Point': new Style({
                image: point_style
            }),
            'LineString': new Style({
                stroke: new Stroke({
                    color: style_color ? style_color : '#21130d',
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity
                }),
            }),
            'MultiLineString': new Style({
                stroke: new Stroke({
                    color: style_color,
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity
                }),
            }),
            'MultiPoint': new Style({
                image: point_style
            }),
        };
        return styles_new[style_type];
    }

    getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
    }

    handleZoomIn(current_zoom) {
        const { style_datas } = this.state
        var all_values =  this.state
        var styles = this.StyleFunction
        if (style_datas && Object.keys(style_datas).length>0) {
            style_datas.map((values, idx)=>{
                var min_range = parseInt(values.min_range)
                var max_range = parseInt(values.max_range)

                var max_level = 21-parseInt(this.getBaseLog(2, min_range/133))
                var min_level = 21-parseInt(this.getBaseLog(2, max_range/133))

                if ((min_level <= parseInt(current_zoom)) && (parseInt(current_zoom) <= max_level)){
                    this.map.getLayers().forEach(layer => {
                        if (layer && layer.get('id') === 'style_layer') {
                            var features = layer.getSource().getFeatures()
                            features.forEach(function(feature){
                                var geom_type =feature.getGeometry().getType()
                                feature.setStyle(styles(geom_type, values))
                            })
                        }
                    });
                }
            })
        }
    }

    handleZoom(event) {
        var current_zoom = event.map.getView().getZoom()
        this.controls.zoomControl.setCoordinate(current_zoom)
        this.handleZoomIn(current_zoom)
    }

    loadMapData(){
        const {
            dataProjection, featureProjection, geom_type
        } = this.state
        var state_data = this.state
        var style_done = this.StyleFunction
        this.setState({is_loading: true})
        service.getStyleData(geom_type).then(({data}) =>
            {
                if (data)
                {
                    this.map.getLayers().forEach(layer => {
                        if (layer && layer.get('id') === 'aimag') {
                            layer.getSource().clear();
                        }
                    });
                        const features = new GeoJSON({
                            dataProjection: dataProjection,
                            featureProjection: featureProjection,
                        }).readFeatures(data)
                        const vectorSource = new VectorSource({
                            features: features
                        });
                        const vector_layer = new VectorLayer({
                            source: vectorSource,
                            style: function(feature, resolution){
                                var hoho = feature.getGeometry().getType();
                                var style_of_map = style_done(hoho, state_data)
                                return style_of_map
                            },
                            id: 'style_layer'
                        })

                        this.map.addLayer(vector_layer)
                        this.map.getView().fit(vectorSource.getExtent(),{ padding: [200, 200, 200, 200], duration: 3000 });
                        this.setState({is_loading: false})
                    }
                }
            )
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12 w-100">
                    <div id="map" style={{height:"80vh"}}><input className="form-control col-1 position-fixed border border-dark"/></div>
                </div>
                {this.state.is_loading ? <span className="text-center d-block text-sp" style={{position:"fixed", top:"60%", right:"20%"}}> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </span> :null}
            </div>
        )
    }
}
