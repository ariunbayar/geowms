import React, { Component } from "react"
import WMSLayerItem from "./WMSLayerItem"


export default class WMSLayerItems extends Component {

    constructor(props) {
        super(props)

        this.state = {
            layers: props.layers,
            visibility: props.layers.map(({code}) => ({code, is_visible: false}))
        }
        this.handleToggleLayer = this.handleToggleLayer.bind(this)

    }

    handleToggleLayer({code}, is_visible) {

        const visibility = this.state.visibility.map((layer) => {
            if (layer.code == code)
                return {code: layer.code, is_visible: is_visible}
            else
                return layer
        })
        this.setState({visibility})

        const {tileWMS} = this.props
        tileWMS.updateParams({
            ...tileWMS.getParams(),
            'LAYERS': visibility.reduce((acc, {code, is_visible}) => {
                    if (is_visible) acc.push(code)
                    return acc
                }, []).join(','),
        })
        tileWMS.refresh()
    }

    render() {
        return (
            <ul style={{listStyle: 'none'}}>
                {this.state.layers.map((layer, idx) =>
                    <WMSLayerItem
                        layer={layer}
                        key={idx}
                        handleToggle={(v) => this.handleToggleLayer(layer, v)}
                    />
                )}
            </ul>
        )
    }

}
