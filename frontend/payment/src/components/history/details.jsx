import React, { Component } from "react"
import { service } from "./service"
import { NavLink } from "react-router-dom"
import { Notif } from '../../../../../src/components/Notification/index'

export class Details extends Component {

    constructor(props) {
        super(props)
        this.too = 0
        this.state = {
            items: {},
            points: [],
            polygon: [],
            layers: [],
            payment_id: this.props.match.params.id,
        }
        this.addNotif = this.addNotif.bind(this)
    }

    componentDidMount(){
        const id = this.state.payment_id
        service.getDetails(id).then(({success, items, points, polygon, layers}) => {
            if(success){
                items.map(( items ) =>
                    this.setState({items})
                )
                this.setState({points, polygon, layers})
            }
            else {
                this.addNotif('danger', 'Мэдээлэл олдсонгүй', 'times')
            }
        }).catch(error => console.log(error))
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
        const { items, points, polygon, layers, payment_id } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 py-0 my-3">
                        <NavLink to="/payment/history/" className="btn mt-2 gp-outline-primary">
                            Буцах
                        </NavLink>
                        <br></br>
                        <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
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
                                            <tr>
                                                <td ><i className="fa fa-map mr-2" aria-hidden="true"></i>Цэгийн нэр</td>
                                                <td>
                                                    {
                                                       points.length > 0 && points.map((value, key) => <b key={key}>{'"'+ value.name + '" '}</b>)
                                                    }
                                                    {items.point_name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Аймаг</td>
                                                <td>{items.mpoint_aimag}</td>
                                            </tr>
                                            <tr>
                                                <td><i className="fa fa-map-marker mr-2" aria-hidden="true"></i>Сум</td>
                                                <td>{items.mpoint_sum}</td>
                                            </tr>
                                            <tr>
                                                <th style={{textAlign: "center"}} colSpan="2" scope="rowgroup"><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Цэгийн мэдээлэл</th>
                                            </tr>
                                            <tr>
                                                <th style={{textAlign: "center"}} scope="3">
                                                    Цэгийн нэр
                                                </th>
                                                <th style={{textAlign: "center"}} scope="3">
                                                    Файл
                                                </th>
                                            </tr>
                                            <tr>
                                                <td scope="">
                                                    {
                                                        points.length > 0 && points.map((value, key) => <li className="list-group-item" style={{textAlign: "center"}} key={key}>{value.name}</li>)
                                                    }
                                                </td>
                                                <td scope="">
                                                    <div>
                                                    {
                                                        points.length > 0 && points.map((value, key) => <li className="list-group-item" style={{textAlign: "center"}} key={key}>
                                                            <a className="text-info" href={`/payment/download-pdf/${value.file_name}/`}>файл</a></li>)
                                                    }
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i className="fa fa-money mr-2" aria-hidden="true"></i>Төлбөр:</td>
                                                <td>{points.length > 0 && points.map((value,key)=><b key={key}>{'"' + value.amount + '" '}</b>)}₮</td>
                                            </tr>
                                            <tr>
                                                <td><i className="fa fa-calendar-o mr-2" aria-hidden="true"></i>Огноо:</td>
                                                <td>{items.created_at}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                : null
                            }
                            {
                                items !== {} && polygon.length > 0 && polygon ?
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
                                                        <td><a className="text-info" href={`/payment/download-zip/${payment_id}/`}>Энд дарж татаж авна уу!</a></td>
                                                    </tr>
                                                : null
                                            }
                                        </tbody>
                                    </table>
                                : null
                            }
                        </div>
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
                    </div>
                </div>
            </div>
        )
    }
}