import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'


class ModalComponent extends Component{

    render() {
        const {content, is_complete} = this.props
        return (
            <div className="modal-dialog modal-dialog-scrollable" style={{zIndex:"5"}}>
                <div className="modal-content">
                    <div className="modal-header" onClick={this.props.handleClose}>
                        <h5 className="modal-title">Дэлгэрэнгүй мэдээлэл</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {!is_complete &&
                            <div className="d-flex align-items-center">
                                <strong>Түр хүлээнэ үү...</strong>
                                <div className="spinner-border ml-auto" role="status" aria-hidden="true"></div>
                            </div>
                        }
                        {is_complete && content.map(([layer_name, values], idx) =>
                            <div key={idx}>
                                <h6>{layer_name}</h6>
                                <table className="table">
                                    <tbody>
                                        {values.map(([field, value], val_idx) =>
                                            <tr key={val_idx}>
                                                <th>{field}</th>
                                                <td>{value}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={this.props.handleClose} className="btn btn-secondary" data-dismiss="modal">Буцах</button>
                        <a className="btn btn-secondary" data-dismiss="modal" href="/payment/purchase/">Худалдаж авах</a>

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

        this.element.className = 'modal fade show'

        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)

    }

    toggleControl(is_visible) {
        this.element.classList.toggle('d-block', is_visible)
    }

    renderComponent(props) {

        props.handleClose = () => this.toggleControl(false)

        if (!this.is_component_initialized) {
            ReactDOM.render(<ModalComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ModalComponent {...props}/>, this.element)
    }

    showModal(content, is_complete) {
        this.toggleControl(true)
        this.renderComponent({content, is_complete})
    }

}

