import React, { Component } from "react"
import {service} from '../service'

export class Failed extends Component {

    constructor(props) {
        super(props)

        this.state = {
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

    render() {
        const { purchase_all } = this.state
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
                                <td><i class="fa fa-location-arrow mr-2" aria-hidden="true"></i>Төлбөр</td>
                                <td>{purchase_all.amount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div class="row py-3">

                <div class="col-md-6 py-0 my-3" >
                    <h5 class="mb-3">Гүйлгээний төлөв</h5>
                    <h5 class="mb-3"><span className="text-danger">{purchase_all.error_message}</span></h5>

                    <ul class="list-unstyled"  style={{width:"400px"}}>
                        <li class="f-nav-item mb-2"  style={{borderBottom: 'solid 1px #363636;'}}>
                            Гүйлгээний дугаар | {purchase_all.bank_unique_number}
                        </li>
                        <li class="f-nav-item mb-2" style={{borderBottom: 'solid 1px #363636;'}}>
                            Мөнгөн дүн | {purchase_all.amount}₮
                        </li>
                        <li class="f-nav-item mb-2" style={{borderBottom: 'solid 1px #363636;'}}>
                            НИЙТ МӨНГӨН ДҮН | {purchase_all.amount}₮
                        </li>
                    </ul>
                    <button class="btn btn-danger" disabled>Хэвлэх</button>
                </div>
                <div class="col-md-6 py-0 my-3" >
                    <h5 class="mb-3">QR Code <span className="text-danger">Алдаа гарлаа</span></h5>
                    <img src="/static/assets/image/lavlakh.png"></img>

                </div>
            </div>
        </div>
        )
    }
}
