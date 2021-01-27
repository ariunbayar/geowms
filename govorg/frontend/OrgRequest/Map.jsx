import React, { Component } from "react"

import 'ol/ol.css';
import {Map, View} from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import "./styles.css"
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { Vector as VectorSource, OSM } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Select } from 'ol/interaction';

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
        this.loadMap()
        this.loadMapData()
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
      const selectSingleClick = new Select();
      map.addInteraction(selectSingleClick);
      selectSingleClick.on('select', function (e) {
        console.log("selected");
      });
    }

    loadMapData(){

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

        const { values } = this.props
        var check_update = 0
        values.map(({geo_json}, idx) => {
          if(geo_json['features'])
          {
            if(geo_json['features'][0]){
              if(Object.keys(geo_json['features'][0]).length>0)
              {
                var features_new =  new GeoJSON().readFeatures(geo_json['features'][0], {
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
              }
            }
            if(geo_json['features'][1]){
              if(Object.keys(geo_json['features'][1]).length > 0)
                  {
                    var features_old = new GeoJSON().readFeatures(geo_json['features'][1], {
                      dataProjection: this.state.dataProjection,
                      featureProjection: this.state.featureProjection,
                    });
                    const vectorSourceOld = new VectorSource({
                      features:features_old
                    });
                    const vectorLayerOld = new VectorLayer({
                      source: vectorSourceOld,
                      style: function (feature) {
                        return styles_old[feature.getGeometry().getType()];
                      }
                    });
                    check_update = 1
                    this.map.addLayer(vectorLayerOld)
                  }
              }
            if (check_update !=0) this.map.getView().fit(features_old[0].getGeometry(),{ padding: [300, 300, 300, 300] })
            else  this.map.getView().fit(features_new[0].getGeometry(),{ padding: [300, 300, 300, 300] })
          }
        })
    }

    render() {
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
