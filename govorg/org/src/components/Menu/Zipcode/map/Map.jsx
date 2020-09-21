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
            wms_list: []
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
        console.log('aimag', aimag_id, 'baag', bag_id, 'sum' , sum_id)
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
        setTimeout(() => {
            this.handleSetCenter(7)
        }, 2000);

        setTimeout(() => {
            this.handleSetCenter(7)
        }, 3000);
    }

    handleMapClick(event) {
            this.marker.point.setCoordinates(event.coordinate)
            const projection = event.map.getView().getProjection()
            const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
            const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)
            this.setState({coordinate_clicked})
            this.showFeaturesAt(event.coordinate)

    }

    handleSetCenter(zoom) {
        var coord = [104.323, 43.2231]
        const view = this.map.getView()
        const map_projection = view.getProjection()
        const map_coord = transformCoordinate(coord, this.state.projection_display, map_projection)
        this.marker.point.setCoordinates(map_coord)
        view.animate({zoom: zoom}, {center: view.setCenter(map_coord)});
        this.showFeaturesAt(map_coord)
    }

    showFeaturesAt(coordinate) {
        this.state.map_wms_list.map((wms, idx) =>
            wms.layers.map((layer, idx) =>
                layer.tile.setVisible(false)
            )
        )
        const {aimag_id, bag_id, sum_id} = this.props
        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()
        this.state.map_wms_list.forEach(({layers}) => {
            layers.forEach(({tile}) => {
                const wms_source = tile.getSource()
                const url = wms_source.getFeatureInfoUrl(
                    coordinate,
                    resolution,
                    projection,
                    {
                        'INFO_FORMAT': 'application/vnd.ogc.gml',
                    }
                )

                if (url) {
                    fetch(url)
                        .then((response) => response.text())
                        .then((text) => {
                            const parser = new WMSGetFeatureInfo()
                            const features = parser.readFeatures(text)
                            const source = new VectorSource({
                                features: features
                            });
                            this.state.vector_layer.setSource(source)
                            console.log(features[0])
                            if(features[0]){
                                if(features[0].id_.includes('Сум_дүүргийн_хил')){
                                    console.log("sum shdee")
                                    console.log(this.state.map_wms_list)
                                    this.state.map_wms_list.map((wms, idx) =>
                                    wms.layers.map((layer, idx) =>{
                                        console.log(layer.tile)
                                        layer.tile.setVisible(false)
                                    })
                                )
                                }
                                if(features[0].id_.includes('Аймаг_нийслэлийн_хил')){
                                    console.log("aimag shdee")
                                }
                                if(features[0].id_.includes('Баг_хорооны_хил')){
                                    console.log("bag bnshde")
                                }
                            }
                        })
                } else {
                    /* TODO */
                    console.log('no feature url', wms_source);
                }
            })
        })

    }

    componentDidUpdate(pP){
        if(prevProps.wms_list !== this.props.wms_list)
        {
            this.loadMapData(this.props.wms_list)
        }

        const {aimag_id, bag_id, sum_id} = this.props
        if(pP.aimag_id !== aimag_id){
            console.log('aimag', aimag_id)
            if(aimag_id !== 0){
                this.state.map_wms_list.map((wms, idx) =>
                    wms.layers.map((layer, idx) =>{
                        console.log(layer.tile)
                        if(layer.tile.values_.source.params_.LAYERS == "Сум_дүүргийн_хил"){
                            layer.tile.setVisible(true)
                            this.handleSetCenter(7)
                        }
                        if(layer.tile.values_.source.params_.LAYERS == "Баг_хорооны_хил"){
                            layer.tile.setVisible(true)
                            this.handleSetCenter(7)
                        }
                }))
            }
        }
        if(pP.sum_id !== sum_id){
            if(sum_id !== 0){
                this.state.map_wms_list.map((wms, idx) =>
                    wms.layers.map((layer, idx) =>{
                        console.log(layer.tile)
                        if(layer.tile.values_.source.params_.LAYERS == "Аймаг_нийслэлийн_хил"){
                            layer.tile.setVisible(true)
                            this.handleSetCenter(7)
                        }
                        if(layer.tile.values_.source.params_.LAYERS == "Баг_хорооны_хил"){
                            layer.tile.setVisible(true)
                            this.handleSetCenter(7)
                        }
                }))
            }
        }
        if(pP.bag_id !== bag_id){
            if(bag_id !== 0){
                this.state.map_wms_list.map((wms, idx) =>
                    wms.layers.map((layer, idx) =>{
                        console.log(layer.tile)
                        if(layer.tile.values_.source.params_.LAYERS == "Баг_хорооны_хил"){
                            layer.tile.setVisible(true)
                            this.handleSetCenter(7)
                        }
                        if(layer.tile.values_.source.params_.LAYERS == "Аймаг_нийслэлийн_хил"){
                            layer.tile.setVisible(true)
                            this.handleSetCenter(7)
                        }
                }))
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
