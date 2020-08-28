import React, { Component } from "react"
import {PageLogTable} from './PageLogTable'
import {Charts} from './Chart'
import {PieChart} from './PieChart'
import {service} from "../service"
import { Pagination } from "../../pagination/pagination"

export class PageLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            page_logs: [],
            log_length:null,
            currentPage:1,
            logPerPage:100,
            searchQuery: '',
            searchIsLoad: false,
        }
        this.paginate = this.paginate.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    paginate (page,query) {
        const perpage = this.state.logPerPage
        this.setState({ currentPage: page })
            return service
                .pageList(page, perpage, query)
                .then(page => {
                    this.setState({ page_logs: page.items })
                    return page
                })
    }

    handleSearch (field, e) {
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
        const { page_logs, log_length } = this.state
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын төхөөрөмжийн тоогоор</h5>
                            <PieChart></PieChart>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>
                    <h5 className="mb-3">Нэвтэрч орсон мэдээлэл</h5>
                    <div className="form-row text-right">
                        <div className="form-group col-md-8">
                            <label htmlFor="searchQuery">Хайх:</label>
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
                    <div className="row rounded">
                        <div className="col-md-12">
                            <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Хаяг</th>
                                        <th scope="col">Method</th>
                                        <th scope="col">IP Хаяг</th >
                                        <th scope="col">Хэрэглэгчийн дугаар</th >
                                        <th scope="col">Огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    {log_length === 0 ?
                                    <tr><td>Хандалт байхгүй байна </td></tr>:
                                    page_logs.map((page, idx) =>
                                        <PageLogTable 
                                            key = {idx} 
                                            idx = {(this.state.currentPage*100)-100+idx+1} 
                                            values={page}>
                                        </PageLogTable>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination
                        paginate = {this.paginate}
                        searchQuery = {this.state.searchQuery}
                    />
                </div>
            </div>
        )

    }

}