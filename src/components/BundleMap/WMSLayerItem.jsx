import React, { Component, Fragment } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            tile: props.layer.tile,
            wms_tile: props.layer.wms_tile,
            wms_or_cache_ur: props.layer.wms_or_cache_ur,
            is_visible: props.layer.defaultCheck,
            legend: props.layer.legend,
            is_change_color: props.layer.is_change_color,
            color: props.layer.color,

        }

        this.toggle = this.toggle.bind(this)
    }

    componentDidMount() {
        if(this.state.wms_or_cache_ur)
        {
            this.state.tile.setVisible(this.props.layer.defaultCheck)
        }else
        {
            this.state.wms_tile.setVisible(this.props.layer.defaultCheck)
        }
    }

    toggle(is_visible) {
        this.props.addLayer([this.props.layer], this.props.name, is_visible)
        this.setState({is_visible})
    }

    render() {

        const { name, code, is_visible, legend, is_change_color, color } = this.state
        return (
            <li>
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
                <ul>
                    <li>
                        {
                            legend
                            ?
                                <img className="img" src={legend}/>
                            :
                                is_change_color
                                &&
                                    <input type="color" value={color} disabled/>
                        }

                    </li>
                </ul>
            </li>
        )
    }
}
