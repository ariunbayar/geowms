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
        }
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
                        alert(msg)
                    }
        })
    }
    handlePayment (){
        const purchase_id = this.props.match.params.id
        const {purchase_all} = this.state
        console.log(purchase_all)
        service.payment(purchase_all).then(({ success }) => {
            if (success) {
                this.props.history.push(`/payment/success/${purchase_id}/`)
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
    render() {
        const purchase_id = this.props.match.params.id
        const { purchase, purchase_all, point_data, names } = this.state
        console.log(purchase_all)
        return (
        <div className="container my-4">
            <div className="row shadow-lg p-3 mb-5 bg-white rounded">
                <div className="col-md-12 py-0 my-3">
                    <h5 className="mb-3">Лавлах</h5>

                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td><i className="fa fa-map mr-2" aria-hidden="true"></i>Цэгийн нэр</td>
                                <td>
                                        {
                                            point_data.map((value, key) => <b key={key}>{'"'+ value.name + '" '}</b>)
                                        }
                                        {purchase_all.point_name}
                                </td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Аймаг</td>
                                <td>{purchase_all.mpoint_aimag}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Сум</td>
                                <td>{purchase_all.mpoint_sum}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Планшет</td>
                                <td>G0012</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Уртраг</td>
                                <td>109 03 43.83379</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Өргөрөг</td>
                                <td>45 55 24.90433</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>N_UTM</td>
                                <td>5087383.048</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>E_UTM</td>
                                <td>349744.265</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Өндөр</td>
                                <td>{purchase_all.undur}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Гүйлгээний дугаар</td>
                                <td>{purchase_all.geo_unique_number}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Мөнгөн дүн</td>
                                <td>{point_data.map((value,key)=><b key={key}>{'"' + value.amount + '" '}</b>)}₮</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>НИЙТ МӨНГӨН ДҮН</td>
                                <td>{purchase_all.total_amount}₮</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="row text-center">
                        <div className="col-md-6">
                            <button style={{width:'80%'}}  className="btn gp-btn-primary text-center mt-3" onClick={() => this.handlePayment()}>
                                <h4 className="text-succes ">Монгол банкаар төлбөр</h4>
                                <h4 className="text-succes "> төлөх.</h4>
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button style={{width:'80%'}}  className="btn gp-btn-primary text-center mt-3" onClick={() => this.handleQpay()}>
                                <h4 className="text-succes ">QPAY ээр төлбөр</h4>
                                <h4 className="text-succes "> төлөх.</h4>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={this.state.qpay_modal_is ? 'show d-block modal fade bd-example-modal-lg' : 'd-none' } tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <QPay purchase_id={purchase_id} qpay_open={this.state.qpay_modal_is} history={this.props.history.push} ></QPay>
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
