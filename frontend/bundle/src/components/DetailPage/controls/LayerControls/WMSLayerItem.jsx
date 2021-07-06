import React, { Component } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            tile: props.layer.tile,
            wms_tile: props.layer.wms_tile,
            wms_or_cache_ur: props.layer.wms_or_cache_ur,
            is_visible: props.layer.checked,
            legend: props.layer.legend,
            is_legend_display: props.layer.is_legend_display,
        }
        this.toggle = this.toggle.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nP) {
        this.setState({
            name: nP.layer.name,
            code: nP.layer.code,
            tile: nP.layer.tile,
            wms_tile: nP.layer.wms_tile,
            wms_or_cache_ur: nP.layer.wms_or_cache_ur,
            is_visible: nP.layer.checked,
            legend: nP.layer.legend,
            is_legend_display: nP.layer.is_legend_display,
        })
    }

    toggle(is_visible) {
        this.props.layer.checked = is_visible
        this.props.addLayer([this.props.layer], this.props.name, is_visible)
        this.props.checkAllIsLayersDisplay(is_visible)
        this.setState({ is_visible })
    }

    setDisplayImage() {
        const is_legend_display = !this.state.is_legend_display
        this.props.layer.is_legend_display = is_legend_display
        this.setState({ is_legend_display })
    }

    render() {
        const { name, code, is_visible, legend, is_legend_display } = this.state
        return (
            <li>
                <div className="d-flex my-auto">
                    <div className="mr-2 my-auto">
                        <i
                            className={`fa fa-caret-${is_legend_display ? "down" : "right"}`}
                            aria-hidden="true"
                            onClick={() => this.setDisplayImage()}
                        >
                        </i>
                    </div>
                    <div className="my-auto d-flex">
                        <div className="mr-2 my-auto">
                            <input
                                type="checkbox"
                                className=""
                                id={code}
                                onChange={(e) => this.toggle(e.target.checked)}
                                checked={is_visible}
                            />
                        </div>
                        <label className="my-auto" htmlFor={code}>{name}</label>
                    </div>
                </div>
                {
                    is_legend_display
                    ?
                        <div className="pl-4">
                            <img className="img" src={legend}/>
                        </div>
                    :
                        null
                }
            </li>
        )
    }
}
