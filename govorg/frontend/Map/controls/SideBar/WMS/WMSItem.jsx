import React, { Component, Fragment } from "react"

import WMSLayerItems from "./WMSLayerItems"


export default class WMSItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.wms.name,
            tiles: props.wms.tiles,
            layers: props.wms.layers,
            is_visible: false,
        }

        this.toggle = this.toggle.bind(this)

    }

    toggle(is_visible) {
        this.setState({is_visible})
        this.state.layers.map((layer) =>
            layer.tile.setVisible(is_visible)
        )
    }

    render() {

        const {tiles, name, layers, is_visible} = this.state
        return (
            <Fragment>
                <div className="my-1">
                    <div className="custom-control custom-switch font-weight-bold">
                        <input
                            type="checkbox" className="custom-control-input" id={name}
                            onChange={(e) => this.toggle(e.target.checked)}
                            checked={is_visible}
                        />
                        <label className="custom-control-label" htmlFor={name}>{name}</label>
                    </div>
                </div>
                <WMSLayerItems
                    layers={layers}
                    tileWMS={tiles}
                    is_visible={is_visible}
                    toggle={this.toggle}
                />
            </Fragment>
        )
    }
}
