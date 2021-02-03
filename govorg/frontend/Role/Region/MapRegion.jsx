import React, { Component } from "react"
import { Map, View } from 'ol'

import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import 'ol/ol.css'
import { service } from './service'

export default class MapRegion extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        }

        this.loadMap = this.loadMap.bind(this)
        this.loadMapData = this.loadMapData.bind(this)

    }

    componentDidMount() {
        this.loadMap()
        service
            .getBaseLayers()
            .then(({ allowed_geom }) => {
                this.setState({allowed_geom})
                this.loadMapData(allowed_geom)
            })
    }

    loadMap() {
        const map = new Map({
          layers: [
              new TileLayer({
                source: new OSM(),
              })
          ],
          target: 'map',
          view: new View({
              center: [11461613.630815497, 5878656.0228370065],
              zoom: 5.041301562246971,
          }),
        });
        this.map = map
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
        this.map.getView().fit(features_new[0].getGeometry(),{ padding: [300, 300, 300, 300] })
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div id="map"></div>
                </div>
            </div>
        )
    }

}