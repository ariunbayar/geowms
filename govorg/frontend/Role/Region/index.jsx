import React, { Component } from "react"
import { Map, View } from 'ol'

import { Fill, Stroke, Style } from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';

import { setBaseLayers } from "@helpUtils/ol"

import 'ol/ol.css'

export default class MapRegion extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
            allowed_geom: props.allowed_geom,
        }

        this.loadMap = this.loadMap.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
    }

    componentDidMount() {
        this.loadMap()
    }

    async loadMap() {
        const map = new Map({
          layers: [],
          target: 'map',
        });
        this.map = map
        await setBaseLayers(map)
        this.loadMapData(this.state.allowed_geom)
    }

    loadMapData(GeoJson){

        const styles_new = {
          'MultiPolygon': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(0,255,0,0.3)',
            }),
          }),
        };

        const geojsonObject =  GeoJson
        var features_new =  new GeoJSON().readFeatures(geojsonObject, {
            dataProjection: this.state.dataProjection,
            featureProjection: this.state.featureProjection,
        });

        const vectorSourceNew = new VectorSource({
            features: features_new
        });

        const vectorLayerNew = new VectorLayer({
            source: vectorSourceNew,
            style: function (feature) {
                return styles_new[feature.getGeometry().getType()];
            }
        });

        this.map.addLayer(vectorLayerNew)
        this.map.getView().fit(features_new[0].getGeometry(),{ padding: [20, 20, 20, 20] })
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div id="map" style={{height: 'calc( 98vh - 85px - 15px)'}}></div>
                </div>
            </div>
        )
    }
}
