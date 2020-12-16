import React, { Component, Fragment } from "react"

import 'ol/ol.css'
import {Map, View, Feature, Overlay, Observable } from 'ol'
import {unByKey} from 'ol/Observable'
import {transform as transformCoordinate} from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'

import Tile from 'ol/layer/Tile'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Icon, Style, Stroke, Fill, Text} from 'ol/style'
import {Point} from 'ol/geom'
import TileImage from 'ol/source/TileImage'
import TileWMS from 'ol/source/TileWMS'
import OSM from 'ol/source/OSM'
import {format as coordinateFormat} from 'ol/coordinate';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'

import {СуурьДавхарга} from './controls/СуурьДавхарга'
import {CoordinateCopy} from './controls/CoordinateCopy'
import {Modal} from './controls/Modal'
import {ShopModal} from './ShopControls/Modal'
import {ShopCart} from './ShopControls/ShopCart'
import {DrawPayModal} from './controls/DrawPayModal'
import "./styles.css"
import {service} from './service'
import {SidebarButton} from './SidebarButton'
import {Sidebar} from './Sidebar'
import {SearchBar} from './searchControl/SearchBar'
import {SearchBarButton} from './searchControl/SearchBarButton'
import {DrawButton} from './controls/Draw'
import {PopUp} from './popUp/PopUp'
import Draw, { createBox, createRegularPolygon, } from 'ol/interaction/Draw';
import { AlertRoot } from "./ShopControls/alert"

export default class BundleMap extends Component {

    constructor(props) {
        super(props)
        this.sendFeatureInfo = []
        this.state = {
            projection: 'EPSG:3857',
            projection_display: 'EPSG:4326',
            bundle: props.bundle,
            map_wms_list: [],
            is_sidebar_open: true,
            is_search_sidebar_open: true,
            coordinate_clicked: null,
            vector_layer: null,
            is_draw_open: false,
            draw_layer: null,
            draw: null,
            source_draw: null,
            is_cart: false,
            y: null,
            x: null,
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
            modal: new Modal(),
            shopmodal: new ShopModal(),
            cart: new ShopCart(),
            drawModal: new DrawPayModal(),
            sidebar: new Sidebar(),
            searchbar: new SearchBar(),
            alertBox: new AlertRoot(),
            popup: new PopUp(),
        }

        this.marker = this.initMarker()

        this.handleToggle = this.handleToggle.bind(this)
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.handleSetCenter = this.handleSetCenter.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.searchSidebar = this.searchSidebar.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
        this.toggleDraw = this.toggleDraw.bind(this)
        this.toggleDrawed = this.toggleDrawed.bind(this)
        this.toggleDrawRemove = this.toggleDrawRemove.bind(this)
        this.cartButton = this.cartButton.bind(this)
        this.onClickCloser = this.onClickCloser.bind(this)
        this.getElement = this.getElement.bind(this)
        this.listToJson = this.listToJson.bind(this)
        this.setSourceInPopUp = this.setSourceInPopUp.bind(this)
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

    cartButton(is_cart, content,  code){
        if(is_cart == true){
            this.controls.cart.showModal(this.state.coordinate_clicked, is_cart, this.state.x, this.state.y, content, code)
        }
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
        map_wms_list.map((wms, idx) =>
            wms.layers.map((layer, idx) => {
                layer.defaultCheck == 0 && layer.tile.setVisible(false)
                layer['legend'] = layer.tile.getSource().getLegendUrl()
            })
        )

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
                new FullScreen(),
                new MousePosition({
                    projection: this.state.projection_display,
                    coordinateFormat: (coord) => coordinateFormat(coord, '{y},{x}', 6),
                    undefinedHTML: '',
                }),
                new СуурьДавхарга({layers: base_layer_controls}),
                new SidebarButton({toggleSidebar: this.toggleSidebar}),
                new SearchBarButton({searchSidebar: this.searchSidebar}),
                new DrawButton({toggleDraw: this.toggleDraw}),
                new ScaleLine(),
                this.controls.modal,
                this.controls.shopmodal,
                this.controls.drawModal,
                this.controls.coordinateCopy,
                this.controls.sidebar,
                this.controls.searchbar,
                this.controls.cart,
                this.controls.alertBox,
                this.controls.popup,
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
                minZoom: 1,
            })
        })

        map.on('click', this.handleMapClick)
        this.map = map
        this.controls.popup.blockPopUp(true, this.getElement, this.onClickCloser)
    }

    onClickCloser(){
        const overlay = this.overlay
        const closer = this.element_closer
        overlay.setPosition(undefined);
        closer.blur();
        this.state.vector_layer.setSource(null)
    }

    getElement(element) {
        const map = this.map
        const overlay = new Overlay({
            element: element,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
            autoPanMargin: 65,
            offset: [15, -150],
            positioning: 'top-right'
        });

        map.addOverlay(overlay)
        this.element = element
        this.overlay = overlay
        const elementa = element.children[0]
        this.element_content = elementa.children[1]
        this.element_closer = elementa.children[0]
    }

    handleMapClick(event) {

        const coordinate = event.coordinate
        this.marker.point.setCoordinates(coordinate)
        const overlay = this.overlay

        const projection = event.map.getView().getProjection()
        const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
        const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)

        this.setState({coordinate_clicked})

        overlay.setPosition(coordinate)
        this.showFeaturesAt(coordinate)

        // Nov-15: commented for UX
        //this.showFeaturesAt(event.coordinate)

    }

    listToJson(feature_info, geodb_table){
        feature_info.map((info, ix) => {
            this.object = new Array()
            const rsp = {
                'field_name': info[0]
            }
            this.object.push(rsp)
            info[1].map((info_data, i) => {
                var field_name = ''
                if(info_data[0] == 'point_name') field_name = 'Цэгийн Нэр'
                else if(info_data[0] == 'point_id') field_name = 'Цэгийн дугаар'
                else if(info_data[0] == 'point_class_name') field_name = 'Сүлжээний төрөл'
                else if(info_data[0] == 'aimag') field_name = 'Аймаг'
                else if(info_data[0] == 'sum') field_name = 'Сум'
                else if(info_data[0] == 'mclass') field_name = 'Сүлжээний зэрэг'
                else if(info_data[0] == 'name') field_name = 'нэр'
                else field_name = info_data[0]
                const rsp = {
                    'field_name': info_data[0],
                    'value': info_data[1],
                    'mn_name': field_name,
                }
                this.object.push(rsp)
            })
            this.object.push({'mode': geodb_table})
        })
        return this.object
    }

    showFeaturesAt(coordinate) {
        this.sendFeatureInfo = []
        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()
        this.setState({pay_modal_check: false})
        this.state.map_wms_list.map(({layers}) => {
            layers.map(({tile, feature_price,geodb_export_field, geodb_pk_field, geodb_schema, geodb_table, code}) => {
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
                            if (features.length > 0) {
                                features.map((feature, idx) => {
                                    if(feature.getGeometry().getType().includes('Polygon')) {
                                        const source = new VectorSource({
                                            features: features
                                        });
                                        this.selectSource = source
                                        this.state.vector_layer.setSource(this.selectSource)
                                    }
                                })
                            }
                            const feature_info = features.map((feature) => {
                                const geometry_name = feature.getGeometryName()
                                const values =
                                    feature.getKeys()
                                    .filter((key) => key != geometry_name)
                                    .map((key) => [key, feature.get(key)])
                                return [feature.getId(), values]
                            })
                            if(!this.state.is_draw_open){
                                if(feature_info.length > 0) {
                                    if(this.sendFeatureInfo.length > 0) {
                                        this.sendFeatureInfo.map((feat, idx) => {
                                            if (feat[0].field_name !== feature_info[0][0]) {
                                                const object = this.listToJson(feature_info, geodb_table)
                                                this.sendFeatureInfo.push(object)
                                            }
                                        })
                                    } if (this.sendFeatureInfo.length == 0) {
                                        const object = this.listToJson(feature_info, geodb_table)
                                        this.sendFeatureInfo.push(object)
                                    }
                                this.controls.popup.getData(true, this.sendFeatureInfo, this.onClickCloser, this.setSourceInPopUp, feature_price)
                                if(geodb_table == 'mpoint_view'){
                                    this.state.vector_layer.setSource(null)
                                }
                            }
                                // if(geodb_table == 'mpoint_view'){
                                //     if(feature_info.length > 0){
                                //         // this.controls.shopmodal.showModal(feature_price,geodb_export_field, geodb_pk_field, geodb_schema, geodb_table, code,feature_info, true, this.cartButton)
                                //         this.setState({pay_modal_check: true})
                                //         this.state.vector_layer.setSource(null)
                                //     }
                                //     // else{
                                //         // this.controls.alertBox.showAlert(true, "Цэгээ дахин шалгана уу !")
                                //     // }
                                // }
                                // else{
                                //     if(!this.state.pay_modal_check && geodb_table != 'privite') {
                                //         this.state.vector_layer.setSource(source)
                                //         // this.controls.modal.showModal(feature_info, true)
                                //     }
                                // }
                            }
                        })
                } else {
                    /* TODO */
                    console.log('no feature url', wms_source);
                }
            })
        })
        this.sendFeatureInfo = []
    }

    setSourceInPopUp(mode) {
        const source = this.selectSource
        if (mode != 'private') {
            this.state.vector_layer.setSource(null)
        }
        if (mode == 'private') {
            this.state.vector_layer.setSource(source)
        }
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
        view.animate({zoom: zoom}, {center: view.setCenter(map_coord)});
    }

    toggleSidebar(event) {
        this.setState(prevState => ({
            is_sidebar_open: !prevState.is_sidebar_open,
        }))
        if(this.state.is_sidebar_open){
            this.controls.sidebar.showSideBar(this.state.map_wms_list, true)
        }else{
            this.controls.sidebar.showSideBar(this.state.map_wms_list, false)
        }
    }

    searchSidebar(event) {
        this.setState(prevState => ({
            is_search_sidebar_open: !prevState.is_search_sidebar_open,
        }))
        if(this.state.is_search_sidebar_open){
            this.controls.searchbar.showSideBar(null, true)
        }else{
            this.controls.searchbar.showSideBar(this.handleSetCenter, false)
        }
    }

    toggleDrawed(event){
        const projection = this.map.getView().getProjection()
        const coordinat = event.feature.getGeometry().getCoordinates()

        const coodrinatLeftTop = coordinat[0][3]
        const coodrinatLeftTop_map_coord = transformCoordinate(coodrinatLeftTop, projection, this.state.projection_display)
        const coodrinatLeftTopFormat = coordinateFormat(coodrinatLeftTop_map_coord, '{y},{x}', 6)

        const coodrinatRightBottom = coordinat[0][1]
        const coodrinatRightBottom_map_coord = transformCoordinate(coodrinatRightBottom, projection, this.state.projection_display)
        const coodrinatRightBottomFormat = coordinateFormat(coodrinatRightBottom_map_coord, '{y},{x}', 6)

        const { bundle, map_wms_list } = this.state

        const layer_info = {
            bundle: { id: bundle.id },
            wms_list: map_wms_list.reduce((acc, { name, layers }) => {
                const wms = {
                    name,
                    layers: layers.reduce((acc, { id, name, tile }) => {
                        if (tile.getVisible())
                            acc.push({ id, name })
                        return acc
                    }, []),
                }
                if (wms.layers.length)
                    acc.push(wms)
                return acc
            }, [])
        }

        this.controls.drawModal.showModal(coodrinatLeftTop_map_coord, coodrinatRightBottom_map_coord, layer_info)
    }

    toggleDrawRemove(){
        const features = this.state.source_draw.getFeatures();
        if(features.length > 0)
        {
            const lastFeature = features[features.length - 1];
            this.state.source_draw.removeFeature(lastFeature);
        }
    }

    toggleDraw() {

        this.setState(prevState => ({
            is_draw_open: !prevState.is_draw_open,
        }))

        if(this.state.is_draw_open){
            const source_draw = new VectorSource()

            const draw_layer = new VectorLayer({
                source: source_draw
            })

            this.setState({source_draw})

            const draw = new Draw({
                source: this.state.source_draw,
                type: 'Circle',
                geometryFunction: createBox(),
            });
            this.setState({draw, draw_layer})
            this.map.addLayer(draw_layer);
            this.map.addInteraction(draw);
            draw.on('drawend', this.toggleDrawed)
            draw.on('drawstart', this.toggleDrawRemove)
        }
        else{
            this.map.removeInteraction(this.state.draw);
            this.toggleDrawRemove()
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
