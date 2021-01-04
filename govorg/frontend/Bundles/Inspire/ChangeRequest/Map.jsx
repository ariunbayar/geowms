import React, { Component } from "react"

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import "./styles.css"
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style'
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
console.log("hohoh")
console.log("hohoh")
console.log("hohoh")
export default class RequestMap extends Component {
    constructor(props) {

        super(props)

        this.state = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        }
        this.loadMapData = this.loadMapData.bind(this)
        this.loadMap = this.loadMap.bind(this)
    }

    componentDidMount() {
        const geoJson = this.props.geoJson
        this.loadMap()
        this.loadMapData(geoJson)
    }

    loadMap(){
      const map = new Map({
        layers: [
            new TileLayer({
              source: new OSM(),
            }),
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
          'Polygon': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(0,255,0,0.3)',
            }),
          }),
          'Point': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'green',
              }),
            }),
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2,
            }),
          }),
          'MultiPoint': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'green',
              }),
            }),
          }),
        };

        const styles_old = {
          'MultiPolygon': new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.3)',
            }),
          }),
          'Polygon': new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.3)',
            }),
          }),
          'Point': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'blue',
              }),
            }),
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
          }),
          'MultiPoint': new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: 'red',
              }),
            }),
          }),
        };

        const geojsonObject =  GeoJson
        if(geojsonObject['features'][0]){
          const vectorSourceNew = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject['features'][0], {
              dataProjection: this.state.dataProjection,
              featureProjection: this.state.featureProjection,
            }),
          });

          const vectorLayerNew = new VectorLayer({
            source: vectorSourceNew,
            style: function (feature) {
              return styles_new[feature.getGeometry().getType()];
            }
          });
          this.map.addLayer(vectorLayerNew)
        }

        if(geojsonObject['features'].length > 1){

          const vectorSourceOld = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject['features'][1], {
              dataProjection: this.state.dataProjection,
              featureProjection: this.state.featureProjection,
            }),
          });

          const vectorLayerOld = new VectorLayer({
            source: vectorSourceOld,
            style: function (feature) {
              return styles_old[feature.getGeometry().getType()];
            }
          });

          this.map.addLayer(vectorLayerOld)
        }
    }

    render() {
      const geoJson = this.props.geoJson
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 px-0 reaquest">
                        <div id="map"></div>
                    </div>
                </div>
            </div>
        )
    }
}
