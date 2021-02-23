import React, { Component } from "react"
import AddressMap from './Map'
import {service} from '../service'
import SearchSelects from './SearchSelects'
import Loader from "@utils/Loader"


export default class UsersAddress extends Component {

    constructor(props) {
        super(props)
        this.state = {
            points: [],
            feature: {},
            is_loading: true,
        }
        this.getAddresses = this.getAddresses.bind(this)
        this.getFeature = this.getFeature.bind(this)
        this.saveErguulPlace = this.saveErguulPlace.bind(this)
    }

    componentDidMount() {
        const level = this.props.match.params.level
        const id = this.props.match.params.id
        this.getAddresses(level, id)
    }

    getAddresses(level, id) {
        service
            .getAddresses(level, id)
            .then(({ success, points }) => {
                if (success) {
                    this.setState({ points, is_loading: false })
                }
            })
    }

    getFeature(feature) {
        this.setState({ feature })
    }

    getPoint(point_coordinate) {
        let coordinates = point_coordinate
        if (typeof point_coordinate == 'string') {
            coordinates = point_coordinate.split(',')
        }
        const coordinate = [coordinates[1], coordinates[0]]
        return coordinate
    }

    saveErguulPlace(values, id, coordinates, photo) {
        const coordinate = this.getPoint(coordinates)
        this.setState({ is_loading: true })
        service
            .saveErguul(values, id, coordinate, photo)
            .then(({ success, info }) => {
                if (success) {
                    alert(info)
                    this.setState({ is_loading: false })
                }
            })
            .catch(error => {
                alert("Алдаа гарсан байна")
                this.setState({ is_loading: false })
            })
    }

    render() {
        const { points, feature, is_loading } = this.state
        return (
            <div>
                <div className="col-12">
                    <Loader is_loading={is_loading}/>
                    <SearchSelects sendFeature={this.getFeature}/>
                    <AddressMap
                        features={points}
                        feature={feature}
                        saveErguulPlace={
                            (...values) => this.saveErguulPlace(...values)
                        }
                    />
                </div>
            </div>
        )
    }
}
