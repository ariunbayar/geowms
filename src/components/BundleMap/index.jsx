import React, { Component } from "react"

import 'ol/ol.css'
import { Map, View, Feature, Overlay } from 'ol'
import { transform as transformCoordinate, fromLonLat } from 'ol/proj'
import { WMSGetFeatureInfo, GeoJSON } from 'ol/format'
import { getArea } from 'ol/sphere';
import { toLonLat } from 'ol/proj';
import { Vector as VectorLayer, Tile, Image } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Icon, Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import { Point } from 'ol/geom'
import { TileImage, TileWMS } from 'ol/source'
import { format as coordinateFormat } from 'ol/coordinate';
import { defaults as defaultControls, FullScreen, MousePosition, ScaleLine } from 'ol/control'
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import ImageWMS from 'ol/source/ImageWMS';
import { СуурьДавхарга } from './controls/СуурьДавхарга'
import { CoordinateCopy } from './controls/CoordinateCopy'
import { Modal } from './controls/Modal'
import { ShopModal } from './ShopControls/Modal'
import { ShopCart } from './ShopControls/ShopCart'
import { DrawPayModal } from './controls/DrawPayModal'
import "./styles.css"
import { service } from './service'
import { SidebarButton } from './SidebarButton'
import { Sidebar } from './Sidebar'
import { PopUp } from './popUp/PopUp'
import { AlertRoot } from "./ShopControls/alert"
import Loader from '@utils/Loader'


export default class InspireMap extends Component {

    constructor(props) {
        super(props)
        this.sendFeatureInfo = []
        this.is_not_visible_layers = []
        this.saved_aimag_name = ''
        this.state = {
            projection: 'EPSG:3857',
            is_authenticated: false,
            projection_display: 'EPSG:4326',
            bundle: props.bundle,
            map_wms_list: [],
            is_sidebar_open: true,
            is_search_sidebar_open: true,
            is_modal_info_open: false,
            coordinate_clicked: null,
            vector_layer: null,
            is_draw_open: false,
            draw_layer: null,
            draw: null,
            source_draw: null,
            is_cart: false,
            y: null,
            x: null,
            is_loading: false,
            format: new GeoJSON(),
            layer_one_tile: null,
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
            modal: new Modal(),
            shopmodal: new ShopModal(),
            cart: new ShopCart(),
            drawModal: new DrawPayModal(),
            sidebar: new Sidebar(),
            alertBox: new AlertRoot(), // this.controls.alertBox.showAlert(true, "....")
            popup: new PopUp(),
        }

        this.marker = this.initMarker()

        this.handleToggle = this.handleToggle.bind(this)
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.handleSetCenter = this.handleSetCenter.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.loadWmsLayers = this.loadWmsLayers.bind(this)
        this.addWmsLayers = this.addWmsLayers.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
        this.cartButton = this.cartButton.bind(this)
        this.onClickCloser = this.onClickCloser.bind(this)
        this.getElement = this.getElement.bind(this)
        this.setSourceInPopUp = this.setSourceInPopUp.bind(this)
        this.formatArea = this.formatArea.bind(this)
        this.handleModalApproveClose = this.handleModalApproveClose.bind(this)
        this.getOnlyFeature = this.getOnlyFeature.bind(this)
        this.resetFilteredOnlyFeature = this.resetFilteredOnlyFeature.bind(this)
        this.allLayerVisible = this.allLayerVisible.bind(this)
        this.addLayerToSearch = this.addLayerToSearch.bind(this)
        this.drawBorderCircle = this.drawBorderCircle.bind(this)
        this.fromLonLatToMapCoord = this.fromLonLatToMapCoord.bind(this)
        this.check_inspire_layer = this.check_inspire_layer.bind(this)
        this.transformToLatLong = this.transformToLatLong.bind(this)
        this.setFeatureOnMap = this.setFeatureOnMap.bind(this)
        this.removeFeatureFromSource = this.removeFeatureFromSource.bind(this)
        this.getFeatureInfoFromInspire = this.getFeatureInfoFromInspire.bind(this)
        this.writeFeat = this.writeFeat.bind(this)
        this.getPopUpInfo = this.getPopUpInfo.bind(this)
        this.setVisibleMarket = this.setVisibleMarket.bind(this)

        this.readFeatures = this.readFeatures.bind(this)
        this.readFeature = this.readFeature.bind(this)
        this.getErguulLayer = this.getErguulLayer.bind(this)
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

    handleModalApproveClose(){
      this.setState({'is_modal_info_open': false})
    }

    cartButton(is_cart, point_name, code, point_id, is_again_clicked, geom_name, pdf_id){
        if(is_cart == true){
            this.controls.cart.showModal(
                this.state.coordinate_clicked,
                is_cart,
                this.state.x,
                this.state.y,
                point_name,
                code,
                point_id,
                is_again_clicked,
                geom_name, pdf_id
            )
        }
    }

    componentDidMount() {
      service.getUser().then(({is_authenticated}) =>
        {
            this.setState({is_authenticated})
        })
        this.loadMapData()
    }

    getFullName(feature) {
        const first_name = feature.getProperties().first_name
        const last_name = feature.getProperties().last_name
        const last_name_conv = last_name.charAt(0).toUpperCase()
        const firt_name_conv = first_name.charAt(0).toUpperCase() + first_name.slice(1)
        const full_name = last_name_conv + '. ' + firt_name_conv
        return full_name
    }

    getErguulLayer() {
        const erguul_layer_name = 'erguul'
        const erguul_layer = new VectorLayer({
            source: new VectorSource({}),
            style: (feature, resolution) => {
                const text = resolution < 100 ? feature.get("name") : "";
                return new Style({
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({
                            color: this.props.point_color,
                        }),
                    }),
                    text: new Text({
                        text: text,
                        font: '20px Calibri,sans-serif',
                        stroke: new Stroke({
                        color: 'white',
                        width: 1,
                        }),
                        offsetY: -18
                    }),
                })
            },
            name: erguul_layer_name,
        })
        this.map.addLayer(erguul_layer)
        this.erguul_layer = erguul_layer
    }

    readFeature(feature) {
        const id = 'aimag_sum'
        const { vector_layer } = this.state
        this.removeFeatureFromSource(id)
        const feat =  new GeoJSON().readFeatures(feature, {
            dataProjection: this.state.projection_display,
            featureProjection: this.state.projection,
        })[0];
        vector_layer.getSource().addFeature(feat)
        feat.setProperties({ id })
        this.map.getView().fit(feat.getGeometry(),{ padding: [50, 50, 50, 50], duration: 2000 })
    }

    readFeatures(features) {
        const erguul_layer = this.erguul_layer
        const erguul_source = erguul_layer.getSource()
        features['features'].map((feat, idx) => {
            const feature =  new GeoJSON().readFeatures(feat, {
                dataProjection: this.state.projection_display,
                featureProjection: this.state.projection,
            })[0];
            const full_name = this.getFullName(feature)
            feature.setProperties({ name: full_name })
            erguul_source.addFeature(feature)
        })
        const style = erguul_layer.getStyle()
        const fill = style().getImage().getFill()
        const color = fill.getColor()
        const { map_wms_list } = this.state
        const object = {
            'name': 'Эргүүл',
            'layers': [
                {
                    'name': 'Эргүүлд гарсан хүмүүс',
                    'wms_tile': erguul_layer,
                    'defaultCheck': 1,
                    'is_change_color': true,
                    'color': color,
                }
            ]
        }
        map_wms_list.unshift(object)
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.coordinate_clicked !== this.state.coordinate_clicked) {
            this.controls.coordinateCopy.setCoordinate(this.state.coordinate_clicked)
        }

        if (prevProps.features !== this.props.features) {
            this.readFeatures(this.props.features)
        }

        if (prevProps.feature !== this.props.feature) {
            if (this.props.feature !== {}) {
                this.readFeature(this.props.feature)
            }
        }

        if (this.props.bundle.id !== prevProps.bundle.id) {
            const {bundle} = this.props
            this.setState({bundle})
            if (bundle.id) {
                this.setState({is_sidebar_open: false})
                this.controls.sidebar.showSideBar([], true, this.addLayerToSearch)
                this.loadWmsLayers(bundle.id)
            }
        }
        if (this.props.code !== prevProps.code) {
            const {code, url} = this.props
            this.oneLayerAdd(url, code)
            this.setState({is_loading: true})
        }

        if (this.state.map_wms_list !== prevState.map_wms_list) {
            this.setState({map_wms_list: this.state.map_wms_list})
        }
    }

    loadMapData() {
        Promise.all([
            service.loadBaseLayers(),
        ]).then(([{base_layer_list}]) => {
            this.handleMapDataLoaded(base_layer_list)
        })
    }

    loadWmsLayers(bundle_id) {
        this.setState({is_loading: true})
        Promise.all([
            service.loadWMSLayers(bundle_id),
        ]).then(([{ wms_list }]) => {
            this.addWmsLayers(wms_list)
            this.props.loadErguul && this.props.loadErguul((val) => this.readFeatures(val))
            let is_nema = true
            this.props.loadNema && this.props.loadNema((wms_list) => this.addWmsLayers(wms_list, is_nema))
        })
    }

    oneLayerAdd(url, code){
        const {layer_one_tile} = this.state
        this.map.removeLayer(layer_one_tile)
        if(code){
            const _layer_one_tile = new Image({
                source: new ImageWMS({
                    projection: this.state.projection,
                    ratio: 1,
                    url: url,
                    params: {
                        'LAYERS': code,
                        'FORMAT': 'image/png',
                        'VERSION': '1.1.1',
                        "STYLES": '',
                        "exceptions": 'application/vnd.ogc.se_inimage',
                    }
                }),
            })
            this.setState({layer_one_tile: _layer_one_tile})
            this.map.addLayer(_layer_one_tile)
            setTimeout(() => {
                this.setState({is_loading: false})
            }, 500);
        }else{
            setTimeout(() => {
                this.setState({is_loading: false})
            }, 500);
        }
    }

    addWmsLayers(wms_list){
        const {map_wms_list} = this.state
        this.map.removeLayer(
            ...map_wms_list.reduce((acc_main, wms) =>
            {
                    const tiles = wms.layers.map((layer) => layer.wms_or_cache_ur ? layer.tile : layer.wms_tile)
                    return [...acc_main, ...tiles]
            }, []),
        )

        var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
        var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];
        if(wms_list.length > 0) {
            const _map_wms_list = wms_list.map(({name, url, chache_url, wms_or_cache_ur, layers}) => {
                return {
                    name,
                    layers: layers.map((layer) => {
                        return {
                            ...layer,
                            wms_or_cache_ur,
                            tile: new Tile({
                                minZoom: layer.zoom_start,
                                maxZoom: layer.zoom_stop,
                                source: new WMTS({
                                    url: chache_url,
                                    layer: layer.code,
                                    matrixSet: "EPSG:4326",
                                    format: 'image/png',
                                    projection: this.state.projection_display,
                                    tileGrid: new WMTSTileGrid({
                                        tileSize: [256,256],
                                        extent: [-180.0,-90.0,180.0,90.0],
                                        origin: [-180.0, 90.0],
                                        resolutions: resolutions,
                                        matrixIds: gridNames,
                                    }),
                                    style: '',
                                    wrapX: true,
                                }),
                            }),
                            wms_tile: new Image({
                                source: new ImageWMS({
                                    projection: this.state.projection,
                                    ratio: 1,
                                    url: url,
                                    params: {
                                        'LAYERS': layer.code,
                                        'FORMAT': 'image/png',
                                        'VERSION': '1.1.1',
                                        "STYLES": '',
                                        "exceptions": 'application/vnd.ogc.se_inimage',
                                    }
                                }),
                            })
                        }
                    }),
                }
            })
            if (map_wms_list.length > 0) {
                _map_wms_list.map((layer, idx) => {
                    map_wms_list.push(layer)
                })
                console.log('map_wms_list', map_wms_list)
                this.setState({ map_wms_list: map_wms_list })

            }
            else {
                this.setState({ map_wms_list: _map_wms_list })
            }
            _map_wms_list.map((wms, idx) =>
                wms.layers.map((layer, idx) => {
                    layer.defaultCheck == 0 && layer.tile.setVisible(false)
                    layer.defaultCheck == 0 && layer.wms_tile.setVisible(false)
                    layer['legend'] = layer.wms_tile.getSource().getLegendUrl()
                })
            )

            this.map.addLayer(
                    ..._map_wms_list.reduce((acc_main, wms) =>
                    {
                            const tiles = wms.layers.map((layer) => layer.wms_or_cache_ur ? layer.tile : layer.wms_tile)
                            return [...acc_main, ...tiles]
                    }, []),
            )
            this.setState({is_loading: false})
        }
        else{
            this.setState({map_wms_list: []})
            setTimeout(() => {
                this.setState({is_loading: false})
            }, 500);
        }
    }


    handleMapDataLoaded(base_layer_list) {
        this.setState({is_loading: true})

        const base_layer_name = 'base_layer'
        const {base_layers, base_layer_controls} =
            base_layer_list.reduce(
                (acc, base_layer_info, idx) => {

                    let layer

                    if (base_layer_info.tilename == "xyz") {
                        layer = new Tile({
                            preload: 6,
                            source: new TileImage({
                                crossOrigin: 'Anonymous',
                                url: base_layer_info.url,
                            }),
                            name: base_layer_name,
                        })
                    }

                    if (base_layer_info.tilename == "wms") {
                        layer = new Image({
                            source: new ImageWMS({
                                ratio: 1,
                                url: base_layer_info.url,
                                params: {
                                    'LAYERS': base_layer_info.layers,
                                    'FORMAT': 'image/png',
                                    'VERSION': '1.1.1',
                                    "STYLES": '',
                                    "exceptions": 'application/vnd.ogc.se_inimage',
                                }
                            }),
                            name: base_layer_name,
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

        const vector_layer_name = 'vector_layer'
        const vector_layer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(100, 255, 0, 1)',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(100, 255, 0, 0.3)'
                })
            }),
            name: vector_layer_name,
        })
        this.setState({vector_layer})

        const maker_layer_name = 'marker_layer'
        const marker_layer = new VectorLayer({
            source: new VectorSource({
                features: [this.marker.feature],
            }),
            name: maker_layer_name,
        })
        this.marker_layer = marker_layer

        const map = new Map({
            maxTilesLoading: 16,
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
                new ScaleLine(),
                this.controls.modal,
                this.controls.shopmodal,
                this.controls.drawModal,
                this.controls.coordinateCopy,
                this.controls.sidebar,
                this.controls.cart,
                this.controls.alertBox,
            ]),
            layers: [
                ...base_layers,
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
        this.getErguulLayer()
        this.setState({is_loading: false})

    }

    onClickCloser(){
        const overlay = this.overlay
        const closer = this.element_closer
        overlay.setPosition(undefined);
        closer.blur();
        this.setVisibleMarket(false)
        // this.state.vector_layer.setSource(null)
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
        });

        map.addOverlay(overlay)
        this.element = element
        this.overlay = overlay
        const elementa = element.children[0]
        this.element_content = elementa.children[1]
        this.element_closer = elementa.children[0]
    }

    handleMapClick(event) {
        if(!this.state.is_draw_open) {

            const coordinate = event.coordinate
            this.marker.point.setCoordinates(coordinate)

            const projection = event.map.getView().getProjection()
            const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
            const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)

            this.setState({ coordinate_clicked })
            this.showFeaturesAt(coordinate)
        }
    }

    allLayerVisible(changed_layers) {
        this.removeFeatureFromSource('buffer')
        this.map.getLayers().getArray().forEach((layer) => {
            if(layer.get('filter') && layer.get('filter') == this.state.filtered_layer_name) {
                layer.setVisible(false)
                this.map.removeLayer(layer)
            }
            if(changed_layers) {
                if(layer.get('code') && layer.getVisible()) {
                    layer.setVisible(false)
                }
                if(layer.get('name') == 'inside') {
                    if(layer.getVisible()) {
                        layer.setVisible(false)
                        this.map.removeLayer(layer)
                    }
                }
            }
            else {
                if(layer.get('code') && (layer.get('name') && layer.get('name') != 'inside')) {
                    if(layer.getVisible()) {
                        this.is_not_visible_layers.push(layer.get('code'))
                        layer.setVisible(false)
                    }
                }
            }
        })
    }

    addLayerToSearch(add_layers, layer_name, is_visible) {
        if (this.state.filtered_wms) {
            if (is_visible) {
                add_layers.map(layer => {
                    this.is_not_visible_layers.push(layer.code)
                    layer.wms_or_cache_ur ? layer.tile.setVisible(false) : layer.wms_tile.setVisible(false)
                })
            }
            else {
                add_layers.map(layer => {
                    const filtered = this.is_not_visible_layers.filter(layer_code => {
                        return layer_code !== layer.code

                    })
                    this.is_not_visible_layers = filtered
                    layer.wms_or_cache_ur ? layer.tile.setVisible(false) : layer.wms_tile.setVisible(false)
                })
            }
            const { aimag_name, search_coordinate, sum_name, search_scale } = this.state
            this.getOnlyFeature(aimag_name, search_coordinate, sum_name, search_scale, this.is_not_visible_layers)
        } else {
            add_layers.map(layer => {
                layer.wms_or_cache_ur ? layer.tile.setVisible(is_visible) : layer.wms_tile.setVisible(is_visible)
            })
        }
    }

    resetFilteredOnlyFeature() {
        this.removeFeatureFromSource('aimag_sum')
        this.removeFeatureFromSource('buffer')

        this.map.getLayers().forEach((layer) => {
            if(layer) {
                this.is_not_visible_layers.map((visible_layer_code) => {
                    if(layer.get('code') == visible_layer_code) {
                        layer.setVisible(true)
                    }
                    if(this.state.filtered_layer_name && layer.get('filter') == this.state.filtered_layer_name){
                        this.map.removeLayer(layer)
                    }
                })
                if (layer.get("name") == 'inside') {
                    this.map.removeLayer(layer)
                }
            }
        })
        this.setState({ filtered_wms: undefined, filtered_layer: undefined })
        this.is_not_visible_layers = []
        this.onClickCloser()
    }

    getKiloFromScale(scale) {
        return scale / 1000
    }

    fromLonLatToMapCoord(coordinate) {
        return fromLonLat([coordinate[0], coordinate[1]]);
    }

    drawBorderCircle(buffer_feature) {
        this.removeFeatureFromSource('aimag_sum')
        const { vector_layer } = this.state
        const features = (this.state.format.readFeatures(buffer_feature, {
            dataProjection: this.state.projection_display,
            featureProjection: this.state.projection,
        }))
        features[0].setProperties({ id: 'buffer' })
        vector_layer.getSource().addFeature(features[0])
    }

    getOnlyFeature(aimag_name, coordinate, sum_name, scale, changed_layers) {
        this.onClickCloser()
        this.allLayerVisible(changed_layers)
        if(changed_layers) this.is_not_visible_layers = changed_layers
        var filtered_layer_name
        const filtered_wms = this.state.map_wms_list.map(({name, layers}) => {
            var cql_filter = ''
            return {
                name: name,
                layers: this.is_not_visible_layers.map((layer_code) => {
                    var filtered_layer
                    var filtered_tile
                    layers.map((layer) => {
                        if (layer_code == layer.code) {
                            filtered_layer = layer
                            const main_url = layer.tile.getSource().urls[0]
                            if (!aimag_name && coordinate) {
                                const kilometers = this.getKiloFromScale(scale)
                                cql_filter = "DWITHIN(geom,Point(" + coordinate[0] + " " + coordinate[1] + ")," + kilometers + ",kilometers)"
                                filtered_layer_name = coordinate[0] + "," + coordinate[1]
                            }
                            else if (aimag_name && sum_name) {
                                cql_filter = "aimag='" + aimag_name + "' AND sum='" + sum_name + "'"
                                filtered_layer_name = aimag_name + '_' + sum_name
                            }
                            else if (aimag_name && !sum_name) {
                                cql_filter = "aimag='" + aimag_name + "'"
                                filtered_layer_name = aimag_name
                            }
                            const tile = new Tile ({
                                source: new TileWMS({
                                    projection: this.state.projection,
                                    url: main_url,
                                    params: {
                                        'LAYERS': layer.code,
                                        //'FORMAT': 'image/svg+xml',
                                        'FORMAT': 'image/png',
                                        "cql_filter": cql_filter,
                                    }
                                }),
                                filter: filtered_layer_name
                            })
                            if (!aimag_name && coordinate) this.drawBorderCircle(coordinate, this.getKiloFromScale(scale))
                            if(tile) {
                                this.map.addLayer(tile)
                                filtered_tile = tile
                            }
                        }
                    })
                    return {
                        ...filtered_layer,
                        tile: filtered_tile
                    }
                }),
            }
        })
        this.setState({filtered_wms, filtered_layer_name, aimag_name, search_coordinate: coordinate, sum_name, search_scale: scale})
        if(!sum_name) {
            this.showFeaturesAt(this.fromLonLatToMapCoord(coordinate))
        }
    }

    getWMSArray() {
        this.array = []
        if (this.state.map_wms_list) {
            this.array = this.state.map_wms_list
        }
        else if (this.state.filtered_wms) {
            this.array = this.state.filtered_wms
        }
        return this.array
    }

    check_inspire_layer(code) {
        let is_feature = false
        let layer_code = ''
        let splited_code = code.split('_')
        splited_code.map((split_code, idx) => {
            if (idx == 0 && split_code == 'gp') {
                if (splited_code[idx + 1] == 'layer') {
                    let sliced_code = splited_code.slice(2)
                    layer_code = sliced_code.join("_");
                    is_feature = true
                }
            }
        })
        return {layer_code, is_feature}
    }

    getPopUpInfo(coordinate, layers_code) {
        const latlong = toLonLat(coordinate)
        let layer_codes = layers_code.length > 0 ? layers_code : this.is_not_visible_layers.length > 0 ? this.is_not_visible_layers : []
        service
            .getPopUpInfo(layer_codes, latlong)
            .then(({ datas }) => {
                let is_empty = false
                const is_from_inspire = true
                if (this.sendFeatureInfo.length > 0) {
                    this.sendFeatureInfo.map((info, idx) => {
                        datas.push(info[0])
                    })
                }
                if (datas.length == 0) {
                    is_empty = true
                }
            })
    }

    showFeaturesAt(coordinate) {
        this.is_empty = true
        this.sendFeatureInfo = []

        // const overlay = this.overlay
        // overlay.setPosition(coordinate)

        this.setState({ pay_modal_check: false })

        this.sendFeatureInfo = []
        this.is_empty = true
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

    handleSetCenter(coord, zoom, has_marker=true) {
        this.removeFeatureFromSource('buffer')
        this.removeFeatureFromSource('aimag_sum')
        const view = this.map.getView()
        const map_projection = view.getProjection()
        const map_coord = transformCoordinate(coord, this.state.projection_display, map_projection)
        if (has_marker) this.marker.point.setCoordinates(map_coord)
        view.animate({zoom: zoom}, {center: view.setCenter(map_coord)});
    }

    removeFeatureFromSource(featureID) {
        const { vector_layer } = this.state
        const source = vector_layer.getSource()
        const features = source.getFeatures();
        if (features != null && features.length > 0) {
            for (var i = 0; i < features.length; i++) {
                const properties = features[i].getProperties();
                const id = properties.id;
                if (id == featureID) {
                    source.removeFeature(features[i]);
                    break;
                }
            }
        }
    }

    setVisibleMarket(is_true) {
        this.marker_layer.setVisible(is_true)
    }

    getFeatureInfoFromInspire(feature, point_coordinate, scale) {
        this.onClickCloser()
        this.setVisibleMarket(false)

        let parsed_geojson
        let km_scale = null

        if (feature) {
            const geom = this.writeFeat(feature[0])
            parsed_geojson = JSON.parse(geom).geometry
        }
        else {
            parsed_geojson = point_coordinate
            km_scale = this.getKiloFromScale(scale)
        }

        const wms_array = this.getWMSArray()
        wms_array.map(({ layers }, w_idx) => {
            if(layers) {
                layers.map(({tile, code}, idx) => {
                    if (tile.getVisible()) {
                        const {layer_code, is_feature} = this.check_inspire_layer(code)
                        if (is_feature) {
                            this.is_not_visible_layers.push(layer_code)
                        }
                    }
                })
            }
        })

        this.allLayerVisible('inside')

        service
            .getContainGeoms(this.is_not_visible_layers, parsed_geojson, km_scale)
            .then(({ features, layers_code, buffer, success }) => {
                if (success) {
                    this.is_not_visible_layers = layers_code
                    const features_col = (this.state.format.readFeatures(features, {
                        dataProjection: this.state.projection_display,
                        featureProjection: this.state.projection,
                    }))
                    const style = new Style({
                        image: new CircleStyle({
                            radius: 5,
                            fill: new Fill({
                            color: 'red',
                            }),
                        }),
                        stroke: new Stroke({
                            color: 'blue',
                            width: 2,
                        }),
                        fill: new Fill({
                            color: 'rgba(0,191,255,0.3)',
                        }),
                    })
                    const source =  new VectorSource({
                        features: features_col,
                    })
                    const layer = new VectorLayer({
                        source: source,
                        name: "inside",
                        style: style,
                    })
                    if (buffer) {
                        this.drawBorderCircle(buffer)
                    }
                    this.map.addLayer(layer)
                    layer.setVisible(true)
                    this.setState({ filtered_layer: layer })
                }
            })
    }

    writeFeat(features) {
        const {format} = this.state
        const data = format.writeFeatureObject(features, {
            dataProjection: this.state.projection_display,
            featureProjection: this.state.projection,
        })
        const changedFeature = JSON.stringify(data)
        return changedFeature
    }

    setFeatureOnMap(feature, point_coordinate, scale) {
        if (feature) {
            const { vector_layer } = this.state
            const id = 'aimag_sum'
            this.removeFeatureFromSource(id)
            var feature =  new GeoJSON().readFeatures(feature, {
                dataProjection: this.state.projection_display,
                featureProjection: this.state.projection,
            });
            feature[0].setProperties({ id })
            vector_layer.getSource().addFeature(feature[0])
            this.map.getView().fit(feature[0].getGeometry(),{ padding: [100, 100, 100, 100], duration: 2000 })
        }
        this.getFeatureInfoFromInspire(feature, point_coordinate, scale)
    }

    toggleSidebar(is_not_open) {

        let is_setState = true
        if (is_not_open == this.state.is_sidebar_open) {
            is_setState = false
        }
        if (is_setState) {
            this.setState(prevState => ({
                is_sidebar_open: !prevState.is_sidebar_open,
            }))
        }

        var islaod
        if(this.state.is_sidebar_open){
            islaod = true
        }

        else {
            islaod = false
        }
        this.controls.sidebar.showSideBar(this.state.map_wms_list, islaod, this.addLayerToSearch)

    }

    transformToLatLong(coordinateList) {
        const geom = coordinateList[0].map((coord, idx) => {
            const map_coord = transformCoordinate(coord, this.state.projection, this.state.projection_display)
              return map_coord
        })
        return geom
      }

    formatArea(polygon) {
        const area = getArea(polygon);
        let output;
        let type;
        if (area > 10000) {
          output = Math.round((area / 1000000) * 100) / 100;
          type = 'km'
        } else {
          output = Math.round(area * 100) / 100;
          type = 'm'
        }
        return {output, type};
    };

    calcPrice(feature_geometry, layer_info, coodrinatLeftTop_map_coord, coodrinatRightBottom_map_coord, feature_info_list) {
        const area = this.formatArea(feature_geometry)
        var layer_list = []
        layer_info.wms_list.map((w, idx) => {
            w.layers.map((layer, idx) => {
                layer_list.push(layer.code)
            })
        })
        const is_loading = false
        this.controls.drawModal.showModal(is_loading, coodrinatLeftTop_map_coord, coodrinatRightBottom_map_coord, layer_info, area, feature_info_list, layer_list)
    }


    render() {
        const {is_loading} = this.state
        return (
            <div>
                <Loader is_loading={is_loading}></Loader>
                <div
                    id="map"
                    style={{height:"calc( 80vh - 85px - 15px)"}}
                >
                </div>
            </div>
        )
    }
}
