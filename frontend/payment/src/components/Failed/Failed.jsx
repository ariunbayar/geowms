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
        <div className="container">
            <div className="row">
                <div className="col-md-12 py-0 my-3">
                    <h5 className="mb-3">Лавлах</h5>

                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td><i className="fa fa-map mr-2" aria-hidden="true"></i>Цэгийн нэр</td>
                                <td>{purchase_all.description}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Аймаг</td>
                                <td>Дорноговь</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Сум</td>
                                <td>Даланжаргалан</td>
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
                                <td>1113.268</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Төлбөр</td>
                                <td>{purchase_all.amount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="row py-3">

                <div className="col-md-6 py-0 my-3" >
                    <h5 className="mb-3">Гүйлгээний төлөв</h5>
                    <h5 className="mb-3"><span className="text-danger">{purchase_all.error_message}</span></h5>

                    <ul className="list-unstyled"  style={{width:"400px"}}>
                        <li className="f-nav-item mb-2">
                            Гүйлгээний дугаар | {purchase_all.bank_unique_number}
                        </li>
                        <li className="f-nav-item mb-2">
                            Мөнгөн дүн | {purchase_all.amount}₮
                        </li>
                        <li className="f-nav-item mb-2">
                            НИЙТ МӨНГӨН ДҮН | {purchase_all.amount}₮
                        </li>
                    </ul>
                    <button className="btn btn-danger" disabled>Хэвлэх</button>
                </div>
                <div className="col-md-6 py-0 my-3" >
                    <h5 className="mb-3">QR Code <span className="text-danger">Алдаа гарлаа</span></h5>
                    <img src="/static/assets/image/lavlakh.png"></img>

                </div>
            </div>
        </div>
        )
    }
}
