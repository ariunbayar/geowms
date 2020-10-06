import React, { Component } from "react"

import 'ol/ol.css'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import OSM from 'ol/source/OSM'

import {Fill, Stroke, Style} from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON'

import {Vector as VectorSource} from 'ol/source'
import {Vector as VectorLayer} from 'ol/layer'

import Draw from 'ol/interaction/Draw';

import "./styles.css"
import { service } from "./service"
import DataTable from "./DataTable"


export default class BarilgaSuurinGazar extends Component {

    constructor(props) {

        super(props)

        this.state = {

            oid: this.props.match.params.oid,
            data: {
                fields: [],
                rows: [],
            },

            GeoJson: [],
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',

        }

        this.loadMapData = this.loadMapData.bind(this)
        this.addInteraction = this.addInteraction.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.loadRows = this.loadRows.bind(this)
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

        this.loadRows();

    }

    loadRows() {

        service
            .rows(this.state.oid)
            .then(({ data }) => {
                this.setState({ data })

            })

    }

    componentDidUpdate(prevProps, prevState) {

        const oid_old = prevProps.match.params.oid
        const oid = this.props.match.params.oid
        console.log(this.props)

        if (oid_old != oid) {

            this.setState({ oid }, () => {
                this.loadRows()
            })

        }
    }

    loadMapData(GeoJson){

        /*GeoJson өгөгдөл харуулах*/
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

        /* Шинээр дүрс зурах */
        const shpSource = new VectorSource({wrapX: false})

        const shpVector = new VectorLayer({
            source: shpSource,
        })

        const map = new Map({
            layers: [
                new TileLayer({
                  source: new OSM(),
                }),
                vectorLayer,
                shpVector
            ],
            target: 'map',
            view: new View({
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            }),
        })

        this.map = map
        this.source = shpSource
    }

    addInteraction(typeSelect) {

        console.log(typeSelect);
        console.log(this.draw);

        if (this.draw) {
            this.map.removeInteraction(this.draw)
        }

        const allowed_types = [
            'Point',
            'LineString',
            'Polygon',
            'Circle',
        ]

        if (allowed_types.includes[typeSelect])
            return


        const draw = new Draw({
            source: this.source,
            type: typeSelect,
        })

        this.map.addInteraction(draw)

        this.draw = draw
    }

    handleOnChange(e) {
        const typeSelect = e.target.value
        this.addInteraction(typeSelect)
    }

    render() {
        console.log(this.state.oid)
        return (
            <div className="row">
                <div className="col-md-12 px-0">

                    <div id="map" className="map"></div>
                    <div className="form-inline">
                        <label>Geometry type &nbsp;</label>
                        <select id="type" onChange={event => this.handleOnChange(event)}>
                            <option value="Point">Point</option>
                            <option value="LineString">LineString</option>
                            <option value="Polygon">Polygon</option>
                            <option value="Circle">Circle</option>
                            <option value="None">None</option>
                        </select>
                    </div>

                    <DataTable oid={this.state.oid}/>

                </div>
            </div>
        )
    }
}
