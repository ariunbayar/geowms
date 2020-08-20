import React, { Component } from "react"
import {service} from '../service'
export class Purchase extends Component {

    constructor(props) {
        super(props)

        this.state = {
            purchase: props.purchase,
            price: 3000,
            purchase_all: []
        }
    }
    componentDidMount(){
        const purchase_id = this.props.match.params.id

        service.purchaseAll(purchase_id).then(({ purchase_all }) => {
            if (purchase_all) {
                purchase_all.map((purchase_all) => 
                this.setState({purchase_all}) 
                )              
            }
        })
    }
    handlePayment (){
        const {purchase_all} = this.state
        service.payment(purchase_all).then(({ success }) => {
            if (success) {
                // this.props.history.push(`/payment/success/${purchase_all.id}/`)      
            }
            else{
                // this.props.history.push(`/payment/failed/${purchase_all.id}/`)      
            }
        })

    }

    render() {
        const { purchase, purchase_all } = this.state
        return (
        <div class="container">
            <div class="row">
                <div class="col-md-12 py-0 my-3">
                    <h5 class="mb-3">Лавлах</h5>

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td><i class="fa fa-map mr-2" aria-hidden="true"></i>Цэгийн нэр</td>
                                <td>{purchase_all.description}</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-map-marker mr-2" aria-hidden="true"></i>Аймаг</td>
                                <td>Дорноговь</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-map-marker mr-2" aria-hidden="true"></i>Сум</td>
                                <td>Даланжаргалан</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Планшет</td>
                                <td>G0012</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Уртраг</td>
                                <td>109 03 43.83379</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Өргөрөг</td>
                                <td>45 55 24.90433</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>N_UTM</td>
                                <td>5087383.048</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>E_UTM</td>
                                <td>349744.265</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Өндөр</td>
                                <td>1113.268</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Гүйлгээний дугаар</td>
                                <td>{purchase_all.geo_unique_number}</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Мөнгөн дүн</td>
                                <td>{purchase_all.amount}₮</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>НИЙТ МӨНГӨН ДҮН</td>
                                <td>{purchase_all.amount}₮</td>
                            </tr>
                        </tbody>
                    </table>
                    <button  class="btn gp-btn-primary text-center mt-3" onClick={() => this.handlePayment()}>
                            <a class="fa fa-shopping-cart mr-2"> Худалдаж авах</a>
                    </button>
                </div>
            </div>
        </div>
        )
    }
}
