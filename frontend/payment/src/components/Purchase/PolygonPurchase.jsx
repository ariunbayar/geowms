import React, { Component } from "react"
import {service} from '../service'
import {QPay} from '../QPay/Qpay'
import Modal from '../../../../../src/components/Modal/InfoModal'
import ShowModal from '../../../../../src/components/Modal/ShowModal'

export class PolygonPurchase extends Component {

    constructor(props) {
        super(props)

        this.state = {
            payment_id: this.props.match.params.id,
            items: {},
            points: [],
            polygon: [],
            layers: [],

            purchase: props.purchase,
            price: 3000,
            purchase_all: [],
            qpay_modal_is: false,
            is_modal_info_open: false,
            is_modal_open: false,
            alert_toggle: false,
            alert_msg: 'Монгол Банкаар төлбөр төлөх',
        }
        this.qPayClose = this.qPayClose.bind(this)
        this.alertOver = this.alertOver.bind(this)
        this.alertOut = this.alertOut.bind(this)
        this.handleModalApproveClose = this.handleModalApproveClose.bind(this)
        this.downloadPurchase = this.downloadPurchase.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
    }

    downloadPurchase(id) {
        service.downloadPurchase(id, this.props.match.params.type).then(rsp => {
            console.log(rsp);
        })
    }

    componentDidMount(){
        const id = this.state.payment_id
        service.getDetails(id).then(({success, items, polygon, layers}) => {
            if(success){
              items.map(( items ) =>
                  this.setState({items})
              )
              if(!items[0].export_file) {
                this.downloadPurchase(id)
              }
              this.setState({polygon, layers})
            }
            else {
                this.addNotif('danger', 'Мэдээлэл олдсонгүй', 'times')
            }
        }).catch(error => console.log(error))
    }

    handlePayment (){
        const purchase_id = this.props.match.params.id
        const {purchase_all} = this.state
        service.payment(purchase_all).then(({ success }) => {
            if (success) {
                this.props.history.push(`/payment/history/api/details/${purchase_id}/`)
            } else {
                this.props.history.push(`/payment/failed/${purchase_id}/`)
            }
        })

    }

    handleModalOpen(){
        this.setState({ is_modal_open: !this.state.is_modal_open })
    }

    handleModalClose(){
        this.setState({is_modal_open: false})
    }

    handleModalApproveClose(){
      const purchase_id = this.props.match.params.id
      this.props.history.push(`/payment/history/api/details/${purchase_id}/`)
    }

    handleQpay(){
        this.setState(prevState => ({
            qpay_modal_is: !prevState.qpay_modal_is,
        }))
    }

    qPayClose(){
        this.setState({qpay_modal_is: false})
    }

    alertOver(){
        this.setState({ alert_toggle: true, alert_msg: "Засвартай байгаа" })
    }

    alertOut(){
        this.setState({  alert_toggle: false, alert_msg: "Монгол Банкаар төлбөр төлөх" })
    }

    render() {
        const purchase_id = this.props.match.params.id
        const { purchase, purchase_all, qpay_modal_is, alert_msg, alert_toggle, is_modal_info_open, is_modal_open } = this.state
        const { items, polygon, layers} = this.state
        return (
        <div className="container my-4">
            <div className="row shadow-lg p-3 mb-5 bg-white rounded">
                <div className="col-md-12 py-0 my-3">
                    <div className="mb-3 h5">Лавлах</div>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th style={{textAlign: "center"}} colSpan="2" scope="rowgroup"><i className="fa fa-map mr-2 mr-2" aria-hidden="true"></i>Худалдан авалтын мэдээлэл</th>
                            </tr>

                            <tr>
                              <th style={{textAlign: "center"}} scope="">
                                  Бүтээгдэхүүний нэр
                              </th>
                              <th style={{textAlign: "center"}} scope="">
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
                            <button type="button" data-toggle="modal" style={{width:'80%'}}  className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleModalOpen()}>
                                <h4 className="text-succes p-3">QPAY-ээр төлбөр төлөх</h4>
                            </button>
                        </div>
                        { is_modal_open &&
                            <ShowModal
                                modalShow = {() => this.handleQpay()}
                                modalClose = {this.handleModalClose}
                                text='QPay-ээр төлбөр төлөхөд шимтгэл авна.'
                                title="Анхааруулга"
                                status={this.state.status}
                            />
                        }
                    </div>
                </div>
            </div>
            <div className={this.state.qpay_modal_is ? 'show d-block modal fade bd-example-modal-lg' : 'd-none' } tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <QPay purchase_id={purchase_id} qpay_open={this.state.qpay_modal_is} handleClose={this.qPayClose} history={this.props.history.push} price={items.total} ></QPay>
                        <button type="button" data-toggle="modal" className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleQpay()}>
                            <a className="text-succes ">Гарах</a>
                        </button>
                    </div>
                </div>
            </div>
            <div className={this.state.qpay_modal_is ? 'modal-backdrop fade show' : 'd-none'}></div>

            {
             is_modal_info_open &&
                <Modal
                    modalClose = {() => this.handleModalApproveClose()}
                    text='Төлөлт амжилттай хийгдлээ. Татах линкийг таны баталгаажуулсан цахим хаягаар илгээх болно.'
                    title="Худалдан авалтын мэдээлэл"
                    status={this.state.status}
                    actionNameDelete="зөвшөөрөх"
                />
            }
        </div>
        )
    }
}