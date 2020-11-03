import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {CLASS_CONTROL, CLASS_HIDDEN} from 'ol/css.js'
import {Upload} from './Upload'

class UploadCmp extends Component {

    constructor(props) {

        super(props)

        this.state = {
        }
    }

    render() {
        console.log(this.props)
        return (
            <div className="modal-dialog modal-dialog-centered">
                <div role="document" style={{zIndex: 1050}}>
                    <div className="modal-content animated">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Файлаа оруулна уу.</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=> this.props.func()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Upload
                                fid={this.props.fid}
                                func={this.props.func}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show" style={{zIndex: 1040}}></div>
            </div>
        )
    }
}

export class UploadBtn extends Control {

    constructor(opt_options) {

        const options = opt_options || {}

        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false
        const cssClasses = ` modal `
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
            console.log("dadedfea")
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
            ReactDOM.render(<UploadCmp {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<UploadCmp {...props}/>, this.element)
    }

    showUpload(islaod, fid, func) {
        this.toggleControl(islaod)
        this.renderComponent({fid, func})
    }

}