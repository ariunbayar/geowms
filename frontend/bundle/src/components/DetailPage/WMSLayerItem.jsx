import React, { Component, Fragment } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            is_visible: props.layer.defaultCheck,
        }

        this.toggle = this.toggle.bind(this)
    }

    toggle(is_visible) {
        if(is_visible)
        {
            this.setState({is_visible: 1})
        }
        else
        {
            this.setState({is_visible:0})
        }
        this.props.handleToggle(is_visible)
    }

    render() {

        const { name, code, is_visible } = this.state
        return (
            <li>
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => this.toggle(e.target.checked)}
                        checked={is_visible > 0 ? true : false}
                    />
                    <a> {name}</a>
                </label>
            </li>
        )
    }
}
