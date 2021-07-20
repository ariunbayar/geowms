import React, { Component } from "react"

import EmailModalForm from './EmailModalForm'
import { QPay } from '../QPay/Qpay'

import { service } from '../service'

export class Purchase extends Component {

    constructor(props) {
        super(props)

        this.state = {
            purchase: props.purchase,
            purchase_all: [],
            qpay_modal_is: false,
            point_data: [],
            names: [],

            is_work_mn_bank: false,
            alert_msg: 'Монгол Банкаар төлбөр төлөх',
        }
        this.qPayClose = this.qPayClose.bind(this)
        this.handleModalApproveClose = this.handleModalApproveClose.bind(this)
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
                    global.NOTIF('danger', 'Мэдээлэл олдсонгүй', 'times')
                }
            }).catch(error => global.NOTIF('danger', 'Алдаа гарсан', 'times'))
    }

    handlePayment (){
        const purchase_id = this.props.match.params.id
        const { purchase_all, is_work_mn_bank } = this.state
        if (is_work_mn_bank) {
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
    }

    handleModalOpen() {
        this.handleModal(
            'fa fa-exclamation-circle',
            'warning',
            "Анхааруулга",
            'QPay-ээр төлбөр төлөхөд шимтгэл авна.',
            true,
            () => this.handleQpay(),
            "Үргэлжлүүлэх",
        )
    }

    handleModal(modal_icon, icon_color, title, text, has_button, modalAction, actionNameDelete, modalClose=null) {
        const modal = {
            modal_status: "open",
            modal_icon: modal_icon,
            modal_bg: "",
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: "Буцах",
            actionNameDelete: actionNameDelete,
            modalAction: modalAction,
            modalClose: modalClose
        }
        global.MODAL(modal)
    }

    handleQpay(){
        this.setState(prevState => ({
            qpay_modal_is: !prevState.qpay_modal_is,
        }))
    }

    handleModalApproveClose(){
        const purchase_id = this.props.match.params.id
        if (!this.state.purchase_all.export_files) {
            service.downloadPurchase(purchase_id)
        }
        this.props.history.push(`/payment/history/api/details/${purchase_id}/`)
    }

    qPayClose(is_success){
        if (is_success) {
            this.handleModal(
                'fa fa-check-circle',
                'success',
                "Худалдан авалтын мэдээлэл",
                'Төлөлт амжилттай хийгдлээ. Татах линкийг таны баталгаажуулсан цахим хаягаар илгээх болно.',
                false,
                null,
                "",
                () => this.handleModalApproveClose()
            )
        }
        this.setState({ qpay_modal_is: false })
    }

    handleUserEmailCheck(){
        service
            .userEmailCheck()
            .then(({ success }) => {
                if (success) {
                    this.handleModal(
                        'fa fa-exclamation-circle',
                        "warning",
                        'Анхааруулга',
                        'QPay-ээр төлбөр төлөхөд шимтгэл авахыг анхаарна уу!',
                        true,
                        () => this.handleQpay(),
                        'Үргэлжлүүлэх',
                        null
                    )
                }
                else {
                    this.handleModal(
                        '',
                        "",
                        '',
                        <EmailModalForm
                            modalAction={(info) => this.successModal(info)}
                            modalClose={() => this.handleFormModalClose()}
                        />,
                        false
                    )
                }
            })
    }

    setAlert(alert_msg) {
        this.setState({ alert_msg })
    }

    render() {
        const purchase_id = this.props.match.params.id
        const { purchase_all, point_data, qpay_modal_is, alert_msg, is_work_mn_bank } = this.state
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
                            <button style={{ width:'80%' }}
                                className="btn gp-btn-primary text-center btn-lg mt-3"
                                disabled={!is_work_mn_bank}
                                onMouseOut={() => this.setAlert("Монгол Банкаар төлбөр төлөх")}
                                onMouseOver={() => this.setAlert("Засвартай байгаа")}
                                onClick={() => this.handlePayment()}
                            >
                                <h4 className="text-succes p-3 text-white">{alert_msg}</h4>
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button type="button" data-toggle="modal" style={{ width:'80%' }}  className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleUserEmailCheck()}>
                                <h4 className="text-succes p-3 text-white">QPAY-ээр төлбөр төлөх</h4>
                            </button>
                        </div>
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
                        />
                        <button type="button" data-toggle="modal" className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleQpay()}>
                            <a className="text-succes ">Гарах</a>
                        </button>
                    </div>
                </div>
            </div>
            <div className={qpay_modal_is ? 'modal-backdrop fade show' : 'd-none'}></div>
        </div>
        )
    }
}
