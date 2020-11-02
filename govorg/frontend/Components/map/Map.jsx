import React, { Component, Fragment } from "react"
import GeoJSON from 'ol/format/GeoJSON'
import 'ol/ol.css'
import {Map, View, Feature} from 'ol'
import {transform as transformCoordinate} from 'ol/proj'
import Tile from 'ol/layer/Tile'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import {Circle as CircleStyle, Fill, Stroke, Style, Icon} from 'ol/style'
import {Draw, Modify, Select, Snap} from 'ol/interaction'

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
            format: new GeoJSON(),
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
            is_sidebar_open: true,
            coordinate_clicked: '',
            vector_layer: null,
            is_draw_open: false,
            draw_layer: null,
            draw: null,
            source_draw: null,
            info:[],
            xy: [],
            map_open:true,
            geoms: [],
            ayuul_geoms: [],
            geom_points: [],
        }

        this.controls = {
            coordinateCopy: new CoordinateCopy(),
        }

        this.marker = this.initMarker()
        this.handleMapDataLoaded = this.handleMapDataLoaded.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.loadMapData = this.loadMapData.bind(this)
        this.showFeaturesAt = this.showFeaturesAt.bind(this)
        this.handleSetCenter = this.handleSetCenter.bind(this)
        this.loadGeojson = this.loadGeojson.bind(this)
        this.snap = this.snap.bind(this)
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
        const geoms = this.props.geoms
        this.loadMapData()
    }

    loadMapData() {
            service.loadBaseLayers().then(({base_layer_list}) => {
            this.handleMapDataLoaded(base_layer_list)
        })
    }

    snap(vector){
        const snap = new Snap({
            source: vector.getSource(),
        });
        this.map.addInteraction(snap);
    }

    loadGeojson(rows, color_type){

        const map = this.map
        const styles = {
          'Polygon': new Style({
            stroke: new Stroke({
              color: color_type,
              width: 4,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
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
        };

        const features = []
        rows.map((row) => {
            const { id, geom } = row
            if (geom){
                const feature = (new GeoJSON().readFeatures(geom, {
                dataProjection: this.state.dataProjection,
                featureProjection: this.state.featureProjection,
                }))[0]
            feature.setProperties({ id })

            features.push(feature)
            }
        })
        const vectorSource = new VectorSource({
            features: features,
        })

        const vectorLayer = new VectorLayer({
            name: 'vector_layer',
            source: vectorSource,
            style: (feature) => styles[feature.getGeometry().getType()],
        })
        map.addLayer(vectorLayer)
        this.snap(vectorLayer)
        if(color_type == 'orange') {
            this.vectorLayer = vectorLayer
        }
        if(color_type == 'red') {
            this.ayuul_vectorLayer = vectorLayer
        }
        if(color_type == 'blue') {
            this.geom_point_layer = vectorLayer
        }

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
                    projection: this.state.dataProjection,
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
        this.handleSetCenter()
    }

    handleMapClick(event) {
            this.marker.point.setCoordinates(event.coordinate)
            const projection = event.map.getView().getProjection()
            const map_coord = transformCoordinate(event.coordinate, projection, this.state.dataProjection)
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
            this.props.handleXY(array, null, null)
        }
        else{
            service.findSum(array).then(({success, info}) => {
                this.props.handleXY(array, info, success)
             })
        }

    }

    componentDidUpdate(pP){
        if(pP.xy !== this.props.xy){
            this.handleSetCenter()
        }
        if(pP.geoms !== this.props.geoms){
            if (this.vectorLayer) this.vectorLayer.getSource().clear();
            const geoms = this.props.geoms
            this.setState({geoms})
            this.loadGeojson(geoms, 'orange')
        }
        if(pP.ayuul_geoms !== this.props.ayuul_geoms){
            if (this.ayuul_vectorLayer) this.ayuul_vectorLayer.getSource().clear();
            const ayuul_geoms = this.props.ayuul_geoms
            this.setState({ayuul_geoms})
            this.loadGeojson(ayuul_geoms, 'red')
        }
        if(pP.geom_points !== this.props.geom_points){
            if (this.geom_point_layer) this.geom_point_layer.getSource().clear();
            const geom_points = this.props.geom_points
            this.setState({geom_points})
            this.loadGeojson(geom_points, 'blue')
        }
    }

    handleSetCenter() {
        const coord = this.props.xy
        if(coord[0]>60){
            const view = this.map.getView()
            const map_projection = view.getProjection()
            const map_coord = transformCoordinate(coord, this.state.dataProjection, map_projection)
            this.marker.point.setCoordinates(map_coord)
            view.setCenter(map_coord)
        }

    }

    render() {
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <div className="🌍">
                            <div id={this.state.map_open ? "map" : "map-disable"} className="mt-2"></div>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-info btn-sm waves-effect waves-light m-1 map-open-button"
                    onClick={() => this.setState(prevState => ({map_open: !prevState.map_open}))}
                >
                {this.state.map_open ? "Газрын зураг хаах" : "Газрын зураг нээх"}
                </button>
            </div>
        )
    }
}
