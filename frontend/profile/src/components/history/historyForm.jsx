
import React, { Component } from "react"
import {service} from '../service'
import {HistoryTable} from './historyTable'
import { Pagination } from "../../../../pagination/pagination"


export default class HistoryForm extends Component {

    constructor(props) {
        super(props)
        this.state={
            payment:[],
            payment_length:null,
            currentPage:1,
            paymentPerPage:25,
        }
        this.paginate = this.paginate.bind(this)
        this.handleDownload = this.handleDownload.bind(this)

    }

    handleDownload(payment_id){
        service.downloadPurchase(payment_id).then(({download_url}) => {
            console.log(download_url)
        })
    }

    paginate (page) {
        const perpage = this.state.paymentPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage)
                .then(page => {
                    this.setState({payment: page.items })
                    return page
                })
    }
    render() {
        const {payment,payment_length} = this.state
        return (
        <div className="container">
            <div className="row">
                { payment_length ===0 ?
                            <tr><td>Худалдан авалт бүртгэлгүй байна</td></tr>:
                            payment.map((p, idx) =>
                                <HistoryTable
                                    key={idx}
                                    idx={(this.state.currentPage*25)-25+idx+1}
                                    handleDownload={e => this.handleDownload(p.id)}
                                    values={p}
                                >
                                </HistoryTable>
                        )}
            </div>
            <Pagination paginate = { this.paginate }/>
        </div>
        )
    }
}
