import React, { Component } from 'react'
import {service} from "../service"
import { Pagination } from "../../../../../../src/components/Pagination/index"
import {Charts} from './Chart'
import { WMSLogTable } from './WMSLogTable'

export default class WMSLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            wms_log_display: [],
            wms_log_length:null,
            currentPage:1,
            wms_log_per_page:20,
            searchQuery: '',
            searchIsLoad: false,
        }
        this.paginate = this.paginate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.wms_log_per_page
        this.setState({ currentPage: page })
            return service
                .WMSLogList(page, perpage, query)
                .then(page => {
                    this.setState({ wms_log_display: page.items, wms_log_length: page.items.length })
                    return page
                })
    }

    handleSearch(field, e) {
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
        const { wms_log_display, currentPage, wms_log_length, wms_log_per_page } = this.state
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <h5 className="text-uppercase text-center">Хандалтын тоогоор</h5>
                        <div className="card-body">
                            <Charts/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 ">
                        <hr />
                    </div>
                </div>
                <h5 className="mb-3 text-center text-uppercase">WMS url ашиглан хандалт хийсэн логийн тэмдэглэл</h5>
                <div className="row">
                    <div className="col-sm-4">
                        <input
                            type="text"
                            className="form-control m-1"
                            id="searchQuery small-input"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={this.state.searchQuery}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col" className="text-wrap">qs_all</th>
                                        <th scope="col">qs_request</th>
                                        <th scope="col">rsp_status</th>
                                        <th scope="col">rsp_size</th>
                                        <th scope="col">Нэвтэрсэн огноо</th >
                                        <th scope="col">Системийн ID</th>
                                        <th scope="col">WMS  ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { wms_log_length === 0 ?
                                    <tr><td>Нэвтрэлтийн хандалд байхгүй байна </td></tr>:
                                    wms_log_display.map((wms_login, idx) =>

                                        <WMSLogTable
                                            key = {idx}
                                            idx = {(currentPage*wms_log_per_page)-wms_log_per_page+idx+1}
                                            values={wms_login}>
                                        </WMSLogTable>
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
            </div>
        )
    }
}
