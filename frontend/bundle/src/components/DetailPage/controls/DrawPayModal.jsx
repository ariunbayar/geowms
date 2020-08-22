import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../service'

class ModalComponent extends Component{

    constructor(props) {

        super(props)

        this.state = {
            price: 3000,
            description: 'Газрын бүрхэвч, газар ашиглалт',
            payLoad: false,
        }

    }

    handlePayment(){

        this.setState({payLoad: true})
        const {price, description} = this.state
        const {coodrinatLeftTop, coodrinatRightBottom} = this.props
        service.paymentDraw(price, description, coodrinatLeftTop, coodrinatRightBottom).then(({ payment_id }) => {
            if(payment_id){
                this.setState({payLoad: false})
                alert(payment_id)

                this.props.history.push("/");
                alert(payment_id)
            }
        })
    }

    render() {
        const {payLoad} = this.state
        const { coodrinatLeftTop, coodrinatRightBottom, coodrinatRightTop, coodrinatLeftBottom} = this.props
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
                        <div className="row">{coodrinatLeftTop}</div>
                        <div className="row">{coodrinatRightBottom}</div>
                        <div className="row">{coodrinatRightTop}</div>
                        <div className="row">{coodrinatLeftBottom}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={this.props.handleClose} className="btn btn-secondary" data-dismiss="modal">Буцах</button>
                        <button type="button" onClick={() => this.handlePayment()} className="btn btn-secondary" data-dismiss="modal">Худалдаж авах</button>
                    </div>
                </div>
            </div>
        )
    }
}

export class DrawPayModal extends Control {

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

    showModal(content, coodrinatLeftTop, coodrinatRightBottom, coodrinatRightTop,coodrinatLeftBottom) {
        this.toggleControl(true)
        this.renderComponent({content, coodrinatLeftTop, coodrinatRightBottom, coodrinatRightTop, coodrinatLeftBottom})
    }

}

