import React, { Component } from "react"
import {service} from '../service'
import {QPay} from '../QPay/Qpay'
import ModalAlert from '@utils/Modal/ModalAlert'
import Modal from '@utils/Modal/Modal'
import {Notif} from '@utils/Notification'

export class Purchase extends Component {

    constructor(props) {
        super(props)

        this.too = 0
        this.state = {
            purchase: props.purchase,
            price: 3000,
            purchase_all: [],
            qpay_modal_is: false,
            point_data: [],
            names: [],

            is_modal_open: false,
            is_modal_info_open: false,
            alert_msg: 'Монгол Банкаар төлбөр төлөх',
        }
        this.qPayClose = this.qPayClose.bind(this)
        this.alertOver = this.alertOver.bind(this)
        this.alertOut = this.alertOut.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleModalApproveClose = this.handleModalApproveClose.bind(this)
        this.addNotif = this.addNotif.bind(this)
    }

    componentDidMount(){
        const purchase_id = this.props.match.params.id
        service
            .purchaseAll(purchase_id)
            .then(({ success, purchase_all, point_data, msg }) => {
                if(success) {
                    if (purchase_all) {
                        purchase_all.map(( purchase_all ) =>
                            this.setState({purchase_all})
                        )
                    }
                    if(point_data) {
                        this.setState({ point_data })
                    }
                }
                else {
                    this.addNotif('danger', 'Мэдээлэл олдсонгүй', 'times')
                }
            }).catch(error => this.addNotif('danger', 'Алдаа гарсан', 'times'))
    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style: style, msg: msg, icon: icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }

    handlePayment (){
        const purchase_id = this.props.match.params.id
        const {purchase_all} = this.state
        service
            .payment(purchase_all)
            .then(({ success }) => {
                if (success) {
                    this.props.history.push(`/payment/history/api/details/${purchase_id}/`)
                } else {
                    this.props.history.push(`/payment/failed/${purchase_id}/`)
                }
            })
    }

    handleModalOpen(){
        this.setState({ is_modal_open: true })
    }

    handleModalClose(){
        this.setState({is_modal_open: false})
    }

    handleQpay(){
        this.setState(prevState => ({
            is_modal_open: false,
            qpay_modal_is: !prevState.qpay_modal_is,
        }))
    }

    handleModalApproveClose(){
        const purchase_id = this.props.match.params.id
        if (!this.state.purchase_all.export_files) {
            service.downloadPurchase(purchase_id, 'point')
        }
        this.props.history.push(`/payment/history/api/details/${purchase_id}/`)
    }

    qPayClose(is_success){
        this.setState({ qpay_modal_is: false, is_modal_info_open: is_success })
    }

    alertOver(){
        this.setState({ alert_msg: "Засвартай байгаа" })
    }

    alertOut(){
        this.setState({ alert_msg: "Монгол Банкаар төлбөр төлөх" })
    }

    render() {
        const purchase_id = this.props.match.params.id
        const { purchase_all, point_data, qpay_modal_is, alert_msg, is_modal_info_open, is_modal_open } = this.state
        return (
        <div className="container my-4">
            <div className="row shadow-lg p-3 mb-5 bg-white rounded">
                <div className="col-md-12 py-0 my-3">
                    <div className="mb-3 h5">Лавлах</div>
                    <table className="table table-bordered">
                        <tbody>
                            <tr className="text-center">
                                <th colSpan="2" scope="rowgroup"><i className="fa fa-map mr-2 mr-2" aria-hidden="true"></i>Цэгийн мэдээлэл</th>
                            </tr>
                            <tr className="text-center">
                                <th>
                                    Цэгийн нэр
                                </th>
                                <th>
                                    Цэгийн үнэ
                                </th>
                            </tr>
                            {
                                point_data.map((value, key) =>
                                    <tr key={key} className="text-center">
                                        <td>
                                            {value.point_name}
                                        </td>
                                        <td>
                                            {value.amount + '₮'}
                                        </td>
                                    </tr>
                                )
                            }
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Гүйлгээний дугаар</td>
                                <td>{purchase_all.geo_unique_number}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>НИЙТ МӨНГӨН ДҮН</td>
                                <td>{purchase_all.total_amount}₮</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="row text-center">
                        <div className="col-md-6">
                            <button style={{width:'80%'}}
                                className="btn gp-btn-primary text-center btn-lg mt-3"
                                disabled
                                onMouseOut={() => this.alertOut()}
                                onMouseOver={() => this.alertOver()}
                                onClick={() => this.handlePayment()}
                            >
                                <h4 className="text-succes p-3">{alert_msg}</h4>
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button type="button" data-toggle="modal" style={{width:'80%'}}  className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleModalOpen()}>
                                <h4 className="text-succes p-3">QPAY-ээр төлбөр төлөх</h4>
                            </button>
                        </div>
                        { is_modal_open &&
                            <Modal
                                modalAction={() => this.handleQpay()}
                                modalClose={this.handleModalClose}
                                text='QPay-ээр төлбөр төлөхөд шимтгэл авна.'
                                title="Анхааруулга"
                                actionNameDelete="Үргэлжлүүлэх"
                                model_type_icon="warning"
                                status={this.state.status}
                            />
                        }
                    </div>
                </div>
            </div>
            <div className={qpay_modal_is ? 'show d-block modal fade bd-example-modal-lg' : 'd-none' } tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <QPay
                            purchase_id={purchase_id}
                            qpay_open={this.state.qpay_modal_is}
                            handleClose={this.qPayClose}
                            history={this.props.history.push}
                            addNotif={this.addNotif}
                        />
                        <button type="button" data-toggle="modal" className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleQpay()}>
                            <a className="text-succes ">Гарах</a>
                        </button>
                    </div>
                </div>
            </div>
            <div className={qpay_modal_is ? 'modal-backdrop fade show' : 'd-none'}></div>
            {
             is_modal_info_open &&
                <ModalAlert
                    modalClose = {() => this.handleModalApproveClose()}
                    text='Төлөлт амжилттай хийгдлээ. Татах линкийг таны баталгаажуулсан цахим хаягаар илгээх болно.'
                    title="Худалдан авалтын мэдээлэл"
                    status={this.state.status}
                    actionNameDelete="зөвшөөрөх"
                />
            }
            <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
        </div>
        )
    }
}
