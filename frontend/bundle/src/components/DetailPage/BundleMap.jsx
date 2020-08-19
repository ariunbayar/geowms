import React, { Component, Fragment } from "react"

import 'ol/ol.css'
import {Map, View, Feature} from 'ol'
import {transform as transformCoordinate} from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'
import Tile from 'ol/layer/Tile'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Icon, Style, Stroke, Fill} from 'ol/style'
import {Point} from 'ol/geom'
import TileImage from 'ol/source/TileImage'
import TileWMS from 'ol/source/TileWMS'
import OSM from 'ol/source/OSM'
import {format as coordinateFormat} from 'ol/coordinate';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'

import {СуурьДавхарга} from './controls/СуурьДавхарга'
import {CoordinateCopy} from './controls/CoordinateCopy'
import {Modal} from './controls/Modal'

import "./styles.css"
import {service} from './service'
import {SidebarButton} from './SidebarButton'
import {Sidebar} from './Sidebar'
import {DrawButton} from './controls/Draw'
import Draw, { createBox, createRegularPolygon, } from 'ol/interaction/Draw';

export default class BundleMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projection: 'EPSG:3857',
            projection_display: 'EPSG:4326',
            bundle: props.bundle,
            map_wms_list: [],
            is_sidebar_open: true,
            coordinate_clicked: null,
            vector_layer: null,
            draw_layer: null,
            is_draw_open: true,
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
            modal: new Modal(),
            sidebar: new Sidebar(),
        }

        this.marker = this.drawPayButton()

        this.handleToggle = this.handleToggle.bind(this)
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.handleSetCenter = this.handleSetCenter.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
        this.toggleDraw = this.toggleDraw.bind(this)
    }

    initMarker() {

        const style = new Style({
            image: new Icon({
                anchor: [0.5, 86],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                scale: 0.4,
                src: '/static/assets/images/bundle/marker.png'
            })
        })

        const point = new Point([0, 0])

        const feature = new Feature({geometry: point})
        feature.setStyle(style)

        return {feature: feature, point: point}

    }
    drawPayButton() {

        const style = new Style({
            image: new Icon({
                anchor: [0.9, 0],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                scale: 0.7,
                src: '/static/assets/images/bundle/marker.png'
            })
        })

        const point = new Point([1, 0])

        const feature = new Feature({geometry: point})

        feature.setStyle(style)

        return {feature: feature, point: point}

    }

    componentDidMount() {
        this.loadMapData(this.state.bundle.id)
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
                    return{
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
        const source_draw = new VectorSource({wrapX: false})
        const vector_draw = new VectorLayer({
            source: source_draw,
        });

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
                new FullScreen(),
                new MousePosition({
                    projection: this.state.projection_display,
                    coordinateFormat: (coord) => coordinateFormat(coord, '{y},{x}', 6),
                    undefinedHTML: '',
                }),
                new СуурьДавхарга({layers: base_layer_controls}),
                new SidebarButton({toggleSidebar: this.toggleSidebar}),
                new DrawButton({toggleDraw: this.toggleDraw}),
                new ScaleLine(),
                this.controls.modal,
                this.controls.coordinateCopy,
                this.controls.sidebar,
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
                vector_draw
            ],
            view: new View({
                projection: this.state.projection,
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            })
        })







        const draw = new Draw({
            source: source_draw,
            type: 'Circle',
            geometryFunction: createBox(),
        });
        map.addInteraction(draw);
        const projection_display = this.state.projection_display
        const projection = map.getView().getProjection()
        draw.on('drawend',function(e){
            const coordinat = e.feature.getGeometry().getCoordinates()

            const coodrinatLeftTop = coordinat[0][3]
            const coodrinatLeftTop_map_coord = transformCoordinate(coodrinatLeftTop, projection, projection_display)
            const coodrinatLeftTopFormat = coordinateFormat(coodrinatLeftTop_map_coord, '{y},{x}', 6)
            console.log(coodrinatLeftTop_map_coord)

            const coodrinatRightBottom = coordinat[0][1]
            const coodrinatRightBottom_map_coord = transformCoordinate(coodrinatRightBottom, projection, projection_display)
            const coodrinatRightBottomFormat = coordinateFormat(coodrinatRightBottom_map_coord, '{y},{x}', 6)
            console.log(coodrinatRightBottom_map_coord)

        });





        
        map.on('click', this.handleMapClick)

        this.map = map

    }

    handleMapClick(event) {

        this.marker.point.setCoordinates(event.coordinate)

        const projection = event.map.getView().getProjection()
        const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
        const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)

        this.setState({coordinate_clicked})

        this.showFeaturesAt(event.coordinate)

    }

    showFeaturesAt(coordinate) {

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
                        //'INFO_FORMAT': 'text/xml'
                        //'INFO_FORMAT': 'text/html'
                        'INFO_FORMAT': 'application/vnd.ogc.gml',
                    }
                )

                if (url) {

                    this.controls.modal.showModal(null, false)

                    fetch(url)
                        .then((response) => response.text())
                        .then((text) => {
                            const parser = new WMSGetFeatureInfo()
                            const features = parser.readFeatures(text)
                            const source = new VectorSource({
                                features: features
                            });
                            this.state.vector_layer.setSource(source)

                            const feature_info = features.map((feature) => {
                                const geometry_name = feature.getGeometryName()
                                const values =
                                    feature.getKeys()
                                    .filter((key) => key != geometry_name)
                                    .map((key) => [key, feature.get(key)])
                                return [feature.getId(), values]
                            })
                            this.controls.modal.showModal(feature_info, true)
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

    handleSetCenter(coord) {
        const view = this.map.getView()
        const map_projection = view.getProjection()
        const map_coord = transformCoordinate(coord, this.state.projection_display, map_projection)
        this.marker.point.setCoordinates(map_coord)
        view.setCenter(map_coord)
    }
    
    toggleSidebar(event) {
        this.setState(prevState => ({
            is_sidebar_open: !prevState.is_sidebar_open,
        }))
        if(this.state.is_sidebar_open){
            this.controls.sidebar.showSideBar(null, null, true)
        }else{
            this.controls.sidebar.showSideBar(this.state.map_wms_list, this.handleSetCenter, false)
        }
    }


    toggleDraw(event) {
        this.toggleDrawInput()

        this.setState(prevState => ({
            is_draw_open: !prevState.is_draw_open,
        }))
        if(this.state.is_draw_open){
            this.toggleDrawInput()
        }else{

        }
    }


    render() {

        return (

            <div>
                <div className="row">

                    <div className="col-md-12">
                        <div className="🌍">
                            <div id="map"></div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
