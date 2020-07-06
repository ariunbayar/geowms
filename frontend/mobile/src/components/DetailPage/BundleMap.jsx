import React, { Component, Fragment } from "react"

import 'ol/ol.css'
import {Map, View} from 'ol'
import {transform as transformCoordinate} from 'ol/proj'

import Tile from 'ol/layer/Tile'
import TileImage from 'ol/source/TileImage'
import TileWMS from 'ol/source/TileWMS'
import OSM from 'ol/source/OSM'
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls, MousePosition, ScaleLine} from 'ol/control'

import {СуурьДавхарга} from './controls/СуурьДавхарга'
import {CoordinateCopy} from './controls/CoordinateCopy'

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
            coordinate_clicked: null,
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
        }

        this.handleToggle = this.handleToggle.bind(this)
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.showDetail = this.showDetail.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
    }

    componentDidMount() {
        this.loadMapData(this.state.bundle.id)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.coordinate_clicked !== this.state.coordinate_clicked) {
            this.controls.coordinateCopy.setCoordinate(this.state.coordinate_clicked)
        }

        if (this.props.bundle.id === prevProps.bundle.id) return

        const {bundle} = this.props
        this.setState({bundle})

        this.loadMapData(bundle.id)

    }

    loadMapData(bundle_id) {

        Promise.all([
            service.loadBaseLayers(),
            service.loadWMSLayers(bundle_id),
        ]).then(([{base_layer_list}, {wms_list}]) => {
            this.handleMapDataLoaded(base_layer_list, wms_list)
        })

    }

    handleMapDataLoaded(base_layer_list, wms_list) {

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

        const {base_layers, base_layer_controls} =
            base_layer_list.reduce(
                (acc, base_layer_info, idx) => {

                    const layer = new Tile({
                        source: new TileImage({
                            crossOrigin: 'Anonymous',
                            url: base_layer_info.url,
                        }),
                    })

                    acc.base_layers.push(layer)
                    acc.base_layer_controls.push({
                        is_active: idx == 0,
                        thumbnail_1x: base_layer_info.thumbnail_1x,
                        thumbnail_2x: base_layer_info.thumbnail_2x,
                        layer: layer,
                    })

                    return acc

                },
                {
                    base_layers: [],
                    base_layer_controls: []
                }
            )


        const map = new Map({
            target: 'map',
            controls: defaultControls().extend([
                new MousePosition({
                    projection: 'EPSG:4326',
                    coordinateFormat: createStringXY(6),
                    undefinedHTML: '',
                }),
                new СуурьДавхарга({layers: base_layer_controls}),
                new ScaleLine(),
                this.controls.coordinateCopy,
            ]),
            layers: [
                ...base_layers,
                ...map_wms_list.map((wms) => wms.tile),
            ],
            view: new View({
                projection: 'EPSG:3857',
                center: [11561613.630815497, 5678656.0228370065],
                zoom: 4.041301562246971,
            })
        })

        map.on('click', this.handleMapClick)

        this.map = map

    }

    handleMapClick(event) {

        const projection = event.map.getView().getProjection()
        const map_coord = transformCoordinate(event.coordinate, projection, 'EPSG:4326')
        const coordinate_clicked = (createStringXY(6))(map_coord)

        this.setState({coordinate_clicked})

    }

    handleToggle(idx) {
        const layer = this.state.layers[idx]
        layer.setVisible(!layer.getVisible())
    }

    showDetail() {

        const center = this.map.getView().getCenter()
        const zoom = this.map.getView().getZoom()
    }

    toggleSidebar(event) {
        this.setState({is_sidebar_open: event})
    }

    render() {
        return (
            <div>
                <button onClick={this.showDetail} style={{display: 'none'}}>click here</button>
                <div className="row">

                    <div className="col-md-12">
                        <div className="🌍">
                            <div id="map"></div>

                            <div className={'col-md-3 ⚙' + (this.state.is_sidebar_open ? '' : ' d-none')}>
                                <Sidebar map_wms_list={this.state.map_wms_list} toggleSidebar={this.toggleSidebar}/>
                            </div>

                            <div className={'⚙-toggle'}>
                                <a href="#" onClick={() =>this.toggleSidebar(true)}>
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
