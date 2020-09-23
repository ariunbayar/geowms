import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../service'
import {ShopCart} from './ShopCart'
import { toStringHDMS } from "ol/coordinate"
import { NavLink } from "react-router-dom";

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

    componentDidMount(){
        const { content, is_button } = this.props
        if(content){
            this.setState({ is_button: !is_button})
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
        const { content, is_complete, feature_price, geodb_export_field, geodb_pk_field, geodb_schema, geodb_table } = this.props
        const { payload, is_button } = this.state
        return (
            <div>
                <div className="show d-block modal modal-dialog modal-dialog-scrollable ">
                    <div className="modal-content">
                            <button type="button" className="close border" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        <div className="modal-body">
                            {!is_complete &&
                                <div className="d-flex align-items-center">
                                    <strong>Түр хүлээнэ үү...</strong>
                                    <div className="spinner-border ml-auto" role="status" aria-hidden="true"></div>
                                </div>
                            }
                            {is_complete && content.map(([layer_name, values], idx) =>
                                <div key={idx}>
                                    <h6 className="text-center">Цэгийн мэдээлэл</h6>
                                    <table className="table">
                                        <tbody>
                                            {values.map(([field, value], val_idx) =>
                                                field == 'point_id' ?
                                                <tr key={val_idx}>
                                                    <th>Цэгийн дугаар:</th>
                                                    <td>{value}</td>
                                                </tr>: field == 'point_name' ?
                                                <tr key={val_idx}>
                                                    <th>Цэгийн Нэр:</th>
                                                    <td>{value}</td>
                                                </tr>: field == 'id' ?
                                                <tr key={val_idx}>
                                                    <th>Цэгийн дахин давтагдашгүй дугаар:</th>
                                                    <td>{value}</td>
                                                </tr>: field == 'point_class_name' ?
                                                <tr key={val_idx}>
                                                    <th>Сүлжээний төрөл:</th>
                                                    <td>{value}</td>
                                                </tr>: null
                                            )}
                                            {values.map(([field, value], val_idx) =>
                                                field == 'aimag' ?
                                                <tr key={val_idx}>
                                                    <th>Аймаг:</th>
                                                    <td>{value}</td>
                                                </tr>: field == 'sum' ?
                                                <tr key={val_idx}>
                                                    <th>Сум:</th>
                                                    <td>{value}</td>
                                                </tr>: field == 'mclass' ?
                                                <tr key={val_idx}>
                                                    <th>Сүлжээний зэрэг:</th>
                                                    <td>{value}</td>
                                                </tr>: null
                                            )}
                                            <tr>
                                                <th>Трапецийн дугаар(1:100000)</th>
                                                <td>
                                                    {values.map(([field, value], val_idx) =>
                                                        field == 'sheet1' ?
                                                            <a key={val_idx}>
                                                                {value}-
                                                            </a>
                                                        : field == 'sheet2' ?
                                                        <a key={val_idx}>
                                                            {parseInt(value)}-
                                                        </a>:field == 'sheet3' ?
                                                            <a key={val_idx}>
                                                                {parseInt(value)}
                                                        </a>: null
                                                    )}
                                                </td>
                                            </tr>
                                            <tr key="price">
                                                <th>Үнэ</th>
                                                <td>{feature_price}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="row">
                            <div className="col-sm-12 mb-4">
                                <div className="row">
                                    <div className="col-8 col-sm-6 d-flex justify-content-center">
                                        <button
                                            type="button"
                                            className="btn btn-lg gp-btn-primary"
                                            onClick={this.props.handlePointToCart}
                                            disabled = {is_button}
                                        >
                                            <i className="fa fa-shopping-cart"></i>
                                            &nbsp; Сагсанд нэмэх
                                        </button>
                                    </div>
                                    <div className="col-sm-6 float-right">
                                        <a href="/profile/tseg-personal/tseg-info/tseg-personal/" className="btn btn-lg gp-btn-primary ml-3"><i className="fa fa-location-arrow mr-2"></i>Цэг нэмэх</a>
                                    </div>
                                    <div className="col-4 col-sm-6 d-flex justify-content-center">
                                    {payload ?
                                        <button type="button"
                                            className="btn btn-lg btn-secondary"
                                            data-dismiss="modal"
                                        >
                                            Ачааллаж байна...
                                            <a className="spinner-border text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </a>
                                        </button>
                                        : null
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='modal-backdrop fade show'></div>
            </div>
        )
    }
}

export class ShopModal extends Control {

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

    handlePointToCart(func, content, code){
        func(true, content, code)
        this.toggleControl(false)
    }

    renderComponent(props) {
        props.handleClose = () => this.toggleControl(false)
        props.handlePointToCart =() => this.handlePointToCart(props.func, props.content, props.code)
        props.is_button = true
        if (!this.is_component_initialized) {
            ReactDOM.render(<ModalComponent {...props}/>, this.element)
            this.is_component_initialized = true
        }

        ReactDOM.hydrate(<ModalComponent {...props}/>, this.element)
    }

    showModal(feature_price,geodb_export_field, geodb_pk_field, geodb_schema, geodb_table, code,content, is_complete, func) {
        this.toggleControl(true)
        this.renderComponent({feature_price,geodb_export_field, geodb_pk_field, geodb_schema, geodb_table,code, content, is_complete, func})
    }

}

