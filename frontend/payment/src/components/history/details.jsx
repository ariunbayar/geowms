import React, { Component } from "react"
import { service } from "../service"
import { NavLink } from "react-router-dom"
import { Notif } from '@utils/Notification/index'
import Loader from '@utils/Loader'


export class Details extends Component {

    constructor(props) {
        super(props)

        this.too = 0
        this.state = {
            items: {},
            points: [],
            polygon: [],
            layers: [],
            is_loading: true,
            payment_id: this.props.match.params.id,
        }
        this.addNotif = this.addNotif.bind(this)
    }

    componentDidMount(){
        const id = this.state.payment_id
        service.getDetails(id).then(({success, items, points, polygon, layers, info}) => {
            if(success){
                items.map(( items ) =>
                    this.setState({items})
                )
                this.setState({ points, polygon, layers, is_loading: false })
            }
            else {
                this.setState({ is_loading: false })
                this.addNotif('warning', info, 'exclamation')
            }
        }).catch(error => {
            this.addNotif('danger', 'Алдаа гарсан байна', 'times')
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

    render() {
        const { items, points, polygon, layers, payment_id, is_loading } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 py-0 my-3">
                        <NavLink to="/payment/history/" className="btn mt-2 gp-outline-primary">
                            Буцах
                        </NavLink>
                        <br></br>
                        <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
                        <Loader is_loading={is_loading} />
                        <div id="container">
                            <h4 className="text-center">
                                {
                                    polygon && polygon.length > 0
                                    ?
                                    'Хэсэгчлэн худалдан авалт'
                                    : 'Лавлах'
                                }
                            </h4>
                            <br></br>
                            {
                                points ?
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr className="text-center">
                                                <th
                                                    colSpan={items.is_success ? "7" : "6"}
                                                    scope="rowgroup"
                                                >
                                                    <h4>
                                                        <i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>
                                                        Цэгийн мэдээлэл
                                                    </h4>
                                                </th>
                                            </tr>
                                            <tr className="text-center">
                                                <th style={{width: "5%"}}>
                                                    Д/д
                                                </th>
                                                <th>
                                                    Цэгийн нэр
                                                </th>
                                                <th style={{width: "20%"}}>
                                                    Аймаг
                                                </th>
                                                <th>
                                                    Сум
                                                </th>
                                                <th>
                                                    Өндөр
                                                </th>
                                                <th>
                                                    <i className="fa fa-money mr-2" aria-hidden="true"></i>
                                                    Төлбөр
                                                </th>
                                                {
                                                    items.is_success
                                                    ?
                                                        <th>
                                                            Файл
                                                        </th>
                                                    : null
                                                }
                                            </tr>
                                            {
                                                points.length > 0
                                                ?
                                                    points.map((value, key) =>
                                                        <tr className="text-center" key={key}>
                                                            <th>
                                                                {key + 1}
                                                            </th>
                                                            <td>
                                                                {value.name}
                                                            </td>
                                                            <td scope="">
                                                                {value.mpoint.aimag}
                                                            </td>
                                                            <td scope="">
                                                                {value.mpoint.sum}
                                                            </td>
                                                            <td scope="">
                                                                {value.mpoint.undur}
                                                            </td>
                                                            <td>
                                                                {value.amount}₮
                                                            </td>
                                                            {
                                                                items.is_success
                                                                ?
                                                                    <td scope="">
                                                                        {value.file_name &&
                                                                            <a className="text-info" href={`/payment/download-pdf/${payment_id}/${value.file_name}/`}>
                                                                                файл
                                                                            </a>
                                                                        }
                                                                    </td>
                                                                :
                                                                null
                                                            }
                                                        </tr>
                                                    )
                                                :
                                                    <tr className="text-center">
                                                        <th colSpan={items.is_success ? "7" : "6"}>
                                                            Мэдээлэл байхгүй байна
                                                        </th>
                                                    </tr>
                                            }
                                            <tr className="text-center">
                                                <th colSpan="2"><i className="fa fa-calendar-o mr-2" aria-hidden="true"></i>Үүссэн огноо:</th>
                                                <td colSpan={items.is_success ? "5" : "4"}>{items.created_at}</td>
                                            </tr>
                                            {
                                                items.is_success && items.export_file
                                                ?
                                                    <tr className="text-center">
                                                        <th colSpan="2">
                                                            Лавлагаа
                                                        </th>
                                                        <td colSpan={items.is_success ? "5" : "4"}>
                                                            <a className="text-info" href={`/payment/download-zip/${payment_id}/`}>
                                                                Лавлагааг татах
                                                            </a>
                                                        </td>
                                                    </tr>
                                                :
                                                null
                                            }
                                        </tbody>
                                    </table>
                                : null
                            }
                            {
                                items !== {} && polygon && polygon.length > 0
                                ?
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th className="text-center" colSpan="2" style={{fontSize: '20px'}}>
                                                    <i className="fa fa-location-arrow mr-2" aria-hidden="true">
                                                    </i>Давхаргын мэдээлэл
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <i className="fa fa-map mr-2" aria-hidden="true"></i>Давхаргын нэр
                                                </th>
                                                <th>
                                                    <i className="fa fa-money mr-2" aria-hidden="true"></i>Давхаргын үнэ
                                                </th>
                                            </tr>
                                                {
                                                    layers.map((value, key) =>
                                                        <tr key={key}>
                                                            <td>
                                                                <label>{value.name}</label>
                                                            </td>
                                                            <td>
                                                                <label>{value.amount}₮</label>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            <tr>
                                                <td><i className="fa fa-calendar-o mr-2" aria-hidden="true"></i>Огноо:</td>
                                                <td>{items.created_at}</td>
                                            </tr>
                                            {
                                                items.is_success && items.export_file !== null ?
                                                    <tr>
                                                        <td><i className="fa fa-download mr-2" aria-hidden="true"></i>Татах:</td>
                                                        <td>
                                                            <a className="text-info" href={`/payment/download-zip/${payment_id}/`}>
                                                                Энд дарж татаж авна уу!
                                                            </a>
                                                        </td>
                                                    </tr>
                                                : null
                                            }
                                        </tbody>
                                </table>
                            :
                                null
                        }
                        </div>
                        {
                            !is_loading && (polygon.length > 0 || points.length > 0) &&
                            <div className="row py-3">
                                <div className="col-md-6 py-0 my-3">
                                    <div id="payment">
                                        <h5 className="mb-3">Гүйлгээний төлөв</h5>
                                        <ul className="list-unstyled">
                                            <li className="f-nav-item mb-2">
                                                Гүйлгээний дугаар | {items.geo_unique_number}
                                            </li>
                                            <li className="f-nav-item mb-2">
                                                НИЙТ МӨНГӨН ДҮН | {items.total}₮
                                            </li>
                                            <li className="f-nav-item mb-2">
                                                Үр дүн | {items.is_success ? <span className="text-success">Амжилттай</span> : <span className="text-danger">Амжилтгүй</span>}
                                            </li>
                                        </ul>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => {
                                        const mywindow = window.open('', 'PRINT', 'height=400, width=600');
                                        mywindow.document.write('<html><body>');
                                        mywindow.document.write(document.getElementById("container").innerHTML)
                                        mywindow.document.write(document.getElementById("payment").innerHTML)
                                        mywindow.document.write('</body></html>');
                                        mywindow.document.close()
                                        mywindow.focus()
                                        mywindow.print()
                                        mywindow.close();
                                    }}>Хэвлэх</button>
                                </div>
                                {
                                    !items.is_success ?
                                    <div className="col-md-6 py-0 my-3">
                                        <h5 className="mb-3">QR Code </h5>
                                        <img src="/static/assets/image/lavlakh.png"></img>
                                    </div>
                                    : null
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
