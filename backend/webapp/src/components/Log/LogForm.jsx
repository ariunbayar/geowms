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
            searchQuery:'',
        }
        this.paginate = this.paginate.bind(this)
        this.handleSort = this.handleSort.bind(this)
    }

    paginate (page, query, sort_name) {
        const perpage = this.state.payPerPage
        this.setState({ currentPage: page })
            return service
                .payList(page, perpage, query, sort_name)
                .then(page => {
                    this.setState({ payment_all: page.items, pay_legth: page.items.length})
                    return page
                })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value, 'total_amount')
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value, 'total_amount')
        }
    }

    handleSort(sort_name, sort_type) {
        if(sort_type){
            this.setState({[sort_name]: false, sort_name})
            this.paginate(this.state.currentPage, this.state.searchQuery, sort_name)
        }else{
            this.setState({[sort_name]: true, sort_name: '-'+sort_name})
            this.paginate(this.state.currentPage, this.state.searchQuery, '-'+sort_name)
        }
    }

    render() {
        const {payment_all, pay_legth } = this.state
        return (
                <div className="card">
                    <div className="card-body">
                        <div className="row justify-content-between">
                            <h5 className="mb-4 ml-4">Гүйлгээний хуулга</h5>
                            <div className="mb-1 mr-3 search-bar">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchQuery"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch('searchQuery', e)}
                                    value={this.state.searchQuery}
                                />
                                <a><i class="icon-magnifier"></i></a>

                            </div>
                        </div>
                        <div className="table-responsive table_wrapper">
                            <table className="table table_wrapper_table">
                                <thead>
                                    <tr>
                                        <th><a>№</a></th>
                                        <th><a onClick={() => this.handleSort('user_id', this.state.user_id)}>Хэрэглэгч <i class={this.state.user_id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a>Төлөв</a></th>
                                        <th><a onClick={() => this.handleSort('total_amount' ,this.state.total_amount)}>Нийт дүн <i class={this.state.total_amount ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('description' ,this.state.description)}>Тодорхойлолт <i class={this.state.description ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('code' ,this.state.code)}>Код <i class={this.state.code ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('message' ,this.state.message)}>Мэдэгдэл <i class={this.state.message ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('data_id' ,this.state.data_id)}>Дата ID <i class={this.state.data_id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('bank_unique_number' ,this.state.bank_unique_number)}>Банкны дугаар <i class={this.state.bank_unique_number ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('geo_unique_number' ,this.state.geo_unique_number)}>Гео дугаар <i class={this.state.geo_unique_number ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('success_at' ,this.state.success_at)}>Огноо <i class={this.state.success_at ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
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
                            sort_name = {this.state.sort_name}
                            searchQuery = {this.state.searchQuery}
                        />
                    </div>
                </div>
        )
    }
}