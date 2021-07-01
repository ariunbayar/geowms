import React, { Component } from "react"

export default class Attributes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_open: false
        }
    }

    handleChecked(e) {
        const checked = e.target.checked
        this.setState({ is_open: checked })
    }

    render() {
        const { layer, idx } = this.props
        const { is_open } = this.state
        return (
            <>
                <div className="custom-control custom-switch my-3">
                    <input type="checkbox" className="custom-control-input" id={`switch_atts-${layer.code}-${idx}`} checked={is_open} onChange={(e) => this.handleChecked(e)}/>
                    <label className="custom-control-label" htmlFor={`switch_atts-${layer.code}-${idx}`}>Талбаруудыг {is_open ? 'хураах' : 'харах'} ({layer.attributes.length})</label>
                </div>
                {
                    is_open
                    ?
                        <ul key={idx} id={`collapse-${idx}`} className="collapsed" data-parent="#accordion1">
                            {
                                layer.attributes.map((property, index) =>
                                    <li key={index}>
                                        <label htmlFor={`active-delete-${layer.code}-${index}`}> {} {property.name} <small>({property.code})</small></label>
                                    </li>
                                )
                            }
                        </ul>
                    :
                        null
                }
            </>
        )
    }

}