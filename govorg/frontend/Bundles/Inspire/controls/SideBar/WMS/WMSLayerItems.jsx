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
                        key={idx}
                        is_visible={this.props.is_visible}
                        toggle={this.props.toggle}
                    />
                )}
            </ul>
        )
    }

}
