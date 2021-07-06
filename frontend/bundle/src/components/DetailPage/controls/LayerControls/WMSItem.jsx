import React, { Component, Fragment } from "react"

import WMSLayerItems from "./WMSLayerItems"


export default class WMSItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.wms.name,
            tiles: props.wms.tiles,
            layers: props.wms.layers,
            is_display: props.wms.is_display,
            is_display_layers: props.wms.is_display_layers,
        }
        this.toggle = this.toggle.bind(this)
    }

    setIsDisplayLayers(is_display_layers) {
        this.props.wms.is_display_layers = is_display_layers
        this.setState({ is_display_layers })
    }

    toggle(is_visible) {
        this.props.addLayer(this.state.layers, null, is_visible)
    }

    setDisplay() {
        const is_display = !this.state.is_display
        this.props.wms.is_display = is_display
        this.setState({ is_display })
    }

    setDisplayLayers() {
        const is_display_layers = !this.state.is_display_layers
        this.toggle(is_display_layers)
        this.props.wms.layers.map((layer, idx) => {
            this.props.wms.layers[idx].checked = is_display_layers
        })
        this.setState({ is_display_layers })
    }

    render() {
        const { tiles, name, layers, is_display, is_display_layers } = this.state
        return (
            <Fragment>
                <div className="mt-1">
                    <div className="d-flex">
                        <div
                            className="my-auto mt-1"
                            onClick={() => this.setDisplay()}
                        >
                            <i
                                className={`fa fa-${is_display ? "minus" : "plus"} fa-sm gp-font-plus my-auto`}
                                aria-hidden="true"
                            >
                            </i>
                            <label className="mb-1 font-weight-bold" htmlFor="">{name}</label>
                        </div>
                        {
                            is_display
                            ?
                                <Fragment>
                                    <div
                                        className="ml-2 my-auto"
                                        onClick={() => this.setDisplayLayers()}
                                    >
                                        <i
                                            className={`fa fa-eye${is_display_layers ? "" : "-slash"}`}
                                            aria-hidden="true"
                                        >
                                        </i>
                                    </div>
                                </Fragment>
                            :
                                null
                        }
                    </div>
                </div>
                {
                    is_display
                    ?
                        <WMSLayerItems
                            name={name}
                            layers={layers}
                            addLayer={this.props.addLayer}
                            tileWMS={tiles}
                            is_display_layers={is_display_layers}
                            setIsDisplayLayers={(is_display_layers) => this.setIsDisplayLayers(is_display_layers)}
                        />
                    :
                        null
                }
            </Fragment>
        )
    }
}
