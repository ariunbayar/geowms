
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
                <div className="col-md-12 py-0">
                    <table className="table table-bordered">
                         <thead>
                            <tr>
                                <th scope="col">№</th>
                                <th scope="col">#</th>
                                <th scope="col">Дугаар</th>
                                <th scope="col">Хэмжээ(Amount)</th >
                                <th scope="col">Танилцуулга (description)</th >
                                <th scope="col">created_at</th >
                                <th scope="col">is_success</th >
                                <th scope="col">success_at</th >
                                <th scope="col">bank_unique_number</th >
                            </tr>
                        </thead>
                        <tbody>
                        { payment_length ===0 ?
                                    <tr><td>Худалдан авалт бүртгэлгүй байна</td></tr>:

                                    payment.map((p, idx) =>
                                        <HistoryTable
                                            key={idx}
                                            idx={(this.state.currentPage*25)-25+idx+1}
                                            values={p}
                                        >
                                        </HistoryTable>

                                )}
                        </tbody>
                       </table>
                       <Pagination
                        paginate = { this.paginate }
                         />
                    </div>
                  </div>
            </div>
        )
    }
}
