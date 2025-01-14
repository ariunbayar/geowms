import React, { Component } from "react"
import {service} from '../service'

export class Failed extends Component {

    constructor(props) {
        super(props)

        this.state = {
            purchase_all: [],
            check_error: false,
            error_msg: '',
            point_data: [],
        }
    }

    componentDidMount(){
        const purchase_id = this.props.match.params.id

        service.purchaseAll(purchase_id).then(({ success, purchase_all, point_data, msg  }) => {
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

    render() {
        const { purchase_all, check_error, error_msg, point_data } = this.state
        return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 py-0 my-3">
                    {
                        check_error
                        ?
                            <div className="alert alert-danger position-absolute float-right mr-3" style={{right: "0"}} role="alert">{error_msg}</div>
                        :
                            <div></div>
                    }
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
                                <td><a className="text-info" href={`/media/tseg-personal-file/${purchase_all.pdf}.pdf`}>файл</a></td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Өндөр</td>
                                <td>{purchase_all.undur}</td>
                            </tr>
                            <tr>
                                <td><i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>Төлбөр</td>
                                <td>{point_data.map((value,key)=><b key={key}>{'"' + value.amount + '" '}</b>)}₮</td>
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
                            Гүйлгээний дугаар | {purchase_all.geo_unique_number}
                        </li>
                        <li className="f-nav-item mb-2">
                            НИЙТ МӨНГӨН ДҮН | {purchase_all.total_amount}₮
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
