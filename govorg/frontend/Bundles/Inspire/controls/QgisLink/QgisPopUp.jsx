import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class QgisCmp extends Component {

    constructor(props) {

        super(props)

        this.state = {
        }
        this.copyToClipboard = this.copyToClipboard.bind(this)
    }

    copyToClipboard(url){
        var textField = document.createElement('textarea')
        textField.innerText = url
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        this.props.addNotif('success', 'Амжилттай хуулаа', 'times')
    }

    render() {
        return (
            <div className="modal-dialog modal-dialog-centered">
                <div role="document" style={{zIndex: 1050}}>
                    <div className="modal-content animated slideInLeft">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">QGIS Дээр засвар хийх линк.</h5>
                            <button type="button" className="animated close" data-dismiss="modal" aria-label="Close" onClick={()=> this.props.func()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5>WFS</h5>
                                    <div className="input-group">
                                        <input type="text" className="form-control col-12" disabled value={this.props.wfs_url}/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.props.wfs_url)}>
                                            <i className="fa fa-clone" aria-hidden="true"></i>
                                        </button>
                                        </span>
                                    </div>
                                    <h5 className="mt-3">WMS</h5>
                                    <div className="input-group">
                                        <input type="text" className="form-control col-12" disabled value={this.props.wms_url}/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.props.wms_url)}>
                                            <i className="fa fa-clone" aria-hidden="true"></i>
                                        </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show" style={{zIndex: 1040}}></div>
            </div>
        )
    }
}

export class QgisModal extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = ` modal col-md-12`
        this.element.className = cssClasses
        this.element.setAttribute('id', '#exampleModalCenter')
        this.element.setAttribute('tabindex', '-1')
        this.element.setAttribute('role', 'dialog')
        this.element.setAttribute('aria-labelledby', 'staticBackdropLabel')
        this.element.setAttribute('aria-backdrop', 'static')
        this.element.setAttribute('aria-hidden', 'true')

        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)
    }

    toggleControl(is_visible) {
        if (is_visible) {
            this.element.classList.add('fade')
            this.element.classList.add('show')
            this.element.classList.add('d-block')
            this.element.style.zIndex = '1050'
        }
        else {
            this.element.setAttribute("class", "modal d-none")
        }

    }

    renderComponent(props) {
        if (!this.is_component_initialized) {
            ReactDOM.render(<QgisCmp {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<QgisCmp {...props}/>, this.element)
    }

    showUpload(islaod, func, addNotif, wfs_url, wms_url) {
        this.toggleControl(islaod)
        this.renderComponent({func, addNotif, wfs_url, wms_url})
    }

}
