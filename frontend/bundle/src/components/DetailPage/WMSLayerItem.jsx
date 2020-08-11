import React, { Component, Fragment } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            tile: props.layer.tile,
            is_visible: props.layer.defaultCheck,
            legendURL: props.layer.legendURL,
        }

        this.toggle = this.toggle.bind(this)
    }
    componentDidMount(){
        this.state.tile.setVisible(this.props.layer.defaultCheck)
    }
    toggle(is_visible) {
        this.state.tile.setVisible(is_visible)
        this.setState({is_visible})
    }

    render() {

        const { name, code, is_visible, legendURL } = this.state
        return (
            <li>
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => this.toggle(e.target.checked)}
                        checked={is_visible}
                    />
                    <a> {name}</a>
                </label>
                <ul>
                    <li>
                        <img className="img" src={legendURL}/>
                    </li>
                </ul>
            </li>
        )
    }
}
