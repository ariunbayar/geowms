import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class CoordInputs extends Component{
    constructor(props){
        super(props)
        this.state = {
            coord: '',
        }
    }

    handleChange(e) {
        this.setState({ coord: e.target.value })
    }

    componentDidMount() {
        const { coord } = this.props
        this.setState({ coord })
    }

    render() {
        const { coord } = this.state
        const { idx, ix } = this.props
        return (
            <div>
                <input key={idx} className="form-control m-1" type="number" value={coord} onChange={(e) => this.handleChange(e)}/>
            </div>
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
            <div className="overflow-group overflow-auto">
                <div className="custom-control custom-switch">
                    <input type="radio" className="custom-control-input" id="customSwitch1" name="type" defaultChecked/>
                    <label className="custom-control-label" htmlFor="customSwitch1">Муухай</label>
                </div>
                <div className="custom-control custom-switch">
                    <input type="radio" className="custom-control-input" name="type" id="customSwitch2"/>
                    <label className="custom-control-label" htmlFor="customSwitch2">Гоё</label>
                </div>
                {coords_list.map((coord_list, ix) =>
                    <a key={ix} className="list-group-item">
                        {coord_list.map((coord, idx) =>
                            <CoordInputs key={idx}
                                coord={coord}
                                idx={idx}
                                ix={ix}
                            />
                        )}
                    </a>
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
