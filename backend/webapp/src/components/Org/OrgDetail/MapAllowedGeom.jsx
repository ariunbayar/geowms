import React, { Component } from "react"
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import Tile from 'ol/layer/Tile'
import {OSM, Vector as VectorSource, TileWMS} from 'ol/source'
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Style, Circle as CircleStyle, RegularShape, Image} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';


export default class MapAllowedGeom extends Component {
    constructor(props) {
            super(props)
            this.state = {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
                geom: props.geom
            }
            this.loadMapData = this.loadMapData.bind(this)
            this.loadMap = this.loadMap.bind(this)
            this.removeFeatureFromSource = this.removeFeatureFromSource.bind(this)
        }

    componentDidMount() {
        this.loadMap()
        this.loadMapData()
    }

    componentDidUpdate(pP, pS){
        if(pP.geom !=this.props.geom){
            this.loadMapData()
        }
    }

    loadMap(){
        const vector_layer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(100, 255, 0, 1)',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(100, 255, 0, 0.3)'
                })
            }),
        })

        this.vector_layer = vector_layer

        const map = new Map({
          layers: [
              new TileLayer({
                source: new OSM(),
              }),
              vector_layer
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

    loadMapData(){
        var {dataProjection, featureProjection} = this.state
        var {geom } = this.props
        const id = 'aimag_sum'
        this.removeFeatureFromSource(id)
        var feature =  new GeoJSON().readFeatures(geom, {
            dataProjection: dataProjection,
            featureProjection: featureProjection,
        });
        feature[0].setProperties({ id })
        this.vector_layer.getSource().addFeature(feature[0])
        this.map.getView().fit(feature[0].getGeometry(),{ padding: [200, 200, 200, 200]})
    }
    render() {
        return (
            <div className="🌍">
            <h5>Хамрах хүрээ:</h5><br/>
            <div id="map" style={{ height: 'calc( 50vh - 85px - 15px)'}}></div>
        </div>
        )
    }
}
