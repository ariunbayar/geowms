import React, { Component, Fragment } from "react"


export default class WMSLayerItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.layer.name,
            code: props.layer.code,
            tile: props.layer.tile,
            is_visible: props.is_visible,
            legendURL: props.layer.legendURL,
        }

        this.toggle = this.toggle.bind(this)
    }

    componentDidMount(){
        this.state.tile.setVisible(this.props.is_visible)
    }

    componentDidUpdate(pP){
        if (pP.is_visible !== this.props.is_visible){
            this.setState({ is_visible: this.props.is_visible })
        }
    }

    toggle(is_visible) {
        if (this.props.is_visible && is_visible){
            this.state.tile.setVisible(is_visible)
        }
        if (!this.props.is_visible && is_visible) {
            this.state.tile.setVisible(is_visible)
            this.props.toggle(is_visible)
        }
        if (!is_visible) {
            this.state.tile.setVisible(is_visible)
        }
        this.setState({is_visible})
    }

    render() {

        const { name, code, is_visible, legendURL } = this.state
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
                {legendURL != "null" &&
                    <ul>
                        <li>
                            <img className="img" src={legendURL}/>
                        </li>
                    </ul>
                }
            </li>
        )
    }
}
