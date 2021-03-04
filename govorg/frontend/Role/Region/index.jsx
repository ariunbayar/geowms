import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import MapRegion from './MapRegion'

export default class Region extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { allowed_geom } = this.props
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <MapRegion geom={ allowed_geom }/>
                    </div>
                </div>
            </div>
        )
    }

}
