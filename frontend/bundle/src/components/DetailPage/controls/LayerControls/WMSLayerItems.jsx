import React, { Component } from "react"
import WMSLayerItem from "./WMSLayerItem"

import "../../styles.css"


export default class WMSLayerItems extends Component {

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    checkAllIsLayersDisplay(is_visible) {
        const layers = this.props.layers
        const is_display_layers = this.props.is_display_layers

        if (is_visible && !is_display_layers) {
            this.props.setIsDisplayLayers(is_visible)
        }
        else if(!is_visible && is_display_layers) {

            let all_unchecked = true

            for (const idx in layers) {
                const layer = layers[idx]
                const checked = layer.checked

                if (is_display_layers && checked) {
                    all_unchecked = !checked
                    break
                }

            }

            if (all_unchecked && is_display_layers) {
                this.props.setIsDisplayLayers(!all_unchecked)
            }

        }

    }

    render() {
        return (
            <ul className="wms-layer-items">
                {
                    this.props.layers.map((layer, idx) =>
                        <WMSLayerItem
                            layer={layer}
                            addLayer={this.props.addLayer}
                            key={idx}
                            name={this.props.name}
                            checkAllIsLayersDisplay={(is_display) => this.checkAllIsLayersDisplay(is_display)}
                        />
                    )
                }
            </ul>
        )
    }

}
