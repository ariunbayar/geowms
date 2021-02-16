import React, { Component } from "react"
import AddressMap from './Map'
import {service} from '../service'
import SearchSelects from './SearchSelects'

export default class UsersAddress extends Component {

    constructor(props) {
        super(props)
        this.state = {
            points: [],
            feature: {},
        }
        this.getAddresses = this.getAddresses.bind(this)
        this.getFeature = this.getFeature.bind(this)
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
                    this.setState({ points })
                }
            })
    }

    getFeature(feature) {
        this.setState({ feature })
    }

    render() {
        const { points, feature } = this.state
        return (
            <div>
                <div className="col-12">
                    <SearchSelects sendFeature={this.getFeature}/>
                    <AddressMap features={points} feature={feature}/>
                </div>
            </div>
        )
    }
}
