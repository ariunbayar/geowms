import React, { Component } from "react"


import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';

import {Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';

export default class StyleMap extends Component {
    constructor(props) {

            super(props)

            this.state = {
                GeoJson: [],
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
                style_color: props.style_color,
                style_size: props.style_size,
                fill_color: props.fill_color
            }
            this.loadMapData = this.loadMapData.bind(this)
        }

    componentDidMount() {
        this.loadMapData()
    }
    componentDidUpdate(pP, pS){
        if(pP.style_color != this.props.style_color){
            this.setState({style_color:this.props.style_color})
        }

        if(pP.style_size != this.props.style_size){
            this.setState({style_size:this.props.style_size})
        }

        if(pP.fill_color != this.props.fill_color){
            this.setState({fill_color:this.props.fill_color})
        }
    }

    loadMapData(){
        var geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857',
              },
            },
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'GeometryCollection',
                        'geometries':[
                        {
                        'type': 'Point',
                        'coordinates': [107.440381, 47.665521],
                        },
                        {
                            'type': 'Polygon',
                            'coordinates': [[[107.43249017563821, 47.748258467424904], [107.47081237775578, 47.757920360049894], [107.49955402934395, 47.73408444650988], [107.46985432270284, 47.72055109925304], [107.43249017563821, 47.748258467424904]]],
                        },
                        {
                            'type': 'LineString',
                            'coordinates': [[107.28590179864848, 47.720297101865356], [107.3299278229883, 47.7228725623734], [107.35481209761515, 47.71643367237078], [107.3873530721272, 47.70355350499591], [107.36246879750036, 47.67649479179508]]
                        },
                    ],
                },
                },
            ],
        }

        const features = new GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: this.state.projection,
        }).readFeatures(geojsonObject)


        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonObject, {
            dataProjection: this.state.dataProjection,
            featureProjection: this.state.featureProjection,
          }),
        });

        const vectorLayer = new VectorLayer({
              source: vectorSource,
              style: new Style({
                stroke: new Stroke({
                    color: this.state.style_color,
                    width: this.state.style_size
                }),
                fill: new Fill({
                    color: this.state.fill_color
                })
            })
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
        map.getView().fit(vectorSource.getExtent(),{ padding: [200, 200, 200, 200] });
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
