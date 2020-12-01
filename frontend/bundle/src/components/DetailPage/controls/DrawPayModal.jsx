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
            user_name: '',
            user_email: '',
            user_number: '',
        }

        this.handlePayment = this.handlePayment.bind(this)

    }

    handlePayment(){

        this.setState({payLoad: true})

        const {description, user_name, user_email, user_number} = this.state
        const {coodrinatLeftTop, coodrinatRightBottom, layer_info: { bundle, wms_list }, area, total_price} = this.props

        const values = {
            price: total_price,
            description,
            coodrinatLeftTop,
            coodrinatRightBottom,
            bundle_id: bundle.id,
            layer_ids: wms_list.reduce((acc, { layers }) => {
                return [...acc, ...layers.map((layer) => layer.id)]
            }, []),
            area: area.output,
            area_type: area.type,
            user_name,
            user_email,
            user_number
        }

        service.paymentDraw(values).then(({ success, payment_id }) => {
            if (success) {
                window.location.href = `/payment/purchase/polygon/${payment_id}/`;
            }
        })

    }

    render() {
        const {payLoad, user_name, user_email, user_number} = this.state
        const { coodrinatLeftTop, coodrinatRightBottom, layer_info, is_loading, area, total_price, is_user } = this.props

        return (
            <div>
                <div className="show d-block modal bd-example-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header" onClick={this.props.handleClose}>
                                <h5 className="modal-title">Худалдан авалтын мэдээлэл</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        {
                            is_loading ?
                            <div className="modal-body height-30">
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border gp-text-primary" role="status"></div>
                                </div>
                            </div>
                            :
                            <div className="modal-body">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="recipient-name" className="col-form-label">Худалдан авах талбайн хэмжээ:</label>
                                                <span className="form-control" id="size">{area.output}{area.type}<sup>2</sup></span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="recipient-name" className="col-form-label">Худалдан авах мөнгөн дүн:</label>
                                                <span className="form-control" id="price">{total_price}₮</span>
                                            </div>
                                            {
                                                !is_user &&
                                                <div>
                                                    <div className="form-group">
                                                        <label htmlFor="user_name" className="col-form-label">Хэрэглэгчийн нэр:</label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id="user_name"
                                                            value={user_name}
                                                            onChange={(e) => this.setState({ user_name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="user_number" className="col-form-label">Хэрэглэгчийн утас:</label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id="user_number"
                                                            value={user_number}
                                                            onChange={(e) => this.setState({ user_number: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="user_email" className="col-form-label">Хэрэглэгчийн имэйл:</label>
                                                        <input type="text"
                                                            className="form-control"
                                                            id="user_email"
                                                            value={user_email}
                                                            onChange={(e) => this.setState({ user_email: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <ul>
                                                {layer_info.wms_list.map(({ name, layers }, idx) =>
                                                    <li key={ idx }>{ name }
                                                        <ul>
                                                            {layers.map(({ name }, idx) =>
                                                                <li key={ idx }>{ name }</li>
                                                            )}
                                                        </ul>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {/* <div className="row"><code>{coodrinatLeftTop[0]}</code>, <code>{coodrinatLeftTop[1]}</code></div>
                                    <div className="row"><code>{coodrinatRightBottom[0]}</code>, <code>{coodrinatRightBottom[1]}</code></div> */}
                                </div>
                            </div>
                        }
                        <div className="modal-footer">
                            <button type="button" onClick={this.props.handleClose} className="btn btn-secondary">Буцах</button>
                            {
                                !is_loading &&
                                <button type="button" onClick={this.handlePayment} className="btn gp-btn-primary">Худалдаж авах</button>
                            }
                        </div>
                        </div>
                    </div>
                </div><div className='modal-backdrop fade show'></div>
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

    showModal(is_loading, coodrinatLeftTop, coodrinatRightBottom, layer_info, area, total_price, is_user) {
        this.toggleControl(true)
        this.renderComponent({is_loading, coodrinatLeftTop, coodrinatRightBottom, layer_info, area, total_price, is_user})
    }

}
