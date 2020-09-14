import React, { Component } from "react"
import {Details} from './details'
import {Link} from "react-router-dom"
import {service} from '../service'

export class HistoryTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            export_file: false,
        }
        this.handleDownload = this.handleDownload.bind(this)

    }

    handleDownload(payment_id){

        setTimeout(()=>{
            this.setState({form_is_loading: true})
        }
        , 2000)
        // service.downloadPurchase(payment_id).then(({success}) => {
            // this.setState({form_is_loading: false})
        // })
    }

    render() {
        const idx = this.props.idx
        const form_is_loading = this.state.form_is_loading
        const {id, geo_unique_number, total_amount, description, created_at, is_success, success_at, bank_unique_number, export_file}=this.props.values
        return (
            <div className="col-4 my-2">
                <div className="card">
                    <div className="card-body">
                        <Link to={`/profile/all/api/details/${id}/`}>
                            <h5>
                                { is_success
                                    ?
                                        <i className="fa fa-check-circle text-success"></i>
                                    :
                                        <i className="fa fa-exclamation-triangle text-warning"></i>
                                }
                                &nbsp; {description}
                            </h5>
                        </Link>
                        <p className="card-text">{geo_unique_number}</p>
                        <p className="card-text">Нийт үнэ: {total_amount}₮</p>
                        <p className="card-text text-muted">{created_at}</p>
                        {
                            export_file
                            ?
                            null
                            :
                            <a className="btn gp-outline-primary" href='#' onClick={e => this.handleDownload(id)}>shp файл үүсгэх</a>
                        }
                        {
                            export_file
                            ?
                            <a className="btn gp-btn-primary" href={`/payment/download-zip/${id}/`}>Файл</a>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        )
    }
}