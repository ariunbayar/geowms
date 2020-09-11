import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../service'
import {ShopCart} from './ShopCart'
import { toStringHDMS } from "ol/coordinate"

class ModalComponent extends Component{

    constructor(props) {

        super(props)

        this.state = {
            price: 3000,
            description: 'Газрын бүрхэвч, газар ашиглалт',
            payload: false,
            data_id: 2,
            is_button: this.props.is_button
        }
    }

    componentDidUpdate(pP){
        const {content, is_button} = this.props
        if(pP.content !== content){
            if(content !== null){
                if(content.length >= 1){
                    this.setState({is_button: !is_button})
                }
            }
        }
    }

    handlePayment(){
        this.setState({payload: true})
        const {price, description, data_id} = this.state
        service.payment(price, description, data_id).then(({ payment_id }) => {
            if(payment_id){
                setTimeout(() => {
                    this.props.history.push(`/payment/purchase/${payment_id}/`);
                }, 1000)
            }
        })
    }

    render() {
        const { content, is_complete } = this.props
        const { payload, is_button } = this.state
        return (
            <div className="modal-dialog modal-dialog-scrollable trans" style={{zIndex:"101"}}>
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
                            </div>
                        )}
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-8 col-sm-6 d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-lg gp-btn-primary"
                                    onClick={this.props.handlePointToCart}
                                    disabled = {is_button}
                                >
                                    <i className="fa fa-shopping-cart"></i>
                                    Сагсанд нэмэх
                                </button>
                                </div>
                                <div className="col-4 col-sm-6 d-flex justify-content-center">
                                {payload ?
                                    <button type="button"
                                        className="btn btn-lg btn-secondary"
                                        data-dismiss="modal"
                                    >
                                        Ачааллаж байна...
                                        <a class="spinner-border text-light" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </a>
                                    </button>
                                    :
                                    <button
                                        type="button"
                                        onClick={() => this.handlePayment()}
                                        className="btn btn-secondary"
                                        data-dismiss="modal"
                                    >
                                        Худалдаж авах
                                    </button>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <button type="button"
                            className="btn btn-primary invisible"
                            onClick={this.props.handleClose}
                        >
                            Буцах
                        </button>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
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

        this.comp = {
            cart: new ShopCart()
        }
        this.is_component_initialized = false

        this.element.className = 'modal fade show'

        this.renderComponent = this.renderComponent.bind(this)
        this.toggleControl = this.toggleControl.bind(this)

    }

    toggleControl(is_visible) {
        this.element.classList.toggle('d-block', is_visible)
    }

    handlePointToCart(func){
        func(true)
        this.toggleControl(false)
    }

    renderComponent(props) {
        props.handleClose = () => this.toggleControl(false)
        props.handlePointToCart =() => this.handlePointToCart(props.func)
        props.is_button = true
        if (!this.is_component_initialized) {
            ReactDOM.render(<ModalComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ModalComponent {...props}/>, this.element)
    }

    showModal(content, is_complete, func) {
        this.toggleControl(true)
        this.renderComponent({content, is_complete, func})
    }

}

