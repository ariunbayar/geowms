import React, { Component } from "react"
import { service } from "./service"
import { NavLink } from "react-router-dom"

export class Details extends Component {

    constructor(props) {
        super(props)

        this.state = {
            items: [],
            check_error: false,
            error_msg: '',
            points: [],
            payment_id: this.props.match.params.id,
            check_info: false,
        }
    }

    componentDidMount(){
        const id = this.state.payment_id
        service.getDetails(id).then(({success, items, points}) => {
            if(success){
                items.map(( items ) =>
                    this.setState({items})
                )
                this.setState({points})
            }
            else{
                this.setState({ check_info: !success })
            }
        }).catch(error => console.log(error))
    }

    render() {
        const { items, check_error, error_msg, points, check_info } = this.state
        console.log(items)
        return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 py-0 my-3">
                    <NavLink to="/profile/all/" className="btn mt-2 gp-outline-primary">
                        Буцах
                    </NavLink>
                    {
                        check_info
                        ?
                            <div className="alert alert-danger position-absolute float-right mr-3" style={{right: "0"}} role="alert">Мэдээлэл байхгүй байна</div>
                        :
                            <div></div>
                    }
                    <h5 className="mb-3">hha</h5>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td ><i className="fa fa-map mr-2" aria-hidden="true"></i>Цэгийн нэр</td>
                                <td>
                                    {
                                        points.map((value, key) => <b key={key}>{'"'+ value.name + '" '}</b>)
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
                                        points.map((value, key) => <li className="list-group-item" style={{textAlign: "center"}} key={key}>{value.name}</li>)
                                    }
                                </td>
                                <td scope="">
                                    <div>
                                    {
                                        points.map((value, key) => <li className="list-group-item" style={{textAlign: "center"}} key={key}>
                                            <a className="text-info" href={`/payment/download-pdf/${this.state.payment_id}/`}>файл</a></li>)
                                    }
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Төлбөр</td>
                                <td>{points.map((value,key)=><b key={key}>{'"' + value.amount + '" '}</b>)}₮</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Огноо:</td>
                                <td>{items.created_at}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="row py-3">
                        <div className="col-md-6 py-0 my-3">
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
                            <button className="btn btn-primary">Хэвлэх</button>
                        </div>
                        <div className="col-md-6 py-0 my-3">
                            <h5 className="mb-3">QR Code </h5>
                            <img src="/static/assets/image/lavlakh.png"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
