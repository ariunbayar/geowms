import React, { Component } from "react"

export default class Attributes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            prop_arrow: false
        }
    }

    render() {
        const { prop_arrow } = this.state
        const { wms_index, layer, layers, idx } = this.props
        return (
            <div key={idx} id={`collapse-${wms_index}`} className="ml-5 collapse col-md-8" data-parent="#accordion1">
                <label>
                    <input type="checkbox"
                        value={layer.id}
                        onChange={this.props.handleLayerToggle}
                        checked={layers.indexOf(layer.id) > -1}
                    />
                    {} {layer.title} ({layer.code})
                </label>
                {
                    layer.properties.length > 0
                    &&
                        layers.indexOf(layer.id) > -1
                        &&
                            <div className="d-block col-md-12 text-primary">
                                <label
                                    className="col-md-6 text-primary"
                                >
                                    Талбарууд
                                </label>
                                <i
                                    className={'col-md-4 fa-lg fa fa-angle-double-' + (prop_arrow ? 'down': 'left')}
                                    onClick={() => this.setState({ prop_arrow: ! prop_arrow })}
                                    >
                                </i>
                                {
                                    prop_arrow
                                    &&
                                        layer.properties.map((prop, idy) =>
                                            <div
                                                key={idy}
                                                className="ml-4 pl-2"
                                            >
                                                <label>
                                                    <input type="checkbox"
                                                        value={prop.prop_code}
                                                        name={layer.id}
                                                        onChange={this.props.handlePropCheck}
                                                        checked={this.props.handleCheck(layer.id, prop.prop_code)}
                                                    />
                                                    {} {prop.prop_name} ({prop.prop_eng})
                                                </label>
                                            </div>
                                        )
                                }
                            </div>
                }
            </div>
        )
    }

}
