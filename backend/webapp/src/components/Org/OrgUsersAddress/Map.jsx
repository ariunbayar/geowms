import React, { Component } from "react"
import { Map, View, Feature } from 'ol'

import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'
import { Vector as VectorSource, OSM } from 'ol/source'
import { Vector as VectorLayer, Tile as TileLayer, Tile } from 'ol/layer'
import { TileImage, TileWMS } from 'ol/source'
import { transform as transformCoordinate, fromLonLat } from 'ol/proj'
import { Icon, Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import { format as coordinateFormat } from 'ol/coordinate';
import { Point, LineString } from 'ol/geom'
import {
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';
import { GeoJSON } from 'ol/format'
import { showForm } from './controls/form'
import { СуурьДавхарга } from './../../map/controls/СуурьДавхарга'
import 'ol/ol.css'
import "./styles.css"
import { service } from "../service"
import {securedImageWMS, clearLocalData} from "@utils/Map/Helpers"
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

export default class AddressMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projection_data: 'EPSG:4326',
            projection_display: 'EPSG:3857',
        }

        this.controls = {
            form: new showForm(),
        }

        this.loadMap = this.loadMap.bind(this)
        this.readFeatures = this.readFeatures.bind(this)
        this.readFeature = this.readFeature.bind(this)
        this.removeFeatureFromSource = this.removeFeatureFromSource.bind(this)
        this.translateStart = this.translateStart.bind(this)
        this.translateEnd = this.translateEnd.bind(this)
        this.selectedFeature = this.selectedFeature.bind(this)
        this.getEmpInfo = this.getEmpInfo.bind(this)
        this.changedFeatureSetColor = this.changedFeatureSetColor.bind(this)
        this.makeLineString = this.makeLineString.bind(this)
        this.sendErguuleg = this.sendErguuleg.bind(this)
        this.downloadImage = this.downloadImage.bind(this)
        this.loadMapData = this.loadMapData.bind(this)

    }

    componentDidMount() {
        this.loadMapData()
        this.loadMap()
    }

    componentDidUpdate(pP, pS) {
        if (pP.features !== this.props.features) {
            this.readFeatures(this.props.features)
        }
        if (pP.feature !== this.props.feature) {
            if (this.props.feature !== {}) {
                this.readFeature(this.props.feature)
            }
        }
    }

    loadMapData() {
        Promise.all([
            service.getBaseLayers(),
        ]).then(([{base_layer_list}]) => {
            this.loadMap(base_layer_list)
        })
    }

    loadMap(base_layer_list) {
        const { center } = this.state
        var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
        var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

        const base_layer_name = 'base_layer'
        if (base_layer_list){
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
                    })
                    layer.setZIndex(0)

                    return acc

                },
                {
                    base_layers: [],
                    base_layer_controls: []
                }
            )
            const vector_layer = new VectorLayer({
                source: new VectorSource({}),
                style: new Style({
                    stroke: new Stroke({
                        color: 'rgba(100, 255, 0, 1)',
                        width: 2
                    }),
                    fill: new Fill({
                        color: 'rgba(100, 255, 0, 0.3)'
                    }),
                }),
            })

            this.vector_layer = vector_layer

            const select = new Select();
            select.on("select", event => this.selectedFeature(event))
            this.select = select

            const translate = new Translate({
                features: select.getFeatures(),
            });
            translate.on("translatestart", event => this.translateStart(event));
            translate.on("translateend", event => this.translateEnd(event));
            this.translate = translate

            const map = new Map({
                interactions: defaultInteractions().extend([select, translate]),
                layers: [
                    ...base_layers,
                    vector_layer,
                ],
                target: 'map',
                view: new View({
                    center: [11461613.630815497, 5878656.0228370065],
                    zoom: 5.041301562246971,
                }),
                controls:  defaultControls().extend([
                    new СуурьДавхарга({layers: base_layer_controls})
                ])
            });

            map.addControl(this.controls.form)
            map.addControl(base_layer_controls)
            this.map = map
        }
    }

    makeFields(array, conv_array) {
        let fields = Array()
        Object.keys(array).map((field, idx) => {
            conv_array.map((conv_field, c_idx) => {
                if (field == conv_field.origin_name) {
                    let mur = Object()
                    mur['name'] = conv_field.name
                    mur['origin_name'] = field
                    mur['value'] = array[field] ? array[field] : ''
                    mur['disabled'] = conv_field.disabled
                    mur['choices'] = null
                    mur['length'] = conv_field.length

                    if (field == 'level_1') {
                        mur['value'] = array['level_1'] + ", " + array['level_2'] + ", " + array['level_3'] + ", " + array['street'] + " гудамж " + array['apartment'] + " байр, " + array['door_number'] + " тоот"
                    }
                    if (conv_field.is_erguul && field == 'level_3') {
                        mur['value'] = array['level_3'] + ", " + array['street'] + " гудамж " + array['apartment'] + " байр"
                    }
                    fields.push(mur)
                }
            })
        })
        return fields
    }

    getEmpInfo(id, is_erguul) {
        if (!is_erguul) {
            is_erguul = false
        }

        service
            .getEmpInfo(id, is_erguul)
            .then(({ success, info, title }) => {
                if (success) {
                    let conv = [
                        {
                            'origin_name': 'org_name',
                            'name': 'Байгууллагын нэр',
                            'disabled': true,
                            'length': 100,
                        },
                        {
                            'origin_name': 'phone_number',
                            'name': 'Утасны дугаар',
                            'disabled': true,
                            'length': 100,
                        },
                        {
                            'origin_name': 'level_1',
                            'name': 'Гэрийн хаяг',
                            'disabled': true,
                            'length': 2000,
                        },
                        {
                            'origin_name': 'last_name',
                            'name': 'Овог',
                            'disabled': true,
                            'length': 100,
                        },
                        {
                            'origin_name': 'first_name',
                            'name': 'Нэр',
                            'disabled': true,
                            'length': 100,
                        },
                        {
                            'origin_name': 'date_start',
                            'name': 'Эхлэх огноо',
                            'disabled': true,
                            'length': 100,
                        },
                        {
                            'origin_name': 'date_end',
                            'name': 'Дуусах огноо',
                            'disabled': true,
                            'length': 100,
                        },
                        {
                            'origin_name': 'part_time',
                            'name': 'Ээлж',
                            'disabled': true,
                            'length': 100,
                        },
                        {
                            'origin_name': 'level_3',
                            'name': 'Эргүүлийн хаяг',
                            'disabled': true,
                            'length': 100,
                            'is_erguul': is_erguul,
                        },
                    ]
                    const fields = this.makeFields(info, conv)
                    this.controls.form.showForm(true, fields, title, undefined, '', true)
                }
            })
    }

    featureWithTextStyle(text, color='red') {
        const style = new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                color: color,
                }),
            }),
            text: new Text({
              text: text,
              font: '30px Calibri,sans-serif',
              stroke: new Stroke({
                color: 'white',
                width: 3,
              }),
              offsetY: -18
            }),
        });
        return style
    }

    changedFeatureSetColor(color='green') {
        const source = this.vector_layer.getSource()
        source.getFeatures().map((feat, idx) => {
            const properties = feat.getProperties()
            if (properties.is_changed) {
                const full_name = this.getFullName(feat)
                const style = this.featureWithTextStyle(full_name, color)
                feat.setStyle(style)
            }
        })
    }

    getFullName(feature) {
        const first_name = feature.getProperties().first_name
        const last_name = feature.getProperties().last_name
        const last_name_conv = last_name.charAt(0).toUpperCase()
        const firt_name_conv = first_name.charAt(0).toUpperCase() + first_name.slice(1)
        const full_name = last_name_conv + '. ' + firt_name_conv
        return full_name
    }

    selectedFeature(event) {
        this.translate.setActive(true)
        const feature = event.selected[0]
        if (feature) {
            if (feature.getGeometry().getType() == 'Point') {
                const properties = feature.getProperties()
                const id = properties.id
                this.id = id
                if (properties.is_cloned) {
                    this.translate.setActive(false)
                }
                this.getEmpInfo(id, properties.is_erguul)
            }
            else {
                this.select.getFeatures().clear();
            }
        }
        else {
            this.changedFeatureSetColor()
        }
    }

    translateStart(event) {
        let too = 0
        const source = this.vector_layer.getSource()

        const feature = event.features.getArray()[0]
        if (feature.getGeometry().getType().includes("Point")) {
            const featureID = feature.getProperties()['id']

            const on_map_features = source.getFeatures();
            if (on_map_features != null && on_map_features.length > 0) {
                for (var i = 0; i < on_map_features.length; i++) {
                    const properties = on_map_features[i].getProperties();
                    const id = properties.id;
                    if (id == featureID && too < 2) {
                        too++
                    }
                    else if(too == 2) {
                        break
                    }
                }
            }

            if (too < 2) {
                const clonedFeature = feature.clone()
                const full_name = this.getFullName(clonedFeature)
                const style = this.featureWithTextStyle(full_name)
                clonedFeature.setStyle(style)
                clonedFeature.setProperties({ is_cloned: true })
                source.addFeature(clonedFeature)
            }

            feature.setProperties({ is_changed: true })
        }
    }

    translateEnd(event) {
        const feature = event.features.getArray()[0]
        const coordinates = feature.getGeometry().getCoordinates()

        const id = feature.getProperties()['id']
        this.removeFeatureFromSource(id)

        const projection = this.map.getView().getProjection()
        const map_coord = transformCoordinate(coordinates, projection, this.state.projection_data)
        const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)

        this.changedFeatureSetColor()
        service
            .getErguulegFields(id)
            .then(({ success, info, erguul_id }) => {
                const title = 'Эргүүлд гарах байршил'
                this.makeLineString([feature], 'one')
                let button_name = 'Хадгалах'
                if (erguul_id) {
                    button_name = 'Засах'
                }
                this.controls.form.showForm(success, info, title, (val) => this.sendErguuleg(val, this.id, coordinate_clicked, erguul_id), button_name)
            })
    }

    fromLonLatToMapCoord(coordinate) {
        return fromLonLat([coordinate[0], coordinate[1]]);
    }

    makeLineString(features, type="") {
        const source = this.vector_layer.getSource()

        const map_features = source.getFeatures();
        if (map_features != null && map_features.length > 0 && features.length > 0) {
            for (var j = 0; j < map_features.length; j++) {
                const child_feature = map_features[j]
                const property = child_feature.getProperties()
                const feat_id = property.id

                let for_if
                if (type == 'one') {
                    for_if = property.is_cloned
                }
                else {
                    for_if = property.is_erguul
                }

                if (feat_id && for_if) {
                    features.map((main_feature, idx) => {
                        let properties
                        let feat_for_if
                        if (type == 'one') {
                            properties = main_feature.getProperties()
                            feat_for_if = properties.is_changed
                        }
                        else {
                            properties = main_feature.properties
                            feat_for_if = properties.is_cloned
                        }

                        const main_feat_id = properties.id
                        if (main_feat_id == feat_id && feat_for_if) {

                            let start
                            if (type == 'one') {
                                start = main_feature.getGeometry().getCoordinates()
                            }
                            else {
                                start = main_feature.geometry.coordinates
                                start = this.fromLonLatToMapCoord(start)
                            }

                            const end = child_feature.getGeometry().getCoordinates()

                            const line_string = new LineString([start, end])
                            const line_feature = new Feature(line_string)

                            line_feature.setProperties({ id: main_feat_id })

                            const extent = line_feature.getGeometry().getExtent()

                            this.extent = extent
                            source.addFeature(line_feature)
                        }
                    })
                }
            }
        }
    }

    downloadImage(val, emp_id, coordinate_clicked, erguul_id) {
        const map = this.map
        let photo
        this.props.setLoading(true)
        map.once('rendercomplete', () => {
            var mapCanvas = document.createElement('canvas');
            var size = map.getSize();
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            var mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
                document.querySelectorAll('.ol-layer canvas'),
                function (canvas) {
                    if (canvas.width > 0) {
                        var opacity = canvas.parentNode.style.opacity;
                        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                        var transform = canvas.style.transform;
                        // Get the transform parameters from the style's transform matrix
                        var matrix = transform
                            .match(/^matrix\(([^\(]*)\)$/)[1]
                            .split(',')
                            .map(Number);
                        // Apply the transform to the export map context
                        CanvasRenderingContext2D.prototype.setTransform.apply(
                            mapContext,
                            matrix
                        );
                        mapContext.drawImage(canvas, 0, 0);
                    }
                }
            );
            if (navigator.msSaveBlob) {
                // link download attribuute does not work on MS browsers
                navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
            } else {
                photo = mapCanvas.toDataURL()
            }
            this.props.saveErguulPlace(val, emp_id, coordinate_clicked, photo, erguul_id)
        });
    }

    sendErguuleg(val, emp_id, coordinate_clicked, erguul_id) {
        const extent = this.extent
        this.map.getView().fit(extent,{ padding: [200, 200, 200, 200] })
        this.downloadImage(val, emp_id, coordinate_clicked, erguul_id)
    }

    removeFeatureFromSource(featureID, state='') {
        const source = this.vector_layer.getSource()
        const features = source.getFeatures();
        if (features != null && features.length > 0) {
            for (var i = 0; i < features.length; i++) {
                const properties = features[i].getProperties();
                const id = properties.id;
                let remove_feature
                const type = features[i].getGeometry().getType()
                if (id == featureID) {
                    if (state == 'only_aimag' && type.includes("Polygon")) {
                        remove_feature = features[i]
                    }
                    else if (!state && type == 'LineString') {
                        remove_feature = features[i]
                    }
                }

                if (remove_feature) {
                    source.removeFeature(remove_feature);
                    break;
                }
            }
        }
    }

    readFeature(feature) {
        const id = 'aimag_sum'
        this.removeFeatureFromSource(id, 'only_aimag')
        const source = this.vector_layer.getSource()
        const feat =  new GeoJSON().readFeatures(feature, {
            dataProjection: this.state.projection_data,
            featureProjection: this.state.projection_display,
        })[0];
        source.addFeature(feat)
        feat.setProperties({ id })
        this.map.getView().fit(feat.getGeometry(),{ padding: [50, 50, 50, 50], duration: 2000 })
    }

    readFeatures(features) {
        const source = this.vector_layer.getSource()
        features['features'].map((feat, idx) => {
            if (feat !== {}) {
                const feature =  new GeoJSON().readFeatures(feat, {
                    dataProjection: this.state.projection_data,
                    featureProjection: this.state.projection_display,
                })[0];
                const properties = feature.getProperties()

                const full_name = this.getFullName(feature)
                let style = this.featureWithTextStyle(full_name)

                if (properties.is_erguul) {
                    style = this.featureWithTextStyle(full_name, 'green')
                }

                feature.setStyle(style)
                source.addFeature(feature)
            }
        })
        this.makeLineString(features['features'])
    }

    render() {
        return (
            <div id="map" style={{'height': 'calc( 90vh - 85px - 15px)'}}></div>
        )
    }
}
