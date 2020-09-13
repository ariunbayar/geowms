import React, { Component } from "react"

export class HistoryTable extends Component {
    render() {
        const idx = this.props.idx
        const {id, geo_unique_number, total_amount, description, created_at, is_success, success_at, bank_unique_number, export_file}=this.props.values
        return (
            <div className="col-4 my-2">
                <div class="card">
                    <div class="card-body">
                        <h5 class={ is_success ? "card-title text-success" : "card-title text-danger"}>{geo_unique_number}</h5>
                        <p class="card-text">{description}</p>
                        <p class="card-text">Нийт үнэ {total_amount}</p>
                        {export_file &&
                            <a className="btn gp-btn-primary" href={`/payment/download-zip/${id}/`}>Татах</a>
                        }
                        {!export_file &&
                            <div>
                                {this.props.form_is_loading ?
                                    <button className="btn gp-btn-primary" onClick={this.handleForm}>
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only"></span>
                                        </div>
                                        {} Түр хүлээнэ үү...
                                    </button> :
                                    <a className="btn gp-btn-primary" href='#' onClick={this.props.handleDownload}>shp файл үүсгэх</a>
                                }
                            </div>

                        }
                    </div>
                </div>
            </div>
        )
    }
}