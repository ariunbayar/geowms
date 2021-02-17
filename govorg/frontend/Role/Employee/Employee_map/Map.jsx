import React, { Component } from "react"
import { Map, View, Feature } from 'ol'

import { Vector as VectorSource, OSM } from 'ol/source'
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer'
import { transform as transformCoordinate, fromLonLat } from 'ol/proj'
import { Icon, Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style'
import { format as coordinateFormat } from 'ol/coordinate';
import { Point } from 'ol/geom'
import { GeoJSON } from 'ol/format'
import 'ol/ol.css'

export default class EmployeeMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projection_data: 'EPSG:4326',
            projection_display: 'EPSG:3857',
            coordinate_clicked: [],
            features: [],
        }
        this.marker = this.initMarker()

        this.loadMap = this.loadMap.bind(this)
        this.handleMapClick = this.handleMapClick.bind(this)
        this.setFeatures = this.setFeatures.bind(this)
        this.removeFeatureFromSource = this.removeFeatureFromSource.bind(this)
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
        this.loadMap()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.feature !== this.props.feature) {
            if (this.props.feature !== {}) {
                this.setFeatures(this.props.feature)
            }
        }
        if (prevProps.point !== this.props.point) {
            if (this.props.point && this.props.point !== {}) {
                this.setMarker(this.props.point)
            }
        }
        if (prevProps.is_marker !== this.props.is_marker) {
            if (this.props.point !== {}) {
                this.setMarker(this.props.point)
            }
        }
    }

    removeFeatureFromSource(featureID) {
        const source = this.vector_layer.getSource()
        const features = source.getFeatures();
        if (features != null && features.length > 0) {
            for (var i = 0; i < features.length; i++) {
                const properties = features[i].getProperties();
                const id = properties.id;
                if (id == featureID) {
                    source.removeFeature(features[i]);
                    break;
                }
            }
        }
    }

    fromLonLatToMapCoord(coordinate) {
        return fromLonLat(coordinate);
    }

    setMarker(point) {
        const point_obj = JSON.parse(point)
        if (point_obj) {
            const coordinates = point_obj.coordinates
            const coordinate = this.fromLonLatToMapCoord(coordinates)
            this.marker.point.setCoordinates(coordinate)
            this.props.sendPointCoordinate([coordinates[1], coordinates[0]])
        }
    }

    setFeatures(feature) {
        const id = 'aimag_sum'
        this.removeFeatureFromSource(id)
        var feature =  new GeoJSON().readFeatures(feature, {
            dataProjection: this.state.projection_data,
            featureProjection: this.state.projection_display,
        });
        feature[0].setProperties({ id })
        this.vector_layer.getSource().addFeature(feature[0])
        this.map.getView().fit(feature[0].getGeometry(),{ padding: [100, 100, 100, 100], duration: 2000 })
    }

    loadMap() {
        const marker_layer = new VectorLayer({
            source: new VectorSource({
                features: [this.marker.feature],
            }),
        })
        this.marker_layer = marker_layer

        const vector_layer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(100, 255, 0, 1)',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(100, 255, 0, 0.3)'
                })
            }),
        })

        this.vector_layer = vector_layer

        const map = new Map({
          layers: [
              new TileLayer({
                source: new OSM(),
              }),
              vector_layer,
              marker_layer,
          ],
          target: 'map',
          view: new View({
              center: [11461613.630815497, 5878656.0228370065],
              zoom: 5.041301562246971,
          }),
        });

        map.on('click', this.handleMapClick)
        this.map = map
    }

    handleMapClick(event) {
        const coordinate = event.coordinate
        this.marker.point.setCoordinates(coordinate)

        const projection = event.map.getView().getProjection()
        const map_coord = transformCoordinate(event.coordinate, projection, this.state.projection_data)
        const coordinate_clicked = coordinateFormat(map_coord, '{y},{x}', 6)

        this.props.sendPointCoordinate(coordinate_clicked, coordinate)

        this.setState({ coordinate_clicked })
    }

    render() {
        return (
            <div id="map">
            </div>
        )
    }
}
