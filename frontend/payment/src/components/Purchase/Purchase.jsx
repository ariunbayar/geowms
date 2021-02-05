import React, { Component } from "react"
import {service} from '../service'
import {QPay} from '../QPay/Qpay'

export class Purchase extends Component {

    constructor(props) {
        super(props)

        this.state = {
            purchase: props.purchase,
            price: 3000,
            purchase_all: [],
            qpay_modal_is: false,
            point_data: [],
            names: [],
            check_error: false,
            error_msg: '',
            alert_toggle: false,
            alert_msg: 'Монгол Банкаар төлбөр төлөх',
        }
        this.qPayClose = this.qPayClose.bind(this)
        this.alertOver = this.alertOver.bind(this)
        this.alertOut = this.alertOut.bind(this)
    }

    componentDidMount(){
        const purchase_id = this.props.match.params.id
        service.purchaseAll(purchase_id).then(({ success, purchase_all, point_data, msg }) => {
                    if(success){
                        if (purchase_all) {
                            purchase_all.map(( purchase_all ) =>
                                this.setState({purchase_all})
                            )
                        }
                        if(point_data){
                            this.setState({point_data})
                        }
                    }
                    else{
                        this.setState({ check_error: !success, error_msg: msg })
                        setTimeout(() => {
                            this.setState({ check_error: success, error_msg: msg })
                        }, 2000);
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
        const { purchase, purchase_all, point_data, names, error_msg, check_error, qpay_modal_is, alert_msg, alert_toggle } = this.state
        return (
        <div className="container my-4">
            <div className="row shadow-lg p-3 mb-5 bg-white rounded">
                <div className="col-md-12 py-0 my-3">
                    {
                        check_error
                        ?
                            <div className="alert alert-danger position-absolute float-right mr-3" style={{right: "0"}} role="alert">{error_msg}</div>
                        :
                            <div></div>
                    }
                    <div className="mb-3 h5">Лавлах</div>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th style={{textAlign: "center"}} colSpan="2" scope="rowgroup"><i className="fa fa-map mr-2 mr-2" aria-hidden="true"></i>Цэгийн мэдээлэл</th>
                            </tr>
                            <tr>
                                <th style={{textAlign: "center"}} scope="">
                                    Цэгийн нэр
                                </th>
                                <th style={{textAlign: "center"}} scope="">
                                    Цэгийн үнэ
                                </th>
                            </tr>
                            <tr>
                                <td scope="">
                                    {
                                        point_data.map((value, key) => <li className="list-group-item" style={{textAlign: "center"}} key={key}>{value.name}</li>)
                                    }
                                </td>
                                    <td scope="">
                                    <div>
                                    {
                                        point_data.map((value, key) => <li className="list-group-item" style={{textAlign: "center"}} key={key}>{value.amount + '₮'}</li>)
                                    }
                                    </div>
                                </td>
                            </tr>
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
                            <button style={{width:'80%'}}  className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleQpay()}>
                                <h4 className="text-succes p-3">QPAY ээр төлбөр төлөх</h4>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={this.state.qpay_modal_is ? 'show d-block modal fade bd-example-modal-lg' : 'd-none' } tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <QPay purchase_id={purchase_id} qpay_open={this.state.qpay_modal_is} handleClose={this.qPayClose} history={this.props.history.push} price={purchase_all.total_amount} ></QPay>
                        <button className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleQpay()}>
                            <a className="text-succes ">Гарах</a>
                        </button>
                    </div>
                </div>
            </div>
            <div className={this.state.qpay_modal_is ? 'modal-backdrop fade show' : 'd-none'}></div>
        </div>
        )
    }
}
