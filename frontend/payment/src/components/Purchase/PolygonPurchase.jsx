import React, { Component } from "react"
import {service} from '../service'
import {QPay} from '../QPay/Qpay'
import Modal from '@utils/Modal/Modal'
import EmailModalForm from './EmailModalForm'
import {Notif} from '@utils/Notification'


export class PolygonPurchase extends Component {

    constructor(props) {
        super(props)

        this.too = 0
        this.state = {
            payment_id: this.props.match.params.id,
            items: {},
            points: [],
            polygon: [],
            layers: [],

            purchase_all: [],
            qpay_modal_is: false,
            is_modal_open: 'closed',
            alert_msg: 'Монгол Банкаар төлбөр төлөх',
            email_modal_status: 'closed'
        }

        this.qPayClose = this.qPayClose.bind(this)
        this.alertOver = this.alertOver.bind(this)
        this.alertOut = this.alertOut.bind(this)
        this.addNotif = this.addNotif.bind(this)
        this.handleModalApproveClose = this.handleModalApproveClose.bind(this)
        this.handleUserEmailCheck = this.handleUserEmailCheck.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    componentDidMount(){
        const id = this.state.payment_id
        service.getDetails(id).then(({success, items, polygon, layers, info}) => {
            if(success){
              items.map(( items ) =>
                  this.setState({items})
              )
              this.setState({ polygon, layers })
            }
            else {
                this.addNotif('warning', info, 'exclamation')
            }
        }).catch(error => this.addNotif('danger', 'Алдаа гарсан', 'times'))
    }

    modalChange(modal_icon, icon_color, title, text, has_button, modalClose) {
        this.setState({
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            modalClose: modalClose,
        })
        this.handleModalOpen()
    }

    successModal(info) {
        this.modalChange(
            'fa fa-check-circle',
            'success',
            info,
            '',
            false
        )
        this.handleModalOpen()
    }

    handleModalOpen() {
        this.setState({ is_modal_open: 'open' }, () => {
            this.setState({ is_modal_open: 'initial' })
        })
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

    handleFormModalOpen(){
        this.setState({ email_modal_status: 'open' })
    }

    handleFormModalClose(){
        this.setState({ email_modal_status: 'closed' })
    }

    handleUserEmailCheck(){
        service.userEmailCheck().then(({success}) => {
            if (success) {
                this.modalChange(
                    'fa fa-exclamation-circle',
                    "warning",
                    'Анхааруулга',
                    'QPay-ээр төлбөр төлөхөд шимтгэл авахыг анхаарна уу!',
                    true
                )
                this.handleModalOpen()
            }
            else this.handleFormModalOpen()
        })
    }

    handleModalApproveClose() {
        const purchase_id = this.props.match.params.id
        if (!this.state.purchase_all.export_files) {
            service.downloadPurchase(purchase_id)
        }
        this.props.history.push(`/payment/history/api/details/${purchase_id}/`)
    }

    handleQpay(){
        this.setState(prevState => ({
            is_modal_open: 'closed',
            qpay_modal_is: !prevState.qpay_modal_is,
        }))
    }

    qPayClose(is_success){
        this.modalChange(
            'fa fa-check-circle',
            "success",
            'Худалдан авалтын мэдээлэл',
            'Төлөлт амжилттай хийгдлээ. Татах линкийг таны баталгаажуулсан цахим хаягаар илгээх болно.',
            false,
            () => this.handleModalApproveClose()
        )
        this.setState({ qpay_modal_is: false, is_modal_open: 'open' })
    }

    alertOver(){
        this.setState({ alert_msg: "Засвартай байгаа" })
    }

    alertOut(){
        this.setState({ alert_msg: "Монгол Банкаар төлбөр төлөх" })
    }

    render() {
        const purchase_id = this.props.match.params.id
        const { alert_msg, is_modal_open } = this.state
        const { items, layers, email_modal_status} = this.state
        return (
        <div className="container my-4">
            <div className="row shadow-lg p-3 mb-5 bg-white rounded">
                <div className="col-md-12 py-0 my-3">
                    <div className="mb-3 h5">Лавлах</div>
                    <table className="table table-bordered">
                        <tbody>
                            <tr className="text-center">
                                <th colSpan="2" scope="rowgroup">
                                    <i className="fa fa-map mr-2 mr-2" aria-hidden="true"></i>
                                    Худалдан авалтын мэдээлэл
                                </th>
                            </tr>

                            <tr className="text-center">
                              <th>
                                  Бүтээгдэхүүний нэр
                              </th>
                              <th>
                                  Үнэ
                              </th>
                            </tr>
                            {
                              layers.map((value, key) =>
                                <tr key={key}>
                                    <td>
                                        {value.name}
                                    </td>
                                    <td>
                                        {value.amount}₮
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Гүйлгээний дугаар</td>
                                <td>{items.geo_unique_number}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>НИЙТ МӨНГӨН ДҮН</td>
                                <td>{items.total}₮</td>
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
                            <button type="button" data-toggle="modal" style={{width:'80%'}}  className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleUserEmailCheck()}>
                                <h4 className="text-succes p-3">QPAY-ээр төлбөр төлөх</h4>
                            </button>
                        </div>
                        <Modal
                            modalAction={() => this.handleQpay()}
                            actionNameDelete="Үргэлжлүүлэх"
                            model_type_icon="warning"
                            modal_status={is_modal_open}
                            modal_icon={this.state.modal_icon}
                            icon_color={this.state.icon_color}
                            title={this.state.title}
                            text={this.state.text}
                            has_button={this.state.has_button}
                            modalClose={this.state.modalClose}
                        />
                        <EmailModalForm
                            modalAction={(info) => this.successModal(info)}
                            modalClose={() => this.handleFormModalClose()}
                            status={email_modal_status}
                        />
                    </div>
                </div>
            </div>
            <div className={this.state.qpay_modal_is ? 'show d-block modal fade bd-example-modal-lg' : 'd-none' } tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
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
            <div className={this.state.qpay_modal_is ? 'modal-backdrop fade show' : 'd-none'}></div>
            <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
        </div>
        )
    }
}
