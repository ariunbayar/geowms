import React, { Component } from "react"

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { service } from "./service"
import "../styles.css"

export default class DedButets extends Component {

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

        const map = new Map({
            target: 'map', 
            layers: [
            new TileLayer({
              source: new OSM(),
                })
            ],
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
