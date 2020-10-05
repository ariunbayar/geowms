import React, { Component } from "react"
import {LogFormTable} from './LogFormTable'
import {service} from './service'
import { Pagination } from "../../../../../src/components/Pagination/index"

export class LogForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            payment_all:[],
            pay_legth:null,
            currentPage:1,
            payPerPage:100,
            searchQuery:''
        }
        this.paginate = this.paginate.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.payPerPage
        this.setState({ currentPage: page })
            return service
                .payList(page, perpage, query)
                .then(page => {
                    this.setState({ payment_all: page.items, pay_legth: page.items.length})
                    return page
                })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
    }

    render() {
        const {payment_all, pay_legth} = this.state
        return (
            <>
                <div className="card">
                    <div className="card-body">
                        <div className="row justify-content-between">
                            <h5 className="mb-4 ml-4">Гүйлгээний хуулга</h5>
                            <div className="col-md-4  mb-1">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchQuery"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch('searchQuery', e)}
                                    value={this.state.searchQuery}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Хэрэглэгч</th>
                                        <th scope="col">Амжилттай/Амжилтгүй</th>
                                        <th scope="col">Нийт дүн</th>
                                        <th scope="col">Тодорхойлолт</th>
                                        <th scope="col">Код</th>
                                        <th scope="col">Мэдэгдэл</th>
                                        <th scope="col">Дата ID</th>
                                        <th scope="col">Банкны дугаар</th>
                                        <th scope="col">Гео дугаар</th>
                                        <th scope="col">Огноо</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pay_legth === 0 ?
                                    <tr><td>Мэдээлэл байхгүй байна</td></tr>:
                                    payment_all.map((pay, idx) =>
                                        <LogFormTable
                                            key = {idx}
                                            idx = {idx}
                                            values={pay}>
                                        </LogFormTable>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            paginate = {this.paginate}
                            searchQuery = {this.state.searchQuery}
                        />
                    </div>
                </div>
            </>
        )
    }
}