import React, { Component, Fragment } from "react"

import {helpers} from '../../helpers'
import WMSItem from './WMSItem'
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'


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
        const cssClasses = `col-md-2 ⚙ rounded bg-light ${CLASS_HIDDEN}`

        this.element.className = cssClasses
        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
    }

    toggleControl(is_visible) {
        this.element.classList.toggle(CLASS_HIDDEN, is_visible)

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
