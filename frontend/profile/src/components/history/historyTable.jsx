import React, { Component } from "react"

export class HistoryTable extends Component {
    render() {
        const idx = this.props.idx
        const {id, geo_unique_number, total_amount, description, created_at, is_success, success_at, bank_unique_number}=this.props.values
        return (
            <div className="col-4 my-2">
                <div class="card">
                    <div class="card-body">
                        <h5 class={ is_success ? "card-title text-success" : "card-title text-danger"}>{geo_unique_number}</h5>
                        <p class="card-text">{description}</p>
                        <p class="card-text">Нийт үнэ {total_amount}</p>
                        <a className="btn gp-btn-primary" href='#' onClick={this.props.handleDownload}>Татах</a>
                    </div>
                </div>
            </div>
        )
    }
}