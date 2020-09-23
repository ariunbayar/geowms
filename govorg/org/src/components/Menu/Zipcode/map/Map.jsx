import React, { Component, Fragment } from "react"
import 'ol/ol.css'
import {Map, View, Feature} from 'ol'
import {transform as transformCoordinate} from 'ol/proj'
import Tile from 'ol/layer/Tile'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Icon, Style, Stroke, Fill, Text} from 'ol/style'
import {Point} from 'ol/geom'
import TileImage from 'ol/source/TileImage'
import TileWMS from 'ol/source/TileWMS'
import {format as coordinateFormat} from 'ol/coordinate';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'
import {СуурьДавхарга} from './controls/СуурьДавхарга'
import {CoordinateCopy} from './controls/CoordinateCopy'
import "./styles.css"
import {service} from './service'

export default class Maps extends Component {

    constructor(props) {
        super(props)
        this.map={}
        this.state = {
            projection: 'EPSG:3857',
            projection_display: 'EPSG:4326',
            is_sidebar_open: true,
            coordinate_clicked: '',
            vector_layer: null,
            is_draw_open: false,
            draw_layer: null,
            draw: null,
            source_draw: null,
            info:[],
            xy: [],
            map_wms_list: [],
            wms_list: [],
            feature_req: 0,
            zoom: 0,
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
        }

        this.marker = this.initMarker()
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.handleSetCenter = this.handleSetCenter.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
    }

    initMarker() {
        const style = new Style({
            image: new Icon({
                anchor: [0.5, 86],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                scale: 0.4,
                src: '/static/assets/image/marker.png'
            })
        })
        const point = new Point([0, 0])
        const feature = new Feature({geometry: point})
        feature.setStyle(style)
        return {feature: feature, point: point}
    }

    componentDidMount() {
        const {aimag_id, bag_id, sum_id} = this.props
    }

    loadMapData(wms_list) {
            service.loadBaseLayers().then(({base_layer_list}) => {
            this.handleMapDataLoaded(base_layer_list, wms_list)
        })
    }

    handleMapDataLoaded(base_layer_list, wms_list) {
        const map_wms_list = wms_list.map(({name, url, layers}) => {

            return {
                name,
                layers: layers.map((layer) => {
                    return {
                        ...layer,
                        tile: new Tile({
                            source: new TileWMS({
                                projection: this.state.projection,
                                url: url,
                                params: {
                                    'LAYERS': layer.code,
                                    //'FORMAT': 'image/svg+xml',
                                    'FORMAT': 'image/png',
                                }
                            }),
                        })
                    }
                }),
            }
        })
        map_wms_list.map((wms, idx) =>
            wms.layers.map((layer, idx) =>{
                if(layer.tile.values_.source.params_.LAYERS == "Аймаг_нийслэлийн_хил"){
                    layer.tile.setVisible(true)
                }
                else{
                    layer.tile.setVisible(false)
                }
        }))
        this.setState({map_wms_list})
        const {base_layers, base_layer_controls} =
            base_layer_list.reduce(
                (acc, base_layer_info, idx) => {

                    let layer

                    if (base_layer_info.tilename == "xyz") {
                        layer = new Tile({
                            source: new TileImage({
                                crossOrigin: 'Anonymous',
                                url: base_layer_info.url,
                            }),
                        })
                    }

                    if (base_layer_info.tilename == "wms") {
                        layer = new Tile({
                            source: new TileWMS({
                                url: base_layer_info.url,
                                params: {
                                    'LAYERS': base_layer_info.layers,
                                    'FORMAT': 'image/png',
                                }
                            }),
                        })
                    }

                    acc.base_layers.push(layer)
                    acc.base_layer_controls.push({
                        is_active: idx == 0,
                        thumbnail_1x: base_layer_info.thumbnail_1x,
                        thumbnail_2x: base_layer_info.thumbnail_2x,
                        layer: layer,
                    })
                    return acc
                },
                {
                    base_layers: [],
                    base_layer_controls: []
                }
            )
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

        const marker_layer = new VectorLayer({
            source: new VectorSource({
                features: [this.marker.feature],
            })
        })

        const map = new Map({
            target: 'map',
            controls: defaultControls().extend([
                new MousePosition({
                    projection: this.state.projection_display,
                    coordinateFormat: (coord) => coordinateFormat(coord, '{y},{x}', 6),
                    undefinedHTML: '',
                }),
                new СуурьДавхарга({layers: base_layer_controls}),
                new ScaleLine(),
                this.controls.coordinateCopy,
            ]),
            layers: [
                ...base_layers,
                ...map_wms_list.reduce((acc_main, wms) =>
                {
                        const tiles = wms.layers.map((layer) => layer.tile)
                        return [...acc_main, ...tiles]
                }, []),
                vector_layer,
                marker_layer,
            ],
            view: new View({
                projection: this.state.projection,
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            })
        })

        map.on('click', this.handleMapClick)
        this.map = map
    }

    handleMapClick(event) {
            this.marker.point.setCoordinates(event.coordinate)
            const projection = event.map.getView().getProjection()
            const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
            const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)
            this.setState({feature_req: 0})
            this.setState({coordinate_clicked})
            this.showFeaturesAt(event.coordinate, this.state.zoom, true, 1000)
    }

    handleSetCenter(zoom, latx, laty) {
        var coord = [latx, laty]
        const view = this.map.getView()
        const map_projection = view.getProjection()
        const map_coord = transformCoordinate(coord, this.state.projection_display, map_projection)
        this.marker.point.setCoordinates(map_coord)
        if(!this.props.root_check) this.showFeaturesAt(map_coord, zoom, false, 1000)
    }

    showFeaturesAt(coordinate, zoom, mouse, time) {
        this.setState({feature_req: 0})
        this.setState({feature_req: this.state.feature_req + 1})
        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()
        this.state.map_wms_list.forEach(({layers}) => {
            layers.forEach(({tile}) => {
                if (tile.getVisible() != true) {
                    return
                }
                const wms_source = tile.getSource()
                const url = wms_source.getFeatureInfoUrl(
                    coordinate,
                    resolution,
                    projection,
                    {
                        'INFO_FORMAT': 'application/vnd.ogc.gml',
                    }
                )
                if(!mouse) view.animate({zoom: zoom}, {center: view.setCenter(coordinate)});
                setTimeout(() => {
                    if (url) {
                        fetch(url)
                            .then((response) => response.text())
                            .then((text) => {
                                const parser = new WMSGetFeatureInfo()
                                const features = parser.readFeatures(text)
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
                                this.state.vector_layer.setSource(source)
                                if(this.state.feature_req < 3){
                                    if (feature_info.length == 0){
                                        this.showFeaturesAt(coordinate, zoom, mouse, time)
                                    }
                                    else{
                                        var array = this.state.coordinate_clicked.split(',').map(function(n) {
                                            return Number(n);
                                        });
                                        if(mouse) this.props.handlefeatureDataRead(feature_info, array)
                                    }
                                }
                            })
                    } else {
                        /* TODO */
                        console.log('no feature url', wms_source);
                    }
                }, time);
            })
        })

    }

    componentDidUpdate(pP){
        if(pP.wms_list !== this.props.wms_list)
        {
            this.loadMapData(this.props.wms_list)
        }

        const {aimag_id, bag_id, sum_id, zip_id} = this.props
        if(pP.aimag_id !== aimag_id){
            if(aimag_id !==-1 && sum_id == -1 && bag_id == -1 && zip_id == -1){
                this.state.map_wms_list.map((wms, idx) =>
                    wms.layers.map((layer, idx) =>{
                        if(layer.tile.values_.source.params_.LAYERS == "Аймаг_нийслэлийн_хил"){
                            layer.tile.setVisible(true)
                        }
                        else{
                            layer.tile.setVisible(false)
                        }
                }))
                this.setState({zoom:7.6})
                this.handleSetCenter(7.6, this.props.latx, this.props.laty)
            }
        }

        if(pP.sum_id !== sum_id){
            if(sum_id !==-1 && bag_id == -1 && aimag_id !== -1 && zip_id == -1){
                this.state.map_wms_list.map((wms, idx) =>
                    wms.layers.map((layer, idx) =>{
                        if(layer.tile.values_.source.params_.LAYERS == "Сум_дүүргийн_хил"){
                            layer.tile.setVisible(true)
                        }
                        else{
                            layer.tile.setVisible(false)
                        }
                    })
                )
                this.setState({zoom:10})
                this.handleSetCenter(10, this.props.latx, this.props.laty)
            }
        }
        if(pP.bag_id !== bag_id){
            if(bag_id !==-1 && sum_id !==-1 && aimag_id !==-1 && zip_id == -1){
                this.state.map_wms_list.map((wms, idx) =>
                    wms.layers.map((layer, idx) =>{
                        if(layer.tile.values_.source.params_.LAYERS == "Баг_хорооны_хил"){
                            layer.tile.setVisible(true)
                        }
                        else{
                            layer.tile.setVisible(false)
                        }
                }))
                this.setState({zoom:13})
                this.handleSetCenter(13, this.props.latx, this.props.laty)

            }
        }
        if(pP.zip_id !== zip_id){
            if(bag_id !==-1 && sum_id !==-1 && aimag_id !==-1 && zip_id !== -1){
                this.state.map_wms_list.map((wms, idx) =>
                    wms.layers.map((layer, idx) =>{
                        if(layer.tile.values_.source.params_.LAYERS == "Зип_код"){
                            layer.tile.setVisible(true)
                        }
                        else{
                            layer.tile.setVisible(false)
                        }
                }))
                this.setState({zoom:13.43})
                this.handleSetCenter(13.43, this.props.latx, this.props.laty)

            }
        }
    }

    render() {
        return (
            <div>
                <div className="zip">
                    <div id="map" className="mt-2 map"></div>
                </div>
            </div>
        )
    }
}
