import React, { Component } from "react"
import BundleMap from './BundleMap'

export class DetailPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bundle: props.bundle,
            wmsLayerScreenIsload: props.wmsLayerScreenIsload,
        }
    }

    handleSelectBundle(e, bundle) {
        e.preventDefault()
        this.setState({bundle})
    }
    componentDidUpdate(pP){
        if(pP.wmsLayerScreenIsload !== this.props.wmsLayerScreenIsload){
            const wmsLayerScreenIsload = this.props.wmsLayerScreenIsload
            this.setState({wmsLayerScreenIsload})
        }
    }

    render() {
        return (
            <BundleMap bundle={this.state.bundle} wmsLayerName={this.props.wmsLayerName} wmsLayerScreenIsload={this.state.wmsLayerScreenIsload}/>
        )
    }
}
