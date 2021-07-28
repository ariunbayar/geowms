import React, { Component } from "react"

import 'ol/ol.css'
import { Map, View, Feature, Overlay } from 'ol'
import { transform as transformCoordinate, fromLonLat } from 'ol/proj'
import { WMSGetFeatureInfo, GeoJSON } from 'ol/format'
import { getArea } from 'ol/sphere';
import { toLonLat } from 'ol/proj';
import { Vector as VectorLayer, Tile } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Icon, Style, Stroke, Circle as CircleStyle, Fill } from 'ol/style'
import { Point } from 'ol/geom'
import { TileImage, TileWMS, WMTS } from 'ol/source'
import { format as coordinateFormat } from 'ol/coordinate';
import { defaults as defaultControls, FullScreen, MousePosition, ScaleLine } from 'ol/control'
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import Draw, { createBox } from 'ol/interaction/Draw';

import { securedImageWMS, clearLocalData } from "@utils/Map/Helpers"
import SideBar from "@utils/SideBar"
import * as utils from "@helpUtils/ol"
import * as fnUtils from "@helpUtils/functions"

import { BaseMaps as СуурьДавхарга } from './controls/СуурьДавхарга'
import { CoordinateCopy } from './controls/CoordinateCopy'
import { Modal } from './controls/Modal'
import { DrawPayModal } from './controls/DrawPayModal'
import { DrawButton } from './controls/Draw'
import WMSItem from './controls/LayerControls/WMSItem'
import { ShopModal } from './ShopControls/Modal'
import { ShopCart } from './ShopControls/ShopCart'
import { AlertRoot } from "./ShopControls/alert"
import { SearchBarComponent } from './searchControl/SearchBar'
import { PopUp } from './popUp/PopUp'

import { service } from './service'
import "./styles.css"


export default class BundleMap extends Component {

    constructor(props) {
        super(props)

        this.sendFeatureInfo = []
        this.is_not_visible_layers = []
        this.saved_aimag_name = ''
        this.au_search_layer_name = utils.vars.au_search_layer_name
        this.pop_up_feature_id = 'popup'

        this.state = {
            projection: 'EPSG:3857',
            is_authenticated: false,
            projection_display: 'EPSG:4326',
            bundle: props.bundle,
            map_wms_list: [],
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
            base_layer_controls: [],
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
        this.getOnlyFeature = this.getOnlyFeature.bind(this)
        this.resetFilteredOnlyFeature = this.resetFilteredOnlyFeature.bind(this)
        this.allLayerVisible = this.allLayerVisible.bind(this)
        this.addLayerToSearch = this.addLayerToSearch.bind(this)
        this.drawBorderCircle = this.drawBorderCircle.bind(this)
        this.fromLonLatToMapCoord = this.fromLonLatToMapCoord.bind(this)
        this.getDataPopUp = this.getDataPopUp.bind(this)
        this.checkInspireLayer = this.checkInspireLayer.bind(this)
        this.transformToLatLong = this.transformToLatLong.bind(this)
        this.removeFeatureFromSource = this.removeFeatureFromSource.bind(this)
        this.getPopUpInfo = this.getPopUpInfo.bind(this)
        this.setVisibleMarker = this.setVisibleMarker.bind(this)
        this.setFeatureOnMap = this.setFeatureOnMap.bind(this)
        this.resetSearch = this.resetSearch.bind(this)
        this.getOpenLayers = this.getOpenLayers.bind(this)
        this.featureFromUrl = this.featureFromUrl.bind(this)
        this.getGeom = this.getGeom.bind(this)
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
        service
            .getUser()
            .then(({ is_authenticated }) => {
                this.setState({ is_authenticated })
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
        ]).then(([{ base_layer_list }, { wms_list }]) => {
            this.handleMapDataLoaded(base_layer_list, wms_list)
        })
    }

    handleMapDataLoaded(base_layer_list, wms_list) {

        var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
        var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

        const map_wms_list = wms_list.map(({name, url, chache_url, proxy_url, proxy_cache_url, wms_or_cache_ur, layers}) => {
            return {
                name,
                layers: layers.map((layer) => {
                    return {
                        ...layer,
                        proxy_cache_url,
                        proxy_url,
                        wms_or_cache_ur,
                        tile: new Tile({
                            preload: 6,
                            minZoom: layer.zoom_start,
                            maxZoom: layer.zoom_stop,
                            source: new WMTS({
                                url: chache_url,
                                layer: layer.code,
                                matrixSet: this.state.projection_display,
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
                                cacheSize: 1000,
                                tileLoadFunction: securedImageWMS
                            }),
                        }),
                        wms_tile: new Tile({
                            preload: 6,
                            source: new TileWMS({
                                projection: this.state.projection,
                                ratio: 1,
                                url: url,
                                params: {
                                    'LAYERS': layer.code,
                                    'FORMAT': 'image/png',
                                    'VERSION': '1.1.1',
                                    "STYLES": '',
                                    "exceptions": 'application/vnd.ogc.se_inimage',
                                },
                                tileLoadFunction: securedImageWMS
                            }),
                        })
                    }
                }),
            }
        })

        map_wms_list.map((wms, w_idx) => {
            map_wms_list[w_idx]['is_display'] = false
            map_wms_list[w_idx]['is_display_layers'] = false

            const wms_layers = wms.layers.map((layer, idx) => {
                const is_checked = layer.defaultCheck == 1

                layer.defaultCheck == 0 && layer.tile.setVisible(false)
                layer.defaultCheck == 0 && layer.wms_tile.setVisible(false)
                layer['legend'] = layer.wms_tile.getSource().getLegendUrl()
                layer['is_legend_display'] = is_checked
                layer['checked'] = is_checked

                if (is_checked) {
                    map_wms_list[w_idx]['is_display'] = is_checked
                    map_wms_list[w_idx]['is_display_layers'] = is_checked
                }

            })
            return wms_layers
        })

        const base_layer_name = 'base_layer'
        const { base_layers, base_layer_controls } =
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
                        })
                    }

                    if (base_layer_info.tilename == "wms") {
                        layer = new Tile({
                            source: new TileWMS({
                                ratio: 1,
                                url: base_layer_info.url,
                                params: {
                                    'LAYERS': base_layer_info.layers,
                                    'FORMAT': 'image/png',
                                    'VERSION': '1.1.1',
                                    "STYLES": '',
                                    "exceptions": 'application/vnd.ogc.se_inimage',
                                },
                                tileLoadFunction: securedImageWMS
                            }),
                            name: base_layer_name,
                        })
                    }
                    if (base_layer_info.tilename == "wmts") {
                        layer = new Tile({
                            source: new WMTS({
                                url: base_layer_info.url,
                                // url: base_layer_info.geoserver_url,
                                layer: base_layer_info.layers,
                                matrixSet: this.state.projection_display,
                                format: 'image/png',
                                projection: this.state.projection_display,
                                tileGrid: new WMTSTileGrid({
                                    tileSize: [256,256],
                                    extent: [-180.0,-90.0,180.0,90.0],
                                    origin: [-180.0, 90.0],
                                    resolutions: resolutions,
                                    matrixIds: gridNames,
                                }),
                                tileLoadFunction: securedImageWMS,
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
                        name: base_layer_info.name,
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
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(100, 255, 0, 1)',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    stroke: new Stroke({
                        color: 'rgba(100, 255, 0, 1)',
                        width: 2,
                    }),
                }),
            }),
            name: vector_layer_name,
        })

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

        const buttons = [
            new FullScreen(),
            new MousePosition({
                projection: this.state.projection_display,
                coordinateFormat: (coord) => coordinateFormat(coord, '{y},{x}', 6),
                undefinedHTML: '',
            }),
            scale_line,
            this.controls.modal,
            this.controls.shopmodal,
            this.controls.coordinateCopy,
            this.controls.cart,
            this.controls.alertBox,
            this.controls.popup,
        ]

        if (!this.state.bundle.is_point) {
            buttons.push(
                new DrawButton({ toggleDraw: this.toggleDraw }),
                this.controls.drawModal,
            )
        }

        const map = new Map({
            maxTilesLoading: 16,
            target: 'map',
            controls: defaultControls().extend(buttons),
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
        this.setState({ vector_layer, base_layer_controls, map_wms_list })
        this.controls.popup.blockPopUp(true, this.getElement, this.onClickCloser)
        const to_geo_id = fnUtils.getUrlParamValue(window.location.href, 'to')
        if (to_geo_id) {
            this.getGeom(to_geo_id, undefined, true)
        }
    }

    onClickCloser(){
        const overlay = this.overlay
        const closer = this.element_closer
        overlay.setPosition(undefined);
        closer.blur();
        this.setVisibleMarker(false)

        const source = this.state.vector_layer.getSource()
        utils.removeFeatureFromSource(this.pop_up_feature_id, source)
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

    resetSearch() {
        this.setState({ refreshLayerFn: null, border_feature: null })
    }

    // updateViewProjection() {
    //     var newProj = getProjection(this.state.projection_display);
    //     var newProjExtent = newProj.getExtent();
    //     var newView = new View({
    //       projection: newProj,
    //       center: getCenter(newProjExtent || [0, 0, 0, 0]),
    //       zoom: 1,
    //       extent: newProjExtent || undefined,
    //     });
    //     this.map.setView(newView);
    // }

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
        if (this.state.refreshLayerFn) {
            this.state.refreshLayerFn('', is_visible, add_layers)
        }
        else {
            add_layers.map(layer => {
                layer.wms_or_cache_ur ? layer.tile.setVisible(is_visible) : layer.wms_tile.setVisible(is_visible)
            })
        }
    }

    resetFilteredOnlyFeature() {
        this.removeFeatureFromSource(this.au_search_layer_name)
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
        this.removeFeatureFromSource(this.au_search_layer_name)
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

    checkInspireLayer(code) {
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

    getOpenLayers() {
        const open_layers = Array()
        this.state.map_wms_list.map(({ layers }, idx) => {
            layers.map(({ checked, code }, l_idx) => {
                if (checked) {
                    open_layers.push(code)
                }
            })
        })
        return open_layers
    }

    async getPopUpInfo(coordinate) {
        const latlong = toLonLat(coordinate)

        const layer_codes = this.getOpenLayers()

        const scale = this.scale_line.renderedHTML_.split(' ')
        let scale_value = scale[0]
        const scale_unit = scale[1]
        if (scale_unit == 'km') {
            scale_value = this.getMetrScale(scale_value)
        }

        try {
            const { datas } = await service.getPopUpInfo(layer_codes, latlong, scale_value)
            return datas
        } catch (error) {
            return []
        }
    }

    checkTile(wms_tile, tile) {
        let pop_tile = wms_tile
        return pop_tile
    }

    async featureFromUrl(coordinate, tile) {
        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()
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
            const text = await fetch(url).then((response) => response.text())
            const parser = new WMSGetFeatureInfo()
            const features = parser.readFeatures(text)
            const feature_info = features.map((feature) => {
                const geometry_name = feature.getGeometryName()
                const values =
                    feature.getKeys()
                    .filter((key) => key != geometry_name)
                    .map((key) => [key, feature.get(key)])
                return [feature.getId(), values, feature]
            })
            return feature_info
        }
        else {
            return []
        }
    }

    async getDataPopUp(coordinate) {

        const wms_array = this.getWMSArray()
        this.controls.popup.getData(true)

        this.setVisibleMarker(true)

        for (const idx in wms_array) {
            const { layers } = wms_array[idx]
            for (const l_idx in layers) {
                const { tile, wms_tile, code, checked, wms_or_cache_ur } = layers[l_idx]
                if (checked) {
                    const pop_tile = wms_or_cache_ur ? tile : wms_tile
                    const { layer_code, is_feature } = this.checkInspireLayer(code)
                    if (!is_feature) {
                        const datas = await this.featureFromUrl(coordinate, pop_tile)
                        datas.map((data) =>
                            this.sendFeatureInfo.push(data)
                        )
                    }
                    else {
                        const datas = await this.getPopUpInfo(coordinate)
                        datas.map((data) =>
                            this.sendFeatureInfo.push(data)
                        )
                    }
                }
            }
        }

        if (this.sendFeatureInfo.length > 0) {
            this.is_empty = false
            const pop_up_feature_id = this.pop_up_feature_id
            const source = this.state.vector_layer.getSource()
            utils.removeFeatureFromSource(pop_up_feature_id, source)
        }

        this.controls.popup.getData(
            true,
            this.sendFeatureInfo,
            this.onClickCloser,
            this.setSourceInPopUp,
            this.cartButton,
            this.is_empty,
            false
        )
    }

    showFeaturesAt(coordinate) {
        this.is_empty = true
        this.sendFeatureInfo = []
        const { is_authenticated } = this.state
        const overlay = this.overlay
        overlay.setPosition(coordinate)
        if (is_authenticated) {
            this.setState({ pay_modal_check: false })
            this.getDataPopUp(coordinate)

            this.sendFeatureInfo = []
            this.is_empty = true
        }
        else {
            this.controls.popup.getData(
                true,
                this.sendFeatureInfo,
                this.onClickCloser,
                this.setSourceInPopUp,
                this.cartButton,
                false,
                false,
                false
            )
        }
    }

    setSourceInPopUp(feature) {
        const pop_up_feature_id = this.pop_up_feature_id
        const source = this.state.vector_layer.getSource()
        utils.removeFeatureFromSource(pop_up_feature_id, source)
        if (feature) {
            let ol_feature = feature
            if (!(feature instanceof Feature)) {
                ol_feature = utils.featureToOLFeature(feature)
            }
            ol_feature.setProperties({ id: pop_up_feature_id })
            source.addFeature(ol_feature)
        }
    }

    handleToggle(idx) {
        const layer = this.state.layers[idx]
        layer.setVisible(!layer.getVisible())
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

    setVisibleMarker(is_true) {
        this.marker_layer.setVisible(is_true)
    }

    transformToLatLong(coordinateList) {
        const geom = coordinateList[0].map((coord, idx) => {
            const map_coord = transformCoordinate(coord, this.state.projection, this.state.projection_display)
              return map_coord
        })
        return geom
    }

    async toggleDrawed(event){
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
            layers.map(({ id, code, wms_tile }, l_idx) => {
                if (wms_tile.getVisible()) {
                    const {layer_code, is_feature} = this.checkInspireLayer(code)
                    if (is_feature) {
                        layer_codes.push(layer_code)
                        layer_ids.push([code, id])
                    }
                }
                else if (!wms_tile.getVisible() && this.is_not_visible_layers.length > 0) {
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
        const { datas } = await service.getFeatureInfo(layer_codes, trans_coordinates)
        layer_ids.map(([layer_code, layer_id], idx) => {
            datas.map((data, idx) => {
                if (data.layer_code == layer_code) {
                    datas[idx]['layer_id'] = layer_id
                }
            })
        })
        this.calcPrice(feature_geometry, layer_info, coodrinatLeftTop_map_coord, coodrinatRightBottom_map_coord, datas)
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

        const { is_authenticated } = this.state

        if (is_authenticated) {

            this.setState(prevState => ({
                is_draw_open: !prevState.is_draw_open,
            }))

            if(this.state.is_draw_open) {
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
            else {
                this.map.removeInteraction(this.state.draw);
                this.toggleDrawRemove()
            }

        }
        else {
            const modal = {
                modal_status: "open",
                modal_icon: "fa fa-exclamation-circle",
                modal_bg: "",
                icon_color: "warning",
                title: "Худалдан авалтын мэдээлэл",
                text: "Төрийн ДАН системээр нэвтэрч худалдан авалт хийнэ үү!",
                has_button: true,
                actionNameBack: "Хаах",
                actionNameDelete: "Нэвтрэх",
                modalAction: () => window.location.href = "/loginUser/",
                modalClose: null
            }
            global.MODAL(modal)
        }
    }

    setFeatureOnMap(feature, refreshLayerFn, is_from_url, is_feature=false) {
        this.onClickCloser()

        if (feature) {
            const { vector_layer } = this.state

            let id
            id = this.au_search_layer_name
            if (is_from_url) id = this.pop_up_feature_id

            const source = vector_layer.getSource()
            utils.removeFeatureFromSource(id, source)

            let new_feature = feature
            if (!is_feature) {
                new_feature = utils.vars.format.readFeatures(feature, {
                    dataProjection: utils.vars.display_projection,
                    featureProjection: utils.vars.feature_projection,
                })[0];
            }

            console.log(id);

            new_feature.setProperties({ id })
            source.addFeature(new_feature)

            let padding
            let maxZoom = 18

            const geom_type = new_feature.getGeometry().getType()
            if (geom_type.includes('Point')) {
                padding = [300, 300, 300, 300]
            }
            else {
                padding = [100, 100, 100, 100]
            }
            this.map.getView().fit(new_feature.getGeometry().getExtent(), { padding: padding, duration: 2000, maxZoom })
            if (refreshLayerFn) {
                this.setState({ refreshLayerFn, border_feature: feature })
            }
            else {
                this.setState({ border_feature: feature })
            }
        }
    }

    getGeom(geo_id, refreshLayerFn, is_from_url=false) {
        const bundle_id = this.state.bundle.id

        service
            .getGeom(geo_id, bundle_id)
            .then(({ success, data }) => {
                if (success) {
                    this.setFeatureOnMap(data, refreshLayerFn, is_from_url)
                }
                else {
                    const modal = {
                        modal_status: "open",
                        modal_icon: 'fa fa-exclamation-circle',
                        modal_bg: '',
                        icon_color: 'warning',
                        title: 'GEOM өгөгдөл байхгүй байна',
                        text: '',
                        has_button: false,
                        actionNameBack: "",
                        actionNameDelete: "",
                        modalAction: "",
                        modalClose: ""
                    }
                    global.MODAL(modal)
                }
            })
    }

    render() {

        const Menu_comp = () => {
            return (
                <div className="pt-2">
                    {
                        this.state.map_wms_list.map((wms, idx) =>
                            <WMSItem wms={wms} key={idx} addLayer={this.addLayerToSearch}/>
                        )
                    }
                </div>
            )
        }

        const Search_comp = () => {

            const funcs = {
                setVisibleMarker: this.setVisibleMarker,
                "is_not_visible_layers": this.is_not_visible_layers,
                resetSearch: this.resetSearch,
                "marker": this.marker.point,
                'closePopUp': this.onClickCloser,
            }

            return (
                <div>
                    <SearchBarComponent
                        setFeatureOnMap={this.setFeatureOnMap}
                        getGeom={this.getGeom}
                        vector_layer={this.state.vector_layer}
                        map_wms_list={this.state.map_wms_list}
                        bundle_id={this.state.bundle.id}
                        is_point={this.state.bundle.is_point}
                        funcs={funcs}
                    />
                </div>
            )
        }

        const settings_component = () => {
            return(
                <div>
                    <div>
                        <button className="btn gp-btn-primary" type="button" onClick={() => clearLocalData('ALL')}><i className="fa fa-trash mr-1"></i>Cache цэвэрлэх</button>
                    </div>
                </div>
            )
        }

        const BaseMaps = () => {
            return (
                <СуурьДавхарга base_layer_controls={this.state.base_layer_controls} />
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
                                            "tooltip": "Давхаргууд",
                                            "component": Menu_comp,
                                        },
                                        {
                                            "key": "search",
                                            "icon": "fa fa-search",
                                            "title": "Хайлт",
                                            "tooltip": "Хайлт",
                                            "component": Search_comp
                                        },
                                        {
                                            "key": "base_maps",
                                            "icon": "fa fa-map-o",
                                            "title": "Суурь давхаргууд",
                                            "tooltip": "Суурь давхаргууд",
                                            "component": BaseMaps,
                                            "bottom": true
                                        },
                                        {
                                            "key": "settings",
                                            "icon": "fa fa-gear",
                                            "tooltip": "Тохиргоо",
                                            "component": settings_component,
                                            "bottom": true
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
