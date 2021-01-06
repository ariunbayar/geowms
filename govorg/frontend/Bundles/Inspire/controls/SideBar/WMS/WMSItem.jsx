import React, { Component, Fragment } from "react"

import WMSLayerItems from "./WMSLayerItems"


export default class WMSItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.wms.name,
            tiles: props.wms.tiles,
            layers: props.wms.layers,
        }
    }

    render() {

        const {tiles, name, layers, is_visible} = this.state
        return (
            <Fragment>
                <WMSLayerItems
                    layers={layers}
                    tileWMS={tiles}
                />
            </Fragment>
        )
    }
}
