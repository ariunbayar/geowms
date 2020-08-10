import React, { Component } from "react"
import {service} from './service'
export class Purchase extends Component {

    constructor(props) {
        super(props)

        this.state = {
            purchase: props.purchase,
            price: 3000
        }
    }
    handlePayment (){
        const {price} = this.state
        service.payment(price)

    }

    render() {
        const { purchase } = this.state
        return (
        <div class="container">
            <div class="row">
                <div class="col-md-12 py-0 my-3">
                    <h5 class="mb-3">Лавлах</h5>

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td><i class="fa fa-map mr-2" aria-hidden="true"></i>Цэгийн нэр</td>
                                <td>Газрын бүрхэвч, газар ашиглалт</td>
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
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Төлбөр</td>
                                <td>{this.state.price}</td>
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
