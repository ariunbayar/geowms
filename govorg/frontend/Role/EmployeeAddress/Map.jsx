import React, { Component } from "react"
import { Map, View, Feature } from 'ol'

import { Vector as VectorSource, OSM } from 'ol/source'
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer'
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
import 'ol/ol.css'
import { service } from "../Employee/service"

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
    }

    componentDidMount() {
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

    loadMap() {
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
                new TileLayer({
                    source: new OSM(),
                }),
                vector_layer,
            ],
            target: 'map',
            view: new View({
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            }),
            controls: []
        });

        map.addControl(this.controls.form)

        this.map = map
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
                    fields.push(mur)
                }
            })
        })
        return fields
    }

    getEmpInfo(id) {
        service
            .getEmpInfo(id)
            .then(({ success, info }) => {
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
                        }
                    ]
                    const fields = this.makeFields(info, conv)
                    const title = 'Ажилтны мэдээлэл'
                    this.controls.form.showForm(true, fields, title, undefined, true)
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
            if (feature.getGeometry().getType() == 'Point' && this.props.is_admin) {
                const properties = feature.getProperties()
                const id = properties.id
                this.id = id
                if (properties.is_cloned) {
                    this.translate.setActive(false)
                }
                this.getEmpInfo(id)
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

    translateEnd(event) {
        const feature = event.features.getArray()[0]
        const coordinates = feature.getGeometry().getCoordinates()
        this.end_coordinates = coordinates

        const id = feature.getProperties()['id']
        this.removeFeatureFromSource(id)

        const projection = this.map.getView().getProjection()
        const map_coord = transformCoordinate(coordinates, projection, this.state.projection_data)
        const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)

        this.changedFeatureSetColor()
        service
            .getErguulegFields()
            .then(({ success, info }) => {
                const title = 'Эргүүлд гарах байршил'
                this.makeLineString([feature], 'one')
                this.controls.form.showForm(success, info, title, (val) => this.sendErguuleg(val, this.id, coordinate_clicked))
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
                            if (!this.props.is_admin) {
                                this.map.getView().fit(extent,{ padding: [200, 200, 200, 200] })
                            }

                            source.addFeature(line_feature)
                        }
                    })
                }
            }
        }
    }

    downloadImage(val, id, coordinate_clicked) {
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
            this.props.saveErguulPlace(val, id, coordinate_clicked, photo)
        });
    }

    sendErguuleg(val, id, coordinate_clicked) {
        const extent = this.extent
        this.map.getView().fit(extent,{ padding: [200, 200, 200, 200] })
        this.downloadImage(val, id, coordinate_clicked)
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
        let has_erguul = false
        const source = this.vector_layer.getSource()
        if (features['features'].length > 0) {
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
                        has_erguul = true
                        if (!this.props.is_admin) {
                            this.start_coordinate = feature.getGeometry().getCoordinates()
                        }
                        style = this.featureWithTextStyle(full_name, 'green')
                    }

                    if (!this.props.is_admin && !properties.is_erguul) {
                        this.end_coordinates = feature.getGeometry().getCoordinates()
                    }

                    feature.setStyle(style)
                    source.addFeature(feature)
                }
            })
            this.makeLineString(features['features'])
        }
    }

    render() {
        return (
            <div id="map" style={{'height': 'calc( 90vh - 85px - 15px)'}}></div>
        )
    }
}
