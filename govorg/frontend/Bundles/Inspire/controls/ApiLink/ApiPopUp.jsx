import React, { Component, Fragment } from "react"

import ReactDOM from 'react-dom'
import {Control} from 'ol/control'

class ApiCmp extends Component {

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
                            <h5 className="modal-title" id="exampleModalLongTitle">Inspire api link.</h5>
                            <button type="button" className="animated close" data-dismiss="modal" aria-label="Close" onClick={()=> this.props.func()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5>TOKEN AUTH</h5>
                                    <div className="input-group">
                                        <input type="text" className="form-control col-12" disabled value={this.props.token_auth}/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.props.token_auth)}>
                                            <i className="fa fa-clone" aria-hidden="true"></i>
                                        </button>
                                        </span>
                                    </div>
                                    <h5 className="mt-3">CREATE</h5>
                                    <div className="input-group">
                                        <input type="text" className="form-control col-12" disabled value={this.props.create}/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.props.create)}>
                                            <i className="fa fa-clone" aria-hidden="true"></i>
                                        </button>
                                        </span>
                                    </div>
                                    <h5 className="mt-3">UPDATE</h5>
                                    <div className="input-group">
                                        <input type="text" className="form-control col-12" disabled value={this.props.update}/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.props.update)}>
                                            <i className="fa fa-clone" aria-hidden="true"></i>
                                        </button>
                                        </span>
                                    </div>
                                    <h5 className="mt-3">REMOVE</h5>
                                    <div className="input-group">
                                        <input type="text" className="form-control col-12" disabled value={this.props.remove}/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.props.remove)}>
                                            <i className="fa fa-clone" aria-hidden="true"></i>
                                        </button>
                                        </span>
                                    </div>
                                    <h5 className="mt-3">SELECT</h5>
                                    <div className="input-group">
                                        <input type="text" className="form-control col-12" disabled value={this.props.select}/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.props.select)}>
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

export class ApiModal extends Control {

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
            ReactDOM.render(<ApiCmp {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ApiCmp {...props}/>, this.element)
    }

    showApi(islaod, func, addNotif, create, remove, update, select, token_auth) {
        this.toggleControl(islaod)
        this.renderComponent({func, addNotif, create: create, remove, update, select, token_auth})
    }

}
