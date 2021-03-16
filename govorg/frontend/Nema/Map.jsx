import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import InspireMap from "@utils/BundleMap"

export default class NemaMap extends Component {

    render() {
        return (
            <div className="col-lg-12">
                <InspireMap/>
            </div>
        )
    }
}
