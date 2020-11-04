import React, { Component, Fragment } from "react"

import WMSItem from './WMS/WMSItem'
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'


class SidebarComponent extends Component {

    constructor(props) {

        super(props)

        this.state = {
        }
    }

    render() {
        return (
            <div>
                <span>Давхаргууд</span>
                <hr></hr>
                {this.props.map_wms_list.map((wms, idx) =>
                    <WMSItem wms={wms} key={idx}/>
                )}
            </div>
        )
    }
}

export class Sidebar extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = `col-md-2 ⚙ rounded bg-light`

        this.element.className = cssClasses
        this.element.style.display = 'none'
        this.element.style.height = 'auto'
        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
    }

    toggleControl(is_visible) {
        if (is_visible) {
            this.element.style.display = 'none'
        }
        else {
            this.element.style.display = 'block'
        }

    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<SidebarComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<SidebarComponent {...props}/>, this.element)
    }

    showSideBar(map_wms_list, islaod) {
        this.toggleControl(islaod)
        this.renderComponent({map_wms_list})
    }

}
