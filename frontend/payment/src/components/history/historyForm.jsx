
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
            paymentPerPage:12,
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
                    this.setState({payment: page.items , payment_length:page.items.length})
                    return page
                })
    }
    render() {
        const {payment,payment_length} = this.state
        const {is_loading} = this.props
        return (
            <div className="card">
                <div className="card-body">
                    {
                        is_loading ?
                        <div className="container pt-0">
                            <div className="row">
                                <div className="d-flex justify-content-center">
                                    <div className="fa fa-spinner fa-pulse fa-3x fa-fw">
                                        <br/>Уншиж байна.
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="modal-body">
                            <div className="container pt-0">
                                <div className="row">
                                    { payment_length ===0 ?
                                        <tr><td>Худалдан авалт бүртгэлгүй байна</td></tr>:
                                            payment.map((p, idx) =>
                                                <HistoryTable
                                                    key={idx}
                                                    values={p}
                                                >
                                                </HistoryTable>
                                            )
                                    }
                                </div>
                                {payment_length !=0 &&
                                    <Pagination paginate = { this.paginate }/>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
