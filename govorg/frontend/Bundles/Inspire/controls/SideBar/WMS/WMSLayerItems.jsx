import React, { Component } from "react"
import WMSLayerItem from "./WMSLayerItem"


export default class WMSLayerItems extends Component {

    constructor(props) {
        super(props)

        this.state = {
            layers: props.layers,
            z_index: 0,
        }
    }

    handleSetZIndex() {
        this.setState({z_index: this.state.z_index+1})
    }

    render() {
        return (
            <div className="row">
                {this.state.layers.map((layer, idx) =>
                    <WMSLayerItem
                        layer={layer}
                        key={idx}
                        z_index={this.state.z_index}
                        handleSetZIndex={() => this.handleSetZIndex()}
                    />
                )}
            </div>
        )
    }

}
