import React, { Component } from "react"
import AddressMap from './Map'
import {service} from '../Employee/service'
import SearchSelects from './SearchSelects'
import Loader from "@utils/Loader"
import {Form} from './Form'

export default class UsersAddress extends Component {

    constructor(props) {
        super(props)
        this.state = {
            points: [],
            feature: {},
            is_loading: true,
            is_empty: false,
        }
        this.getAddresses = this.getAddresses.bind(this)
        this.getFeature = this.getFeature.bind(this)
        this.saveErguulPlace = this.saveErguulPlace.bind(this)
        this.saveErguulTailbar = this.saveErguulTailbar.bind(this)
    }

    componentDidMount() {
        this.getAddresses()
    }

    getAddresses() {
        service
            .getAddresses()
            .then(({ success, points }) => {
                if (success) {
                    let is_empty = false
                    if (points['features'].length == 0) {
                        is_empty = true
                    }
                    this.setState({ points, is_loading: false, is_empty })
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

    saveErguulTailbar(values) {
        this.setState({ is_loading: true })
        service
            .saveTailbar(values)
            .then(({ success, info }) => {
                alert(info)
                this.setState({ is_loading: false })
            })
            .catch(error => {
                alert("Алдаа гарсан байна")
                this.setState({ is_loading: false })
            })
    }

    render() {
        const { points, feature, is_loading, is_empty } = this.state
        const { employee } = this.props

        const is_admin = employee.is_admin

        return (
            <div className="card">
                <div className="card-body">
                    <Loader is_loading={is_loading}/>
                    {
                        is_admin
                        ?
                            <div className="col-12">
                                <Loader is_loading={is_loading}/>
                                <SearchSelects sendFeature={this.getFeature} />
                                <AddressMap
                                    features={points}
                                    feature={feature}
                                    saveErguulPlace={(val, id, coord, photo) => this.saveErguulPlace(val, id, coord, photo)}
                                    is_admin={is_admin}
                                />
                            </div>
                        :
                            <div className="row">
                                <div className="col-4">
                                    <Form
                                        is_empty={is_empty}
                                        saveErguulTailbar={(val) => this.saveErguulTailbar(val)}
                                    />
                                </div>
                                <div className="col-8">
                                    <AddressMap
                                        features={points}
                                        saveErguulPlace={(val, id) => this.saveErguulPlace(val, id)}
                                        is_admin={is_admin}
                                    />
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}
