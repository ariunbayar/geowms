import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'


class ModalComponent extends Component{

    render() {
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header" onClick={this.props.handleClose}>
                        <h5 className="modal-title">Дэлгэрэнгүй мэдээлэл</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>
                            {this.props.content}
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={this.props.handleClose} className="btn btn-secondary" data-dismiss="modal">Буцах</button>
                    </div>
                </div>
            </div>
        )
    }
}

export class Modal extends Control {

    constructor(opt_options) {

      const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })

        this.is_component_initialized = false

        this.element.className = 'modal-body fade show'

        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)

    }

    toggleControl(is_visible) {
        this.element.classList.toggle('d-none', !is_visible)
    }

    renderComponent(props) {

        props.handleClose = () => this.toggleControl(false)

        if (!this.is_component_initialized) {
            ReactDOM.render(<ModalComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ModalComponent {...props}/>, this.element)
    }

    showModal(content) {
        this.toggleControl(true)
        this.renderComponent({content})
    }

}

