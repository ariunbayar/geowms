import React, { Component } from "react"

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { service } from "./service"
import "../styles.css"

import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';


export default class BarilgaSuurinGazar extends Component {

    constructor(props) {

        super(props)

        this.state = {
            GeoJson: []
        }
        this.loadMapData = this.loadMapData.bind(this)
    }

    componentDidMount() {

        service.geom().then(({GeoJson}) => {
            if(GeoJson){
                this.setState({
                    GeoJson
                })
            }
        })

        this.loadMapData()
    }

    loadMapData(){

        const image = new CircleStyle({
              radius: 5,
              fill: null,
              stroke: new Stroke({color: 'red', width: 1}),
            });

        const styles = {
              'Point': new Style({
                image: image,
              }),
            };

        const styleFunction = function (feature) {
          return styles[feature.getGeometry().getType()];
        };

        const geojsonObject = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [0, 0],
              },
            },
            ],
        };

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonObject),
        });

        vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

        const vectorLayer = new VectorLayer({
              source: vectorSource,
              style: styleFunction,
            });

        var map = new Map({
            layers: [
                new TileLayer({
                  source: new OSM(),
                }),
                vectorLayer ],
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
