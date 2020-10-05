import React, { Component } from "react"

import "./styles.css"
import { service } from "./service"

import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import View from 'ol/View';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

export default class Test extends Component {

    constructor(props) {

        super(props)

        this.state = {
            map: '',
            source: '',
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        }
        this.loadMapData = this.loadMapData.bind(this)
        this.addInteraction = this.addInteraction.bind(this)
    }

    componentDidMount() {

        this.loadMapData()

    }

    loadMapData(){

        const raster = new TileLayer({
                source: new OSM(),
            })

        const source = new VectorSource({wrapX: false})

        const vector = new VectorLayer({
            source: source,
        })

        const map = new Map({
            layers: [raster, vector],
            target: 'map',
            view: new View({
              center: [-11000000, 4600000],
              zoom: 4,
            }),
        })

        this.map = map
        this.source = source
        this.addInteraction()

    }

    addInteraction() {
        const map = this.map
        const source = this.source
        const typeSelect = document.getElementById('type')

        const value = typeSelect.value
        
        if (value !== 'None') {

            const draw = new Draw({
              source: source,        
              type: typeSelect.value,        
            })

            map.addInteraction(draw)

            this.draw = draw
        
        }
    }

    handleOnChange(e) {
        const map = this.map
        const draw = this.draw

        const value = e.target.value
        
        if (value !== 'None') {
            map.removeInteraction(draw);
            this.addInteraction();        
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12 px-0">
                    <div id="map" className="map"></div>
                    <form class="form-inline">
                        <label>Geometry type &nbsp;</label>
                        <select id="type" onChange={event => this.handleOnChange(event)}>
                            <option value="Point">Point</option>
                            <option value="LineString">LineString</option>
                            <option value="Polygon">Polygon</option>
                            <option value="Circle">Circle</option>
                            <option value="None">None</option>
                        </select>
                    </form>
                </div>
            </div>
        )
    }
}
