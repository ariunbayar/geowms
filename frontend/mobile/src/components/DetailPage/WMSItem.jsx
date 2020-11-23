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
        this.state.layers.map((layer) =>
            layer.tile.setVisible(is_visible)
        )
    }

    render() {

        const {tiles, name, layers, is_visible} = this.state
        return (
            <Fragment>
                <div className="col-11">
                    <div className="col-12">
                        <span> {name}</span>
                        <hr></hr>
                    </div>
                </div>
                <WMSLayerItems
                    layers={layers}
                    tileWMS={tiles}
                />
            </Fragment>
        )
    }
}
