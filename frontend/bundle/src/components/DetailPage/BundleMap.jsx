import React, { Component, Fragment } from "react"

import 'ol/ol.css'
import {Map, View} from 'ol'
import {transform as transformCoordinate} from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import Tile from 'ol/layer/Tile'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Style, Stroke, Fill} from 'ol/style'
import TileImage from 'ol/source/TileImage'
import TileWMS from 'ol/source/TileWMS'
import OSM from 'ol/source/OSM'
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'

import {СуурьДавхарга} from './controls/СуурьДавхарга'
import {CoordinateCopy} from './controls/CoordinateCopy'
import {Modal} from './controls/Modal'

import "./styles.css";
import {service} from './service'
import {Sidebar} from './Sidebar'


export default class BundleMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projection: 'EPSG:3857',
            projection_display: 'EPSG:4326',
            bundle: props.bundle,
            map_wms_list: [],
            is_sidebar_open: false,
            coordinate_clicked: null,
            vector_layer: null,
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
                modal:new Modal(),
        }

        this.handleToggle = this.handleToggle.bind(this)
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
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
                        projection: this.state.projection,
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

        const vector_layer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(100, 255, 0, 1)',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(100, 255, 0, 0.3)'
                })
            })
        })
        this.setState({vector_layer})


        const map = new Map({
            target: 'map',
            controls: defaultControls().extend([
                new FullScreen(),
                new MousePosition({
                    projection: this.state.projection_display,
                    coordinateFormat: createStringXY(6),
                    undefinedHTML: '',
                }),
                new СуурьДавхарга({layers: base_layer_controls}),
                new ScaleLine(),
                this.controls.modal,
                this.controls.coordinateCopy,
            ]),
            layers: [
                ...base_layers,
                ...map_wms_list.map((wms) => wms.tile),
                vector_layer,
            ],
            view: new View({
                projection: this.state.projection,
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            })
        })

        map.on('click', this.handleMapClick)

        this.map = map

    }

    handleMapClick(event) {

        const projection = event.map.getView().getProjection()
        const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
        const coordinate_clicked = (createStringXY(6))(map_coord)

        this.setState({coordinate_clicked})

        this.showFeaturesAt(event.coordinate)

    }

    showFeaturesAt(coordinate) {

        const view = this.map.getView()
        const projection = view.getProjection()
        const resolution = view.getResolution()

        this.state.map_wms_list.forEach(({tile}) => {

            const wms_source = tile.getSource()

            const url = wms_source.getFeatureInfoUrl(
                coordinate,
                resolution,
                projection,
                {
                    //'INFO_FORMAT': 'text/xml'
                    //'INFO_FORMAT': 'text/html'
                    'INFO_FORMAT': 'application/vnd.ogc.gml',
                }
            )

            if (url) {

                this.controls.modal.showModal(null, false)

                fetch(url)
                    .then((response) => response.text())
                    .then((text) => {
                        const parser = new WMSGetFeatureInfo()
                        const features = parser.readFeatures(text)
                        const source = new VectorSource({
                            features: features
                        });
                        this.state.vector_layer.setSource(source)

                        const feature_info = features.map((feature) => {
                            console.log(feature);
                            const geometry_name = feature.getGeometryName()
                            const values =
                                feature.getKeys()
                                .filter((key) => key != geometry_name)
                                .map((key) => [key, feature.get(key)])
                            return [feature.getId(), values]
                        })
                        this.controls.modal.showModal(feature_info, true)
                    })
            } else {
                /* TODO */
                console.log('no feature url', wms_source);
            }
        })

    }

    handleToggle(idx) {
        const layer = this.state.layers[idx]
        layer.setVisible(!layer.getVisible())
    }

    toggleSidebar(event) {
        event.preventDefault()
        this.setState(prevState => ({
            is_sidebar_open: !prevState.is_sidebar_open,
        }))
    }

    render() {

        return (

            <div>
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
