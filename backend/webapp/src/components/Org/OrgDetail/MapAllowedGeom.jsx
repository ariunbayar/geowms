import React, { Component } from "react"
import { Map, View } from 'ol'
import {defaults as defaultControls, ScaleLine} from 'ol/control'
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Stroke, Fill } from 'ol/style'
import Tile from 'ol/layer/Tile'
import TileImage from 'ol/source/TileImage'

import 'ol/ol.css'

import { service } from '../service'


export default class MapAllowedGeom extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projection: 'EPSG:3857',
        }

        this.mapRef = React.createRef()

        this.loadMap = this.loadMap.bind(this)

        this.base_layer = null
        this.setBaseLayer = this.setBaseLayer.bind(this)
    }

    componentDidMount() {
        this.loadMap()
        service
            .getBaseLayers()
            .then(({ base_layer_list }) => {
                for (const { url, tilename} of base_layer_list) {
                    if (tilename == 'xyz') {
                        this.setBaseLayer(url)
                        break
                    }
                }
            })
    }

    setBaseLayer(url) {
        this.base_layer.setSource(
            new TileImage({
                crossOrigin: 'Anonymous',
                url: url,
            }),
        )
    }

    loadMap() {

        const base_layer = new Tile()

        const vector_layer = new VectorLayer({
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 108, 182, 1)',
                    width: 3
                }),
                fill: new Fill({
                    color: 'rgba(0, 108, 182, 0.2)'
                })
            })
        })

        const map_controls = defaultControls().extend([
            new ScaleLine(),
        ])

        const view = new View({
            projection: this.state.projection,
            center: [11461613.630815497, 5878656.0228370065],
            zoom: 5.041301562246971,
        })

        const map = new Map({
            target: this.mapRef.current,
            controls: map_controls,
            layers: [base_layer, vector_layer],
            view: view,
        })

        const { geom } = this.props
        if (geom) {

            const features = new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: this.state.projection,
            }).readFeatures(geom)

            vector_layer.setSource(
                new VectorSource({ features: features })
            )

            map.getView().fit(
                features[0].getGeometry(),
                { padding: [25, 25, 25, 25] }
            )
        }

        this.base_layer = base_layer
    }

    render() {
        return (
            <div className="🌍">
                <h5>Хамрах хүрээ:</h5><br/>
                <div id="map" ref={ this.mapRef }></div>
            </div>
        )
    }

}
