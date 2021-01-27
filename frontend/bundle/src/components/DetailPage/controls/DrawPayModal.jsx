import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {Control} from 'ol/control'
import {service} from '../service'

class ModalComponent extends Component{

    constructor(props) {

        super(props)

        this.state = {
            total_price: 0,
            description: 'Газрын бүрхэвч, газар ашиглалт',
            payLoad: false,
            user_name: '',
            user_email: '',
            user_number: '',
            handlePaymentIsLoad: false,
            types: ['shp', 'jpeg', 'png', 'tiff', 'pdf'],
            selected_type: '',
            is_authenticated: true,
        }

        this.handlePayment = this.handlePayment.bind(this)
        this.onChangeType = this.onChangeType.bind(this)
        this.closeModal = this.closeModal.bind(this)

    }

    onChangeType(e){
        const {area, layer_list, feature_info_list} = this.props
        const selected_type = e.target.value
        this.setState({ selected_type })
        service
            .paymentCalcPrice(area, layer_list, feature_info_list, selected_type)
            .then(({ success, total_price }) => {
                if (success) {
                    this.setState({ total_price })
                }
            })
        service.getUser().then(({ is_authenticated }) => {
                this.setState({ is_authenticated })
            })
    }

    closeModal(){
        this.setState({ total_price: 0, selected_type: '' })
        this.props.handleClose()
    }

    handlePayment(){

        this.setState({payLoad: true, handlePaymentIsLoad:true})

        const {description, user_name, user_email, user_number, selected_type, total_price} = this.state
        const {coodrinatLeftTop, coodrinatRightBottom, layer_info: { bundle, wms_list }, area, feature_info_list} = this.props

        const values = {
            price: total_price,
            // total_price: NULL,
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
            user_number,
            feature_info_list,
        }

        service.paymentDraw(values).then(({ success, payment_id }) => {
            if (success) {
                window.location.href = `/payment/purchase/polygon/${payment_id}/${selected_type}/`;
            }
        })

    }

    render() {
        const {user_name, user_email, user_number, types, total_price, is_authenticated} = this.state
        const { layer_info, is_loading, area } = this.props
        return (
            <div>
                <div className="show d-block modal bd-example-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header" onClick={() => this.closeModal()}>
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
                                                    <label htmlFor="recipient-name" className="col-form-label">Татаж авах төрөл:</label>
                                                    <select className="form-control" onChange={(e) => this.onChangeType(e)}  >
                                                        <option value="">--- Ямар төрлөөр авахаа сонгоно уу ---</option>
                                                        {types.map((type, idx) =>
                                                            <option key={idx} value={type}>.{type}</option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="recipient-name" className="col-form-label">Худалдан авах талбайн хэмжээ:</label>
                                                    <span className="form-control" id="size">{area.output}{area.type}<sup>2</sup></span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="recipient-name" className="col-form-label">Худалдан авах мөнгөн дүн:</label>
                                                    <span className="form-control" id="price">{total_price}₮</span>
                                                </div>
                                                {
                                                    !is_authenticated &&
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
                                    </div>
                                </div>
                            }
                            <div className="modal-footer">
                                <button type="button" onClick={() => this.closeModal()} className="btn btn-secondary">Буцах</button>
                                <div className="form-group">
                                    {this.state.handlePaymentIsLoad ?
                                        <>
                                            <button className="btn gp-btn-primary">
                                                <a className="spinner-border text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </a>
                                                <span> Уншиж байна. </span>
                                            </button>
                                        </>
                                        :
                                        <button disabled={this.state.selected_type.length < 1} type="button" className="btn gp-btn-primary" onClick={this.handlePayment} >
                                            Худалдаж авах
                                        </button>
                                    }
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

    showModal(is_loading, coodrinatLeftTop, coodrinatRightBottom, layer_info, area, feature_info_list, layer_list) {
        this.toggleControl(true)
        this.renderComponent({is_loading, coodrinatLeftTop, coodrinatRightBottom, layer_info, area, feature_info_list, layer_list})
    }

}
