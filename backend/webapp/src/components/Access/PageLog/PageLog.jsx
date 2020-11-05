import React, { Component } from "react"
import {PageLogTable} from './PageLogTable'
import {Charts} from './Chart'
import {PieChart} from './PieChart'
import {service} from "../service"
import { Pagination } from "../../../../../../src/components/Pagination/index"

export class PageLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            page_logs: [],
            log_length:null,
            currentPage:1,
            logPerPage:20,
            searchQuery: '',
            searchIsLoad: false,
        }
        this.paginate = this.paginate.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleSort = this.handleSort.bind(this)
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
    paginate (page,query, sort_name) {
        const perpage = this.state.logPerPage
        this.setState({ currentPage: page })
            return service
                .pageList(page, perpage, query, sort_name)
                .then(page => {
                    this.setState({ page_logs: page.items, log_length: page.items.length })
                    return page
                })
    }

    handleSearch (field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
    }

    render() {
        const { page_logs, log_length, currentPage, logPerPage } = this.state
        return (
            <>
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="text-uppercase text-center">
                            Хандалтын тоогоор
                        </h5>
                        <Charts></Charts>
                    </div>
                    <div className="col-md-6">
                        <h5 className="text-uppercase text-center">Хандалтын төхөөрөмжийн тоогоор</h5>
                        <PieChart></PieChart>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                    </div>
                </div>
                <h5 className="mb-3 text-center text-uppercase">Нэвтэрч орсон мэдээлэл</h5>
                <div className="row">
                    <div className="search-bar">
                        <input
                            type="text"
                            className="form-control"
                            id="searchQuery small-input"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={this.state.searchQuery}
                        />
                        <a><i class="icon-magnifier"></i></a>
                    </div>
                </div>
                <div className="table-responsive table_wrapper my-2">
                    <table className="table example table_wrapper_table" id="example">
                        <thead>
                            <tr>
                                <th scope="col">№</th>
                                <th><a onClick={() => this.handleSort('url', this.state.url)}>Хаяг <i class={this.state.url ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                <th><a onClick={() => this.handleSort('method', this.state.method)}>Method <i class={this.state.method ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                <th><a onClick={() => this.handleSort('remote_ip', this.state.remote_ip)}>IP Хая <i class={this.state.remote_ip ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                <th><a onClick={() => this.handleSort('user_id', this.state.user_id)}>Хэрэглэгчийн дугаар <i class={this.state.user_id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                <th><a onClick={() => this.handleSort('datetime', this.state.datetime)}>Огноо <i class={this.state.datetime ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                            </tr>
                        </thead>
                        <tbody>
                            {log_length === 0 ?
                            <tr><td>Хандалт байхгүй байна </td></tr>:
                            page_logs.map((page, idx) =>
                                <PageLogTable
                                    key = {idx}
                                    idx = {(currentPage*logPerPage)-logPerPage+idx+1}
                                    values={page}>
                                </PageLogTable>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    paginate = {this.paginate}
                    searchQuery = {this.state.searchQuery}
                    sort_name = {this.state.sort_name}
                    />
            </>
        )

    }

}