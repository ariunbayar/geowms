import React, { Component } from "react"

import 'ol/ol.css'
import { Map, View, Feature, Overlay } from 'ol'
import { transform as transformCoordinate, fromLonLat } from 'ol/proj'
import { WMSGetFeatureInfo, GeoJSON } from 'ol/format'
import { getArea } from 'ol/sphere';
import { toLonLat } from 'ol/proj';
import { Vector as VectorLayer, Tile, Image } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Icon, Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style'
import { Point, Circle, Polygon } from 'ol/geom'
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
import { SearchBarComponent } from './searchControl/SearchBar'
import { DrawButton } from './controls/Draw'
import { PopUp } from './popUp/PopUp'
import Draw, { createBox } from 'ol/interaction/Draw';
import { AlertRoot } from "./ShopControls/alert"
import ModalAlert from "@utils/Modal/ModalAlert"
import SideBar from "./SideBar"
import WMSItem from './WMSItem'


export default class BundleMap extends Component {

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
            format: new GeoJSON(),
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
            modal: new Modal(),
            shopmodal: new ShopModal(),
            cart: new ShopCart(),
            drawModal: new DrawPayModal(),
            alertBox: new AlertRoot(), // this.controls.alertBox.showAlert(true, "....")
            popup: new PopUp(),
        }

        this.marker = this.initMarker()

        this.handleToggle = this.handleToggle.bind(this)
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.handleSetCenter = this.handleSetCenter.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
        this.toggleDraw = this.toggleDraw.bind(this)
        this.toggleDrawed = this.toggleDrawed.bind(this)
        this.toggleDrawRemove = this.toggleDrawRemove.bind(this)
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
        this.featureFromUrl = this.featureFromUrl.bind(this)
        this.check_inspire_layer = this.check_inspire_layer.bind(this)
        this.transformToLatLong = this.transformToLatLong.bind(this)
        this.setFeatureOnMap = this.setFeatureOnMap.bind(this)
        this.removeFeatureFromSource = this.removeFeatureFromSource.bind(this)
        this.getFeatureInfoFromInspire = this.getFeatureInfoFromInspire.bind(this)
        this.writeFeat = this.writeFeat.bind(this)
        this.getPopUpInfo = this.getPopUpInfo.bind(this)
        this.setVisibleMarket = this.setVisibleMarket.bind(this)
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

        var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
        var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

        const map_wms_list = wms_list.map(({name, url, chache_url, wms_or_cache_ur, layers}) => {
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
        map_wms_list.map((wms, idx) =>
            wms.layers.map((layer, idx) => {
                layer.defaultCheck == 0 && layer.tile.setVisible(false)
                layer.defaultCheck == 0 && layer.wms_tile.setVisible(false)
                layer['legend'] = layer.wms_tile.getSource().getLegendUrl()
            })
        )
        this.setState({map_wms_list})

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
                    if (base_layer_info.tilename == "wmts") {
                        layer = new Tile({
                            source: new WMTS({
                                url: base_layer_info.url,
                                layer: base_layer_info.layers,
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

        const scale_line = new ScaleLine()
        this.scale_line = scale_line

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
                new DrawButton({toggleDraw: this.toggleDraw}),
                scale_line,
                this.controls.modal,
                this.controls.shopmodal,
                this.controls.drawModal,
                this.controls.coordinateCopy,
                this.controls.cart,
                this.controls.alertBox,
                this.controls.popup,
            ]),
            layers: [
                ...base_layers,
                ...map_wms_list.reduce((acc_main, wms) =>
                {
                        const tiles = wms.layers.map((layer) => layer.wms_or_cache_ur ? layer.tile : layer.wms_tile)
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
        window.map = map
        this.controls.popup.blockPopUp(true, this.getElement, this.onClickCloser)
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

    getMetrScale(scale) {
        return scale * 1000
    }

    getPopUpInfo(coordinate, layers_code) {
        const latlong = toLonLat(coordinate)
        let layer_codes = layers_code.length > 0 ? layers_code : this.is_not_visible_layers.length > 0 ? this.is_not_visible_layers : []

        const scale = this.scale_line.renderedHTML_.split(' ')
        let scale_value = scale[0]
        const scale_unit = scale[1]
        if (scale_unit == 'km') {
            scale_value = this.getMetrScale(scale_value)
        }

        service
            .getPopUpInfo(layer_codes, latlong, scale_value)
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
                this.controls.popup.getData(true, datas, this.onClickCloser, this.setSourceInPopUp, this.cartButton, is_empty, is_from_inspire, false)
            })
    }

    checkTile(wms_tile, tile) {
        let pop_tile = wms_tile
        return pop_tile
    }

    featureFromUrl(coordinate) {
        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()
        const wms_array = this.getWMSArray()
        let not_visible_layers = []
        let is_not_inspire = true
        this.controls.popup.getData(true)

        this.setVisibleMarket(true)

        wms_array.map(({layers}) => {
            if(layers) {
                console.log(layers);
                layers.map(({tile, wms_tile, feature_price, geodb_export_field, geodb_pk_field, geodb_schema, geodb_table, code, wms_or_cache_ur}) => {
                    const pop_tile = this.checkTile(wms_tile, tile)
                    if (pop_tile.getVisible()) {
                        const {layer_code, is_feature} = this.check_inspire_layer(code)
                        if (is_feature) {
                            not_visible_layers.push(layer_code)
                        }
                        if (!is_feature) {
                            const wms_source = pop_tile.getSource()
                            console.log(wms_source);
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
                                                is_not_inspire = false
                                                this.is_empty = false
                                                if(this.sendFeatureInfo.length > 0) {
                                                    this.sendFeatureInfo.map((feat, idx) => {
                                                        if (feat[0].field_name !== feature_info[0][0]) {
                                                            feature_info.push(geodb_table)
                                                            feature_info.push(code)
                                                            this.sendFeatureInfo.push(feature_info)
                                                        }
                                                    })
                                                } if (this.sendFeatureInfo.length == 0) {
                                                    feature_info.push(geodb_table)
                                                    feature_info.push(code)
                                                    this.sendFeatureInfo.push(feature_info)
                                                }
                                                if(geodb_table == 'mpoint_view') {
                                                    this.state.vector_layer.setSource(null)
                                                }
                                                if (not_visible_layers.length > 0) {
                                                    this.getPopUpInfo(coordinate, not_visible_layers)
                                                }
                                                else {
                                                    this.controls.popup.getData(true, this.sendFeatureInfo, this.onClickCloser, this.setSourceInPopUp, this.cartButton, this.is_empty, false, false)
                                                }
                                            }
                                            else {
                                                if (not_visible_layers.length == 0) {
                                                    this.controls.popup.getData(true, [], this.onClickCloser, this.setSourceInPopUp, this.cartButton, this.is_empty, false, false)
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
                                        else {
                                            this.controls.popup.getData(true, this.sendFeatureInfo, this.onClickCloser, this.setSourceInPopUp, this.cartButton, this.is_empty, false, false)
                                        }
                                    })
                                }
                        } else {
                            /* TODO */
                        }
                    }
                })
            }
        })
        if (is_not_inspire) {
            this.getPopUpInfo(coordinate, not_visible_layers)
        }
    }

    showFeaturesAt(coordinate) {
        this.is_empty = true
        this.sendFeatureInfo = []

        const overlay = this.overlay
        overlay.setPosition(coordinate)

        this.setState({ pay_modal_check: false })
        this.featureFromUrl(coordinate)

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
            console.log(layers);
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

    transformToLatLong(coordinateList) {
        const geom = coordinateList[0].map((coord, idx) => {
            const map_coord = transformCoordinate(coord, this.state.projection, this.state.projection_display)
              return map_coord
        })
        return geom
      }

    toggleDrawed(event){
        this.feature_info_list = []
        this.controls.drawModal.showModal(true)
        let layer_codes = []
        let layer_ids = []

        const view = this.map.getView()
        const projection = view.getProjection()
        const coordinat = event.feature.getGeometry().getCoordinates()
        const feature_geometry = event.feature.getGeometry()

        const coodrinatLeftTop = coordinat[0][3]
        const coodrinatLeftTop_map_coord = transformCoordinate(coodrinatLeftTop, projection, this.state.projection_display)
        const coodrinatLeftTopFormat = coordinateFormat(coodrinatLeftTop_map_coord, '{y},{x}', 6)

        const coodrinatRightBottom = coordinat[0][1]
        const coodrinatRightBottom_map_coord = transformCoordinate(coodrinatRightBottom, projection, this.state.projection_display)
        const coodrinatRightBottomFormat = coordinateFormat(coodrinatRightBottom_map_coord, '{y},{x}', 6)

        const { bundle, map_wms_list } = this.state
        const wms_array = this.getWMSArray()

        const layer_info = {
            bundle: { id: bundle.id },
            wms_list: wms_array.reduce((acc, { name, layers }) => {
                const wms = {
                    name,
                    layers: layers.reduce((acc, { id, code, name, tile }) => {
                        if(tile) {
                            if (!tile.getVisible() && this.is_not_visible_layers.length > 0) {
                                this.is_not_visible_layers.map((layer_code, idx) => {
                                    if (layer_code == code) {
                                        acc.push({ id, name, code })
                                    }
                                })
                            }
                            else {
                                acc.push({ id, name, code })
                            }
                            return acc
                        }
                    }, []),
                }
                if (wms.layers.length)
                    acc.push(wms)
                return acc
            }, []),
        }

        wms_array.map(({ name, layers }, w_idx) => {
            layers.map(({ id, code, tile }, l_idx) => {
                if (tile.getVisible()) {
                    const {layer_code, is_feature} = this.check_inspire_layer(code)
                    if (is_feature) {
                        layer_codes.push(layer_code)
                        layer_ids.push([code, id])
                    }
                }
                else if (!tile.getVisible() && this.is_not_visible_layers.length > 0) {
                        this.is_not_visible_layers.map((layer_code, idx) => {
                            if (layer_code == code) {
                                layer_ids.push([code, id])
                            }
                        })
                }
            })
        })

        if (layer_codes.length == 0 && this.is_not_visible_layers.length > 0) {
            layer_codes = this.is_not_visible_layers
        }

        const coordinates = event.feature.getGeometry().getCoordinates()
        const trans_coordinates = this.transformToLatLong(coordinates)
        service
            .getFeatureInfo(layer_codes, trans_coordinates)
            .then(({ datas }) => {
                layer_ids.map(([layer_code, layer_id], idx) => {
                    datas.map((data, idx) => {
                        if (data.layer_code == layer_code) {
                            datas[idx]['layer_id'] = layer_id
                        }
                    })
                })
                this.calcPrice(feature_geometry, layer_info, coodrinatLeftTop_map_coord, coodrinatRightBottom_map_coord, datas)
            })
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

    toggleDrawRemove(){
        const features = this.state.source_draw.getFeatures();
        if(features.length > 0)
        {
            const lastFeature = features[features.length - 1];
            this.state.source_draw.removeFeature(lastFeature);
        }
    }

    toggleDraw() {

        const {is_authenticated} = this.state

        if (is_authenticated){

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
        else{
          this.setState({'is_modal_info_open': true})
        }
    }

    render() {
        const { is_modal_info_open} = this.state
        const Menu_comp = () => {
            return (
                <div>
                    {this.state.map_wms_list.map((wms, idx) =>
                        <WMSItem wms={wms} key={idx} addLayer={this.addLayerToSearch}/>
                    )}
                </div>
            )
        }
        const Search_comp = () => {
            return (
                <div>
                    <SearchBarComponent
                        handleSetCenter={this.handleSetCenter}
                        getOnlyFeature={this.getOnlyFeature}
                        resetFilteredOnlyFeature={this.resetFilteredOnlyFeature}
                        setFeatureOnMap={this.setFeatureOnMap}
                    />
                </div>
            )
        }
        const settings_component = () => {
            return(
                <div>
                    <h4>Тун удахгүй</h4>
                </div>
            )
        }
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="🌍">
                            <div id="map">
                                <SideBar
                                items = {[
                                    {
                                        "key": "menus",
                                        "icon": "fa fa-bars",
                                        "title": "Давхаргууд",
                                        "component": Menu_comp,
                                    },
                                    {
                                        "key": "search",
                                        "icon": "fa fa-search",
                                        "component": Search_comp
                                    },
                                    {
                                        "key": "settings",
                                        "icon": "fa fa-gear",
                                        "component": settings_component,
                                        "bottom": true
                                    },
                                ]}
                                />
                            </div>
                            {
                             is_modal_info_open &&
                                <ModalAlert
                                    modalAction = {() => this.handleModalApproveClose()}
                                    text='Төрийн ДАН системээр нэвтэрч худалдан авалт хийнэ үү.'
                                    title="Худалдан авалтын мэдээлэл"
                                    status={this.state.status}
                                    actionNameDelete="зөвшөөрөх"
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
