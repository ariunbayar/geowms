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

        this.handlePayment = this.handlePayment.bind(this)

    }

    handlePayment(){

        this.setState({payLoad: true})

        const {price, description} = this.state
        const {coodrinatLeftTop, coodrinatRightBottom, layer_info: { bundle, wms_list }} = this.props

        const values = {
            price,
            description,
            coodrinatLeftTop,
            coodrinatRightBottom,
            bundle_id: bundle.id,
            layer_ids: wms_list.reduce((acc, { layers }) => {
                return [...acc, ...layers.map((layer) => layer.id)]
            }, []),
        }

        service.paymentDraw(values).then(({ success, payment_id }) => {
            if (success) {
                window.location.href = `/payment/purchase/${payment_id}/`;
            }
        })

    }

    render() {
        const {payLoad} = this.state
        const { coodrinatLeftTop, coodrinatRightBottom, layer_info } = this.props

        return (
            <div>
                <div className="show d-block modal modal-dialog modal-dialog-scrollable ">
                    <div className="modal-content">
                        <div className="modal-header" onClick={this.props.handleClose}>
                            <h5 className="modal-title">Дэлгэрэнгүй мэдээлэл</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
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
                                <div className="row"><code>{coodrinatLeftTop[0]}</code>, <code>{coodrinatLeftTop[1]}</code></div>
                                <div className="row"><code>{coodrinatRightBottom[0]}</code>, <code>{coodrinatRightBottom[1]}</code></div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={this.props.handleClose} className="btn btn-secondary">Буцах</button>
                            <button type="button" onClick={this.handlePayment} className="btn btn-secondary">Худалдаж авах</button>
                        </div>
                    </div>
                </div>
                <div className='modal-backdrop fade show'></div>
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

    showModal(coodrinatLeftTop, coodrinatRightBottom, layer_info) {
        this.toggleControl(true)
        this.renderComponent({coodrinatLeftTop, coodrinatRightBottom, layer_info})
    }

}

