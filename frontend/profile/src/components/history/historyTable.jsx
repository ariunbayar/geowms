import React, { Component } from "react"
import {Details} from './details'
import {Link} from "react-router-dom"

export class HistoryTable extends Component {
    render() {
        const idx = this.props.idx
        const {id, geo_unique_number, total_amount, description, created_at, is_success, success_at, bank_unique_number}=this.props.values
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
                            is_success
                            ?
                            <a className="btn gp-outline-primary" href='#' onClick={this.props.handleDownload}>Татах</a>
                            :
                            null
                        }
                        {
                            is_success
                            ?
                            <a className="btn gp-outline-primary float-right" href={`/payment/download-pdf/${id}/`}>Файл</a>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        )
    }
}