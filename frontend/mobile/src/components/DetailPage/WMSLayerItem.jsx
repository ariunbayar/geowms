import React, { Component, Fragment } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            is_visible: false,
        }

        this.toggle = this.toggle.bind(this)
    }

    toggle(is_visible) {
        this.setState({is_visible})
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
                        checked={is_visible}
                    />
                    {name}
                </label>
            </li>
        )
    }
}
