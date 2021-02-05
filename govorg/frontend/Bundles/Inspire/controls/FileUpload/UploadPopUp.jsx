import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import Loader from '@utils/Loader'
import {Upload} from './Upload'

class UploadCmp extends Component {

    constructor(props) {

        super(props)

        this.state = {
            is_closed: false,
            is_loading: false,
        }
        this.closeModal = this.closeModal.bind(this)
        this.setLoading = this.setLoading.bind(this)
    }

    setLoading(is_true) {
        this.setState({ is_loading: is_true })
    }

    closeModal() {
        this.setState({ is_closed: !this.state.is_closed })
    }

    render() {
        const { is_closed, is_loading } = this.state
        return (
            <div className="modal-dialog modal-dialog-centered">
                <div role="document" style={{zIndex: 1050}}>
                    <div className="modal-content animated slideInLeft">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Файлаа оруулна уу.</h5>
                            <button type="button" className="animated close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Loader is_loading={is_loading} />
                            <Upload
                                setLoading={this.setLoading}
                                is_closed={is_closed}
                                fid={this.props.fid}
                                pid={this.props.pid}
                                tid={this.props.tid}
                                func={this.props.func}
                                refreshRequestCount={this.props.refreshRequestCount}
                                notif={this.props.notif}
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
            ReactDOM.render(<UploadCmp {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<UploadCmp {...props}/>, this.element)
    }

    showUpload(islaod, fid, func, refreshRequestCount, notif, tid, pid) {
        this.toggleControl(islaod)
        this.renderComponent({fid, func, refreshRequestCount, notif, tid, pid})
    }

}
