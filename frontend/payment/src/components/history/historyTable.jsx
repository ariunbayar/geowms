import React, { Component } from "react"
import {Link} from "react-router-dom"
import {service} from '../service'

export class HistoryTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            export_state: this.props.values.export_file ? 'success' : '',
        }
        this.handleDownload = this.handleDownload.bind(this)
    }

    handleDownload(payment_id){

        this.setState({ export_state: 'loading' })

        service.downloadPurchase(payment_id).then(({success}) => {
            this.setState({
                export_state: 'success',
            })
        })
    }

    render() {
        const {id, geo_unique_number, total_amount, description, created_at, is_success, success_at, bank_unique_number} = this.props.values
        const { export_state } = this.state

        return (
            <div className="col-4 my-2">
                <div className="card">
                    <div className="card-body">
                        <Link to={`/payment/history/api/details/${id}/`}>
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

                        {export_state == 'loading' &&
                            <button className="btn gp-outline-primary">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                {} Түр хүлээнэ үү...
                            </button>
                        }

                        {export_state == 'success' &&
                            <a href={`/payment/download-zip/${id}/`}>Энд дарж татаж авна уу!</a>
                        }
                    </div>
                </div>
            </div>
        )
    }
}