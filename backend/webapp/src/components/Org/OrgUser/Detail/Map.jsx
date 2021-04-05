import React, { Component } from "react"
import { Map, View, Feature } from 'ol'

import { Vector as VectorSource, OSM } from 'ol/source'
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer'
import { transform as transformCoordinate, fromLonLat } from 'ol/proj'
import { Icon, Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import { Point, LineString } from 'ol/geom'
import {
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';
import { GeoJSON } from 'ol/format'
import { showForm } from '../../OrgUsersAddress/controls/form'
import 'ol/ol.css'

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
        this.changedFeatureSetColor = this.changedFeatureSetColor.bind(this)
        this.makeLineString = this.makeLineString.bind(this)
    }

    componentDidMount() {
        this.loadMap()
    }

    componentDidUpdate(pP, pS) {
        if (pP.features !== this.props.features) {
            this.readFeatures(this.props.features)
        }
        if (pP.feature !== this.props.feature) {
            this.readFeature(this.props.feature)
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

        const map = new Map({
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
        console.log(feature);
        const first_name = feature.getProperties().first_name
        const last_name = feature.getProperties().last_name
        const last_name_conv = last_name.charAt(0).toUpperCase()
        const firt_name_conv = first_name.charAt(0).toUpperCase() + first_name.slice(1)
        const full_name = last_name_conv + '. ' + firt_name_conv
        return full_name
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
                                console.log('suuliih bh ysoti');
                                this.map.getView().fit(extent,{ padding: [200, 200, 200, 200] })
                            }

                            source.addFeature(line_feature)
                        }
                    })
                }
            }
        }
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
        const source = this.vector_layer.getSource()
        const feat =  new GeoJSON().readFeatures(feature, {
            dataProjection: this.state.projection_data,
            featureProjection: this.state.projection_display,
        })[0];
        const full_name = this.getFullName(feat)
        const style = this.featureWithTextStyle(full_name)
        feat.setStyle(style)
        source.addFeature(feat)
        this.map.getView().fit(feat.getGeometry(), { padding: [200, 200, 200, 200], minResolution: 1 })
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
            <div>
                <h5>Гэрийн хаяг:</h5>
                <div id="map" className="mt-2" style={{'height': 'calc( 49vh - 34px - 7px)'}}></div>
            </div>
        )
    }
}
