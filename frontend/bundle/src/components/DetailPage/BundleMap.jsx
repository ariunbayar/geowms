import React, { Component, Fragment } from "react"

import 'ol/ol.css'
import {Map, View} from 'ol'
import Tile from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import OSM from 'ol/source/OSM'

import "./styles.css";
import {service} from './service'
import {Sidebar} from './Sidebar'


export default class BundleMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bundle: props.bundle,
            map_wms_list: [],
            is_sidebar_open: false,
        }

        this.handleToggle = this.handleToggle.bind(this)
        this.handleWMSLayersLoaded = this.handleWMSLayersLoaded.bind(this)
        this.showDetail = this.showDetail.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
    }

    componentDidMount() {

        service.loadWMSLayers(this.state.bundle.id).then(({wms_list}) => {
            this.handleWMSLayersLoaded(wms_list)
        })
    }

    componentDidUpdate(prevProps) {

        if (this.props.bundle.id === prevProps.bundle.id) return

        const {bundle} = this.props
        this.setState({bundle})

        service.loadWMSLayers(bundle.id).then(({wms_list}) => {
            this.handleWMSLayersLoaded(wms_list)
        })

    }

    handleWMSLayersLoaded(wms_list) {

        const map_wms_list = wms_list.map(({name, url, layers}) => {

            return {
                name,
                layers,
                tile: new Tile({
                    source: new TileWMS({
                        projection: 'EPSG:3857',
                        url: url,
                        params: {
                            'LAYERS': layers[0].code,
                            //'FORMAT': 'image/svg+xml',
                            'FORMAT': 'image/png',
                        }
                    }),
                }),
            }

        })

        this.setState({map_wms_list})

        const layer_osm = new Tile({
            source: new OSM({
                attributions: '',
            })
        })


        const map = new Map({
            target: 'map',
            layers: [
                layer_osm,
                ...map_wms_list.map((wms) => wms.tile),
            ],
            view: new View({
                projection: 'EPSG:3857',
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            })
        })

        this.map = map

    }

    handleToggle(idx) {
        const layer = this.state.layers[idx]
        layer.setVisible(!layer.getVisible())
    }

    showDetail() {

        const center = this.map.getView().getCenter()
        const zoom = this.map.getView().getZoom()

        console.log(center);
        console.log(zoom);

    }

    toggleSidebar(event) {
        event.preventDefault()
        this.setState(prevState => ({
            is_sidebar_open: !prevState.is_sidebar_open,
        }))
    }

    render() {
        return (

            <div className="container my-4">
                <button onClick={this.showDetail} style={{display: 'none'}}>click here</button>
                <div className="row">

                    <div className="col-md-12">
                        <div className="🌍">
                            <div id="map"></div>

                            <div className={'col-md-3 ⚙' + (this.state.is_sidebar_open ? '' : ' d-none')}>
                                <Sidebar map_wms_list={this.state.map_wms_list}/>
                            </div>

                            <div className={'⚙-toggle'}>
                                <a href="#" onClick={this.toggleSidebar}>
                                    <i className="fa fa-bars fa-lg" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
