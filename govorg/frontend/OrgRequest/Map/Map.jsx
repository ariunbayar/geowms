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
import {getRenderPixel} from 'ol/render';
import {SwipeButton} from './Swipe'


export default class RequestMap extends Component {
    constructor(props) {

        super(props)

        this.state = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
            is_layer_swipe: false,
            last_layer: null
        }
        this.loadMapData = this.loadMapData.bind(this)
        this.loadMap = this.loadMap.bind(this)
        this.swipeButton = this.swipeButton.bind(this)
        this.layerSwipe = this.layerSwipe.bind(this)
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
            })
        ],
        target: 'map',
        view: new View({
            center: [11461613.630815497, 5878656.0228370065],
            zoom: 5.041301562246971,
        }),
      });
      map.addControl(new SwipeButton(({swipeButton: this.swipeButton})))
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
        var check_update = 0
        if(geojsonObject['features'])
        {
          if(geojsonObject['features'][0]){
            if(Object.keys(geojsonObject['features'][0]).length>0)
            {
              var features_new =  new GeoJSON().readFeatures(geojsonObject['features'][0], {
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

          if(geojsonObject['features'][1]){
            if(Object.keys(geojsonObject['features'][1]).length>0)
                {
                  var features_old = new GeoJSON().readFeatures(geojsonObject['features'][1], {
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
                  this.setState({last_layer: vectorLayerOld})
                }
          }
          if (check_update !=0) this.map.getView().fit(features_old[0].getGeometry(),{ padding: [300, 300, 300, 300] })
          else  this.map.getView().fit(features_new[0].getGeometry(),{ padding: [300, 300, 300, 300] })

        }
    }

    layerSwipe(is_active){
      if(is_active){
        const {last_layer} = this.state
        var swipe = document.getElementById('swipe');
        swipe.value = 50
        if(last_layer){
          last_layer.on('prerender', (event) => {
            var ctx = event.context;
            var mapSize = this.map.getSize();
            var width = mapSize[0] * (swipe.value / 100);
            var tl = getRenderPixel(event, [width, 0]);
            var tr = getRenderPixel(event, [mapSize[0], 0]);
            var bl = getRenderPixel(event, [width, mapSize[1]]);
            var br = getRenderPixel(event, mapSize);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(tl[0], tl[1]);
            ctx.lineTo(bl[0], bl[1]);
            ctx.lineTo(br[0], br[1]);
            ctx.lineTo(tr[0], tr[1]);
            ctx.closePath();
            ctx.clip();
          });
          last_layer.on('postrender', (event) => {
            var ctx = event.context;
            ctx.restore();
          });
          swipe.addEventListener(
            'input',
            () => {
              this.map.render();
            },
            false
          );
        }
      }else{
        var swipe = document.getElementById('swipe');
        swipe.value = 0
      }
    }

    swipeButton(){
      const {is_layer_swipe} = this.state
      if(is_layer_swipe){
        this.setState({is_layer_swipe: false})
        this.layerSwipe(false)
      }else{
        this.setState({is_layer_swipe: true})
        this.layerSwipe(true)
      }
    }

    render() {
        const {is_layer_swipe} = this.state
        return (
          <div className="container-fluid">
              <div className="row">
                  <div className="col-md-12 px-0 reaquest">
                      <div id="map"></div>
                      <input className={!is_layer_swipe ? "invisible" : ''} id="swipe" type="range" style={{width:"100%"}}></input>
                  </div>
              </div>
          </div>
        )
    }
}
