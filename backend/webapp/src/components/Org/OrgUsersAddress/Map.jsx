import React, { Component } from "react"
import { Map, View, Feature } from 'ol'

import { Vector as VectorSource, OSM } from 'ol/source'
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer'
import { transform as transformCoordinate, fromLonLat } from 'ol/proj'
import { Icon, Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style'
import { format as coordinateFormat } from 'ol/coordinate';
import { Point } from 'ol/geom'
import {
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';
import { GeoJSON } from 'ol/format'
import 'ol/ol.css'

export default class AddressMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projection_data: 'EPSG:4326',
            projection_display: 'EPSG:3857',
        }

        this.loadMap = this.loadMap.bind(this)
        this.readFeatures = this.readFeatures.bind(this)
        this.readFeature = this.readFeature.bind(this)
        this.removeFeatureFromSource = this.removeFeatureFromSource.bind(this)
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
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                    color: 'red',
                    }),
                }),
            }),
        })

        this.vector_layer = vector_layer

        var select = new Select();
        var translate = new Translate({
            features: select.getFeatures(),
        });
        translate.on("translateend", event => console.log(event));

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
        });
        this.map = map
    }

    removeFeatureFromSource(featureID) {
        const source = this.vector_layer.getSource()
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

    readFeature(feature) {
        const id = 'aimag_sum'
        this.removeFeatureFromSource(id)
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
            const feature =  new GeoJSON().readFeatures(feat, {
                dataProjection: this.state.projection_data,
                featureProjection: this.state.projection_display,
            })[0];
            source.addFeature(feature)
        })
    }

    render() {
        return (
            <div id="map" style={{'height': 'calc( 90vh - 85px - 15px)'}}></div>
        )
    }
}
