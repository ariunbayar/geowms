
import React, { Component } from "react"
import { HistoryTable } from './historyTable'
import { Pagination } from "../../../../pagination/pagination"

import { service } from '../service'

export default class HistoryForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            payment: [],
            payment_length: null,
            currentPage: 1,
            paymentPerPage: 12,
            is_loading: true,
        }
        this.paginate = this.paginate.bind(this)

    }

    paginate (page) {
        const perpage = this.state.paymentPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage)
                .then(page => {
                    this.setState({ payment: page.items , payment_length:page.items.length, is_loading: false })
                    return page
                })
    }

    render() {
        const { payment, payment_length, is_loading } = this.state
        return (
            <div className="card-body">
                <div className="container pt-0">
                    {
                        is_loading
                        ?
                            <div className="container pt-0">
                                <div className="d-flex justify-content-center">
                                    <div className="fa fa-spinner fa-pulse fa-3x fa-fw">
                                    </div>
                                </div>
                            </div>
                        :
                            <div className="row">
                                {
                                    payment_length === 0
                                    ?
                                        <tr><td>Худалдан авалт бүртгэлгүй байна</td></tr>
                                    :
                                        payment.map((p, idx) =>
                                            <HistoryTable
                                                key={idx}
                                                values={p}
                                            />
                                        )
                                }
                            </div>
                    }
                    {
                        payment_length != 0
                        &&
                            <Pagination paginate = { this.paginate }/>
                    }
                </div>
            </div>
        )
    }
}
