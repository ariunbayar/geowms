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
            <ul style={{listStyle: 'none'}}>
                {this.state.layers.map((layer, idx) =>
                    <WMSLayerItem
                        layer={layer}
                        addLayer={this.props.addLayer}
                        key={idx}
                        name={this.props.name}
                    />
                )}
            </ul>
        )
    }

}
