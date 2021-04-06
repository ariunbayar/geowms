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
            choose: 'this_org',
            value: '',
        }
        this.getAddresses = this.getAddresses.bind(this)
        this.getFeature = this.getFeature.bind(this)
        this.saveErguulPlace = this.saveErguulPlace.bind(this)
        this.saveErguulTailbar = this.saveErguulTailbar.bind(this)
        this.setLoading = this.setLoading.bind(this)
        this.handleChoose = this.handleChoose.bind(this)
    }

    componentDidMount() {
        this.getAddresses(this.state.choose, this.state.value)
    }

    getAddresses(choose, value) {
        service
            .getAddresses(choose, value)
            .then(({ success, points }) => {
                if (success) {
                    let is_empty = false
                    if (points['features'].length < 2) {
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

    setLoading(is_true) {
        this.setState({ is_loading: is_true })
    }

    saveErguulPlace(values, emp_id, coordinates, photo, erguul_id) {
        const coordinate = this.getPoint(coordinates)
        service
            .saveErguul(values, emp_id, coordinate, photo, erguul_id)
            .then(({ success, info }) => {
                if (success) {
                    alert(info)
                    this.setLoading(false)
                }
            })
            .catch(error => {
                alert("Алдаа гарсан байна")
                this.setLoading(false)

            })
    }

    saveErguulTailbar(values) {
        this.setLoading(true)
        service
            .saveTailbar(values)
            .then(({ success, info }) => {
                alert(info)
                this.setLoading(false)

            })
            .catch(error => {
                alert("Алдаа гарсан байна")
                this.setLoading(false)
            })
    }

    handleChoose(choose, value) {
        this.getAddresses(choose, value)
    }

    render() {
        const { points, feature, is_loading, is_empty } = this.state
        const { employee } = this.props

        const is_admin = employee.is_admin

        return (
            <div className="card">
                <div className="card-body">
                    <Loader is_loading={is_loading}/>
                    <div className="col-12">
                        <SearchSelects sendFeature={this.getFeature} handleChoose={this.handleChoose} />
                        <AddressMap
                            features={points}
                            feature={feature}
                            saveErguulPlace={
                                (...values) => this.saveErguulPlace(...values)
                            }
                            is_admin={is_admin}
                            setLoading={this.setLoading}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
