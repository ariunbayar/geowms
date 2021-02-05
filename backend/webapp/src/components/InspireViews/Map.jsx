import React, { Component } from "react"


import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import Tile from 'ol/layer/Tile'
import {OSM, Vector as VectorSource, TileWMS} from 'ol/source'
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import {Polygon, MultiPoint, LineString} from 'ol/geom'
import * as olCoordinate from 'ol/coordinate';

import {Fill, Stroke, Style, Circle as CircleStyle, RegularShape, Image} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';
import { service } from './service'


export default class StyleMap extends Component {
    constructor(props) {

            super(props)

            this.state = {
                geojson: [],
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
                style_state: props.style_state,
                style_color: props.style_color,
                style_size: props.style_size,
                fill_color: props.fill_color,
                style_name: props.style_name,
                view_name : props.view_name ? props.view_name : 'geoserver_desing_view',
                url: props.url,
                defualt_url: props.defualt_url,
                geom_type: props.geom_type,
                dashed_line_gap: props.dashed_line_gap,
                dashed_line_length: props.dashed_line_length,
                color_opacity: props.color_opacity,
                wellknownname: props.wellknownname


            }
            this.loadMapData = this.loadMapData.bind(this)
            this.loadMap = this.loadMap.bind(this)
        }

    componentDidMount() {
        this.loadMap()
        this.loadMapData()
    }

    componentDidUpdate(pP, pS){
        if(pP.geom_type !=this.props.geom_type){
            this.setState({geom_type:this.props.geom_type})
        }
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

    loadMapData(){
        const {
                style_state, style_color, style_size,
                fill_color, style_name, view_name,url,
                defualt_url, geom_type, dashed_line_gap,
                dashed_line_length, color_opacity, wellknownname,
                dataProjection, featureProjection,
        } = this.state
        if (wellknownname){
            var { points, radius, angle, rotation, radius2} = 0
            if (wellknownname == 'square') {
                    points = 4
                    radius = 10
                    angle = Math.PI / 4
            }
            else if (wellknownname == 'triangle'){
                    points = 3
                    radius = 10
                    rotation = Math.PI / 4
                    angle = 0
            }
            else if (wellknownname == 'star'){
                    points = 5
                    radius = 10
                    radius2 = 4
                    angle = 0
            }
            else if (wellknownname == 'cross'){
                        points =  4
                        radius = 10
                        radius2 = 0
                        angle = 0
            }
            var point_style = new RegularShape({
                    fill: new Fill({
                        color: fill_color,
                    }),
                    stroke: new Stroke({
                        color: style_color,
                        width: style_size,
                        lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                    }),
                    points: points,
                    radius: radius,
                    radius2: radius2,
                    rotation: rotation,
                    angle: angle
                })
            }
        else{

               var point_style = new CircleStyle({
                        radius: 5,
                        fill: new Fill({
                            color: fill_color,
                        }),
                        stroke: new Stroke({
                            color: style_color,
                            width: style_size,
                        }),
                    })
                }

        const styles_new = {
            'MultiPolygon': new Style({
                stroke: new Stroke({
                    color: style_color,
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity
                }),
            }),
            'Polygon': new Style({
                stroke: new Stroke({
                    color: style_color,
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity

                }),
            }),
            'Point': new Style({
                image: point_style
            }),
            'LineString': new Style({
                stroke: new Stroke({
                    color: style_color,
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                    // linecap: 'round'
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity
                }),
            }),
            'MultiLineString': new Style({
                stroke: new Stroke({
                    color: style_color,
                    width: style_size,
                    lineDash: dashed_line_length ? [dashed_line_gap, dashed_line_length] : '' ,
                    // linecap: 'round'
                }),
                fill: new Fill({
                    color: fill_color,
                    opacity: color_opacity
                }),
            }),
            'MultiPoint': new Style({
                image: point_style
            }),
          };

        if (style_state == 'update_style')
        {   var params = []
            if ( style_name){
               params= {
                    'FORMAT': 'image/png',
                    'styles': style_name,
                }
            }
            else{
                params= {
                    'FORMAT': 'image/png',
                    'cql_filter':  `field_type like '${geom_type}'`
                }
            }

            const updata_layer = {
                tile: new Tile({
                source: new TileWMS({
                    projection: featureProjection,
                    url: url ? url : defualt_url,
                    params: params
                }),
            })}

        this.map.addLayer(updata_layer.tile)
        }

        if(style_state == 'create_style'){
            service.getStyleData(geom_type).then(({data}) =>
                {
                if (data){
                        const features = new GeoJSON({
                            dataProjection: dataProjection,
                            featureProjection: featureProjection,
                        }).readFeatures(data)
                        const vectorSource = new VectorSource({
                            features: features
                        });
                        const vector_layer = new VectorLayer({
                        source: vectorSource,
                        style: function (feature) {
                            return styles_new[feature.getGeometry().getType()];
                          }
                        })
                        this.map.addLayer(vector_layer)
                        this.map.getView().fit(vectorSource.getExtent(),{ padding: [200, 200, 200, 200] });
                    }
                }
        )

    }

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
