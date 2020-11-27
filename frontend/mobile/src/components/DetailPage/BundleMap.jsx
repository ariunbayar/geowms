import React, { Component } from "react"

import 'ol/ol.css'
import {Map, View, Feature} from 'ol'
import {transform as transformCoordinate} from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'
import Tile from 'ol/layer/Tile'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Point, LineString} from 'ol/geom'
import {Circle as CircleStyle, Fill, Stroke, Style, Icon} from 'ol/style'
import TileImage from 'ol/source/TileImage'
import TileWMS from 'ol/source/TileWMS'
import {format as coordinateFormat} from 'ol/coordinate';
import {defaults as defaultControls, MousePosition, ScaleLine} from 'ol/control'
import Circle from 'ol/geom/Circle';
import {fromLonLat} from 'ol/proj';
import {СуурьДавхарга} from './controls/СуурьДавхарга'
import {CoordinateCopy} from './controls/CoordinateCopy'
import {Modal} from './controls/Modal'
import "./styles.css"
import {service} from './service'
import {Sidebar} from './Sidebar'


export default class BundleMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projection: 'EPSG:3857',
            projection_display: 'EPSG:4326',
            bundle: props.bundle,
            map_wms_list: [],
            is_sidebar_open: false,
            coordinate_clicked: null,
            vector_layer: null,
            hureelayer: null,
            longitude: 0,
            latitude: 0,
            feature_info: [],
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
            modal: new Modal(),
        }

        this.marker = this.initMarker()

        this.handleToggle = this.handleToggle.bind(this)
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.handleSetCenter = this.handleSetCenter.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
        this.showFeaturesLimit = this.showFeaturesLimit.bind(this)
        this.locationSet = this.locationSet.bind(this)
        this.connectPointToPoint = this.connectPointToPoint.bind(this)
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
        if(this.state.bundle.id) this.loadMapData(this.state.bundle.id)
        navigator.geolocation.getCurrentPosition((position) => {
            const location = [position.coords.longitude, position.coords.latitude]
            this.setState({longitude: position.coords.longitude, latitude: position.coords.latitude})
        });
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.coordinate_clicked !== this.state.coordinate_clicked) {
            this.controls.coordinateCopy.setCoordinate(this.state.coordinate_clicked)
        }
        if (this.props.bundle.id === prevProps.bundle.id) return
        const {bundle} = this.props
        this.setState({bundle})
        this.loadMapData(bundle.id)

    }

    loadMapData(bundle_id) {

        Promise.all([
            service.loadBaseLayers(),
            service.loadWMSLayers(bundle_id),
        ]).then(([{base_layer_list}, {wms_list}]) => {
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
                layer.defaultCheck == 0 && layer.tile.setVisible(false)
                layer['legend'] = layer.tile.getSource().getLegendUrl()

                }
            )
        )
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
                image: new Icon({
                    anchor: [0.5, 86],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    scale: 0.4,
                    src: '/static/assets/image/marker.png'
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
                this.controls.modal,

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
        if(this.state.is_sidebar_open){
            this.setState({is_sidebar_open:false})
        }
        else if(this.props.wmsLayerScreenIsload){
            this.props.wmsLayerName()
        }
        else{
            const projection = event.map.getView().getProjection()
            const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
            const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)
            this.setState({coordinate_clicked})
            this.showFeaturesAt(event.coordinate)
        }

    }

    connectPointToPoint(features) {
        const { longitude, latitude, vector_layer } = this.state
        const coordinat_center = [longitude, latitude]
        const coordinate_me = fromLonLat(coordinat_center, this.state.projection)

        const linieStyle = new Style({
              stroke: new Stroke({
                color: '#d12710',
                width: 4,
                lineDash: [.6, 5]
              })
            })
        this.features = []
        features.map((feature, idx) => {
            const geom = feature.getGeometry().getCoordinates()
            const line = new LineString([coordinate_me, geom])
            const lineFeature = new Feature(line)
            lineFeature.setStyle(linieStyle)
            vector_layer.getSource().addFeature(lineFeature)
            const routeLength = line.getCoordinates().length;
            this.line = line
            this.routeLength = routeLength
        })
        this.geoMarker = new Feature({
            type: 'geoMarker',
            geometry: new Point(coordinate_me[0]),
        })
    }

    showFeaturesLimit() {
        const {longitude, latitude} = this.state
        const coordinat_center = [longitude, latitude]
        const coordinat_bottom = [longitude + 0.12, latitude + 0.4]
        const coordinat_top = [longitude - 0.12, latitude - 0.4]
        const coord0 = fromLonLat(coordinat_center, this.state.projection)
        const coord1 = fromLonLat(coordinat_bottom, this.state.projection)
        const coord2 = fromLonLat(coordinat_top, this.state.projection)
        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()
        this.setState({pay_modal_check: false})
        this.state.map_wms_list.forEach(({layers}) => {
            layers.forEach(({tile, feature_price,geodb_export_field, geodb_pk_field, geodb_schema, geodb_table, code}) => {
                if (tile.getVisible() != true) {
                    return
                }
                const wms_source = tile.getSource()

                const url = wms_source.getFeatureInfoUrl(
                    coord0,
                    5000,
                    projection,
                    {
                        //'INFO_FORMAT': 'text/xml'
                        //'INFO_FORMAT': 'text/html'
                        'INFO_FORMAT': 'application/vnd.ogc.gml',
                        'feature_count': 10,
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
                            const feature_info = features.map((feature) => {
                                const geometry_name = feature.getGeometryName()
                                const values =
                                    feature.getKeys()
                                    .filter((key) => key != geometry_name)
                                    .map((key) => [key, feature.get(key)])
                                return [feature.getId(), values]
                            })
                            if(!this.state.is_draw_open){
                                if(geodb_table == 'mpoint_view'){
                                }
                                else{
                                    if(!this.state.pay_modal_check && geodb_table != 'privite') {
                                        if(feature_info.length > 0) {
                                            // this.controls.modal.showModal(feature_info, true)
                                            this.setState({feature_info})
                                        }
                                    }
                                }
                                if(geodb_table == 'covid'){
                                    this.state.vector_layer.setSource(source)
                                    this.connectPointToPoint(features)
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

    showFeaturesAt(coordinate) {
        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()
        this.setState({pay_modal_check: false})
        this.state.map_wms_list.forEach(({layers}) => {
            layers.forEach(({tile, feature_price,geodb_export_field, geodb_pk_field, geodb_schema, geodb_table, code}) => {
                if (tile.getVisible() != true) {
                    return
                }
                const wms_source = tile.getSource()
                const url = wms_source.getFeatureInfoUrl(
                    coordinate,
                    resolution,
                    projection,
                    {
                        //'INFO_FORMAT': 'text/xml'
                        //'INFO_FORMAT': 'text/html'
                        'INFO_FORMAT': 'application/vnd.ogc.gml',

                    }
                )
                if (url) {
                    if(!this.state.is_draw_open){
                    }
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
                            if(!this.state.is_draw_open){
                                if(geodb_table == 'mpoint_view'){
                                }
                                else{
                                    if(!this.state.pay_modal_check && geodb_table != 'privite') {
                                        this.state.vector_layer.setSource(source)
                                        this.connectPointToPoint(features)

                                        if(feature_info.length > 0) this.controls.modal.showModal(feature_info, true)
                                    }
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

    handleToggle(idx) {
        const layer = this.state.layers[idx]
        layer.setVisible(!layer.getVisible())
    }


    handleSetCenter(coord, zoom) {
        const view = this.map.getView()
        const map_projection = view.getProjection()
        const map_coord = transformCoordinate(coord, this.state.projection_display, map_projection)
        this.marker.point.setCoordinates(map_coord)
        view.animate({zoom: zoom, duration: 4000}, {center: view.setCenter(map_coord), duration: 2000});
        const hureelayer = new VectorLayer({
            source: new VectorSource({
                projection: this.state.projection_display,
                features: [new Feature(new Circle(map_coord, 1000))]
            }),
            style: new Style({
                stroke: new Stroke({
                    color: 'BLUE',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(100, 255, 0, 0)'
                })
            })
        })
        this.setState({hureelayer})
        this.map.addLayer(this.state.hureelayer);
    }

    toggleSidebar(event) {
        this.setState({is_sidebar_open: event})
    }

    locationSet(){
        this.map.removeLayer(this.state.hureelayer)
        this.showFeaturesLimit()
        navigator.geolocation.getCurrentPosition((position) => {
            const location = [position.coords.longitude, position.coords.latitude]
            this.handleSetCenter(location, 14.6)
        });

    }

    render() {
        return (
            <div>
                <button onClick={this.showDetail} style={{display: 'none'}}>click here</button>
                <div className="row">
                    <div className="col-md-12">
                        <div className="🌍">
                            <div id="map"></div>
                            <Sidebar map_wms_list={this.state.map_wms_list}
                                toggleSidebar={this.toggleSidebar}
                                is_sidebar_open={this.state.is_sidebar_open}
                                handleSetCenter={this.handleSetCenter}
                            />
                            <div className={'⚙-toggle'}>
                                <a href="#" onClick={() =>  this.setState(prevState => ({is_sidebar_open: !prevState.is_sidebar_open}))}>
                                    <i className="fa fa-bars fa-lg" aria-hidden="true"></i>
                                </a>
                            </div>
                            <div className={'⚙-location'}>
                                <a href="#" onClick={() => this.locationSet()}>
                                <i className="fa fa-location-arrow fa-lg" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
