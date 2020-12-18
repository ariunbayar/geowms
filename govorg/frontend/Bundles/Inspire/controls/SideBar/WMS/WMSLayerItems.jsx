import React, { Component } from "react"
import WMSLayerItem from "./WMSLayerItem"


export default class WMSLayerItems extends Component {

    constructor(props) {
        super(props)

        this.state = {
            layers: props.layers,
        }
    }

    render() {
        return (
            <div className="row">
                {this.state.layers.map((layer, idx) =>
                    <WMSLayerItem
                        layer={layer}
                        key={idx}
                    />
                )}
            </div>
        )
    }

}
