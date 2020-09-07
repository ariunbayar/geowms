import React, { Component, Fragment } from "react"
import 'ol/ol.css'
import {Map, View, Feature} from 'ol'
import {transform as transformCoordinate} from 'ol/proj'
import Tile from 'ol/layer/Tile'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Icon, Style, Stroke, Fill, Text} from 'ol/style'
import {Point} from 'ol/geom'
import TileImage from 'ol/source/TileImage'
import TileWMS from 'ol/source/TileWMS'
import {format as coordinateFormat} from 'ol/coordinate';
import {defaults as defaultControls, FullScreen, MousePosition, ScaleLine} from 'ol/control'
import {СуурьДавхарга} from './controls/СуурьДавхарга'
import {CoordinateCopy} from './controls/CoordinateCopy'
import "./styles.css"
import {service} from './service'

export default class Maps extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projection: 'EPSG:3857',
            projection_display: 'EPSG:4326',
            is_sidebar_open: true,
            coordinate_clicked: '',
            vector_layer: null,
            is_draw_open: false,
            draw_layer: null,
            draw: null,
            source_draw: null,
            info:[]
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
        }

        this.marker = this.initMarker()
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
    }

    initMarker() {
        const style = new Style({
            image: new Icon({
                anchor: [0.5, 86],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                scale: 0.4,
                src: '/static/assets/image/marker.png'
            })
        })
        const point = new Point([0, 0])
        const feature = new Feature({geometry: point})
        feature.setStyle(style)
        return {feature: feature, point: point}
    }

    componentDidMount() {
        this.loadMapData()
    }

    loadMapData() {
            service.loadBaseLayers().then(({base_layer_list}) => {
            this.handleMapDataLoaded(base_layer_list)
        })
    }

    handleMapDataLoaded(base_layer_list) {
        const {base_layers, base_layer_controls} =
            base_layer_list.reduce(
                (acc, base_layer_info, idx) => {

                    let layer

                    if (base_layer_info.tilename == "xyz") {
                        layer = new Tile({
                            source: new TileImage({
                                crossOrigin: 'Anonymous',
                                url: base_layer_info.url,
                            }),
                        })
                    }

                    if (base_layer_info.tilename == "wms") {
                        layer = new Tile({
                            source: new TileWMS({
                                url: base_layer_info.url,
                                params: {
                                    'LAYERS': base_layer_info.layers,
                                    'FORMAT': 'image/png',
                                }
                            }),
                        })
                    }

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

        const marker_layer = new VectorLayer({
            source: new VectorSource({
                features: [this.marker.feature],
            })
        })

        const map = new Map({
            target: 'map',
            controls: defaultControls().extend([
                new MousePosition({
                    projection: this.state.projection_display,
                    coordinateFormat: (coord) => coordinateFormat(coord, '{y},{x}', 6),
                    undefinedHTML: '',
                }),
                new СуурьДавхарга({layers: base_layer_controls}),
                new ScaleLine(),
                this.controls.coordinateCopy,
            ]),
            layers: [
                ...base_layers,
                vector_layer,
                marker_layer,
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
        this.marker.point.setCoordinates(event.coordinate)
        const projection = event.map.getView().getProjection()
        const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_display)
        const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)
        this.setState({coordinate_clicked})
        this.showFeaturesAt(coordinate_clicked)
    }

    showFeaturesAt(coordinate) {
        var array = coordinate.split(',').map(function(n) {
            return Number(n);
        });
        if(this.props.coordinatCheck)
        {
            this.props.handleXY(array, null)

        }
        else{
            service.findSum(array).then(({info}) => {
                if(info){
                 this.props.handleXY(array, info)
                }
             })
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="🌍">
                            <div className=" mt-5" id="map"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
