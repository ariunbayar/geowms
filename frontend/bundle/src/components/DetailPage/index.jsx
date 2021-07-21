import React, { Component } from "react"

import BundleMap from './BundleMap'


export class DetailPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bundle: props.bundle,
        }
    }

    render() {
        return (
            <BundleMap bundle={this.state.bundle}/>
        )
    }
}
