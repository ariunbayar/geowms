import React, { Component } from "react"

import {service} from './service'
import BundleMap from './BundleMap'


export class DetailPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bundle: props.bundle,
        }
    }

    handleSelectBundle(e, bundle) {
        e.preventDefault()
        this.setState({bundle})
    }

    render() {
        return (
            <BundleMap bundle={this.state.bundle}/>
        )
    }
}
