import { none } from "ol/centerconstraint"
import React, { Component, Fragment } from "react"

import WMSLayerItems from "./WMSLayerItems"


export default class WMSItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.wms.name,
            tiles: props.wms.tiles,
            layers: props.wms.layers,
            is_visible: true,
        }

        this.toggle = this.toggle.bind(this)

    }

    toggle(e) {
        const is_visible = e.target.checked
        this.setState({is_visible})
        this.props.addLayer(this.state.layers, null, is_visible)
    }

    render() {

        const {tiles, name, layers, is_visible} = this.state
        return (
            <Fragment>

                <div className="my-1">
                    <div className="custom-control custom-switch font-weight-bold">
                        <input
                        type="checkbox" className="custom-control-input" id={name}
                        onChange={this.toggle}
                        checked={is_visible}
                        />
                        <label className="custom-control-label" htmlFor={name}>{name}</label>
                    </div>
                </div>
                <WMSLayerItems
                    name={name}
                    layers={layers}
                    addLayer={this.props.addLayer}
                    tileWMS={tiles}
                />
            </Fragment>
        )
    }
}
