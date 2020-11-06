import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class CoordInputs extends Component{
    constructor(props){
        super(props)
        this.state = {
            coordinate: '',
        }
    }

    handleChange(e) {
        this.setState({ coordinate: e.target.value })
    }

    render() {
        const { coords } = this.props
        return (
            <Fragment>
                {coords.map((coord, idx) =>
                    <input key={idx} className="form-control m-1" type="number" value={coord} onChange={(e) => this.handleChange(e)}/>
                )}
            </Fragment>
        )
    }
}

class ListComponent extends Component {

    constructor(props) {

        super(props)

        this.state = {
        }
    }

    render() {
        const { coords_list } = this.props
        return (
            <div className="overflow-auto">
                <div className="custom-control custom-switch">
                    <input type="radio" className="custom-control-input" id="customSwitch1" name="type" defaultChecked/>
                    <label className="custom-control-label" htmlFor="customSwitch1">Муухай</label>
                </div>
                <div className="custom-control custom-switch">
                    <input type="radio" className="custom-control-input" name="type" id="customSwitch2"/>
                    <label className="custom-control-label" htmlFor="customSwitch2">Гоё</label>
                </div>
                {coords_list.map((coord_list, i) =>
                    coord_list.map((coords, ix) =>
                        <a key={ix} className="list-group-item">
                            <CoordInputs
                                coords={coords}
                            />
                        </a>
                    )
                )}
            </div>
        )
    }
}

export class CoordList extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = `list-group col-md-5 rounded bg-light overflow-auto `

        this.element.className = cssClasses
        this.element.style.display = 'none'
        this.element.style.height = 'auto'
        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
    }

    toggleControl(is_visible) {
        if (is_visible) {
            this.element.style.display = 'block'
        }
        else {
            this.element.style.display = 'none'
        }

    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<ListComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ListComponent {...props}/>, this.element)
    }

    showList(islaod, coords_list) {
        this.toggleControl(islaod)
        this.renderComponent({coords_list})
    }

}
