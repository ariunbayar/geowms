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
    }

    paginate (page,query) {
        const perpage = this.state.logPerPage
        this.setState({ currentPage: page })
            return service
                .pageList(page, perpage, query)
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
                <div className="form-row text-right">
                    <div className="form-group col-md-6">
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
                />
            </>
        )

    }

}