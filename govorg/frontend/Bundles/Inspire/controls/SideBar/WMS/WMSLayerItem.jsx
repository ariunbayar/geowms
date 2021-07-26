import React, { Component, Fragment } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            tile: props.layer.tile,
            is_visible: false,
            legend: props.layer.legend,
            z_idx: 0,
        }

        this.toggle = this.toggle.bind(this)
    }

    toggle(is_visible) {
        var { z_index, tile } = this.state
        tile.setVisible(is_visible)
        z_index = z_index + 1
        tile.setZIndex(z_index)
        this.setState({is_visible, z_index})
    }

    render() {

        const { name, code, is_visible, legend } = this.state
        return (
            <div className="col-12">
                <label>
                    <div className="custom-control custom-switch">
                        <input
                        type="checkbox" className="custom-control-input" id={code}
                        onChange={(e) => this.toggle(e.target.checked)}
                        checked={is_visible}
                    />
                    <label className="custom-control-label" htmlFor={code}>{name}</label>
                    </div>
                </label>
                <div className="ml-5">
                    <img className="img" src={legend}/>
                </div>
            </div>
        )
    }
}
