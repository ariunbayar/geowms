import React, { Component } from "react"

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import {transform as transformCoordinate} from 'ol/proj'
import View from 'ol/View';
import { service } from "./service"
import "../styles.css"

import {Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';


export default class BarilgaSuurinGazar extends Component {

    constructor(props) {

        super(props)

        this.state = {
            GeoJson: [],
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        }
        this.loadMapData = this.loadMapData.bind(this)
    }

    componentDidMount() {

        service.geom().then(({GeoJson}) => {
            if(GeoJson){
                this.setState({
                    GeoJson
                })
                this.loadMapData(GeoJson)
            }
        })

    }

    loadMapData(GeoJson){

        const styles = {
              'MultiPolygon': new Style({
                stroke: new Stroke({
                  color: 'yellow',
                  width: 1,
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 0, 0.1)',
                }),
              }),
            };

        const styleFunction = function (feature) {
          return styles[feature.getGeometry().getType()];
        };

        const geojsonObject =  GeoJson

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonObject, {
            dataProjection: this.state.dataProjection,
            featureProjection: this.state.featureProjection,
          }),
        });

        const vectorLayer = new VectorLayer({
              source: vectorSource,
              style: styleFunction,
            });

        const map = new Map({
            layers: [
                new TileLayer({
                  source: new OSM(),
                }),
                vectorLayer
            ],
                target: 'map',
            view: new View({
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            }),
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12 px-0">
                    <div id="map"></div>
                </div>
            </div>
        )
    }
}
