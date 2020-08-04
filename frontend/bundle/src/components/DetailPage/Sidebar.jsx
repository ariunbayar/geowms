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
            coordinate: '',
        }

        this.handleSubmitCoordinate = this.handleSubmitCoordinate.bind(this)
    }

    handleSubmitCoordinate(event) {
        event.preventDefault()
        const coord = helpers.parseCoordinateString(this.state.coordinate)
        this.props.handleSetCenter(coord)
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <label className="font-weight-bold" htmlFor="formGroupInput">Нэрэлбэрээр хайх</label>
                    <div className="input-group mb-3">

                        <input type="text" className="form-control" placeholder="хайх утга" aria-label="" aria-describedby=""/>
                        <div className="input-group-append">
                            <button className="btn gp-outline-primary" type="button"><i className="fa fa-search mr-1" aria-hidden="true"></i>Хайх</button>
                        </div>
                    </div>
                </div>

                <form onSubmit={this.handleSubmitCoordinate}>
                    <div className="form-group">
                        <label className="font-weight-bold" htmlFor="formGroupInput">Байрлалаар хайх</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="өргөрөг, уртраг"
                                name="coordinate"
                                onChange={(e) => this.setState({coordinate: e.target.value}) }
                                value={this.state.coordinate}
                            />
                            <div className="input-group-append">
                                <button className="btn gp-outline-primary" type="submit"><i className="fa fa-search mr-1"></i>Хайх</button>
                            </div>
                        </div>
                    </div>
                </form>
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
        const cssClasses = `col-md-2 ⚙  ${CLASS_HIDDEN}`

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

    showSideBar(map_wms_list, handleSetCenter, islaod) {
        this.toggleControl(islaod)
        this.renderComponent({map_wms_list, handleSetCenter})
    }

}
