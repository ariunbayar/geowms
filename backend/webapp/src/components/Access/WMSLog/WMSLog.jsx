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
    paginate (page, query, sort_name) {
        const perpage = this.state.wms_log_per_page
        this.setState({ currentPage: page })
            return service
                .WMSLogList(page, perpage, query, sort_name)
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
                    <div className="search-bar">
                        <input
                            type="text"
                            className="form-control"
                            id="searchQuery small-input"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={this.state.searchQuery}
                        />
                        <a><i className="icon-magnifier"></i></a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="table-responsive table_wrapper">
                            <table className="table table_wrapper_table">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th><a onClick={() => this.handleSort('qs_all', this.state.qs_all)}>qs_all <i className={this.state.qs_all ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('qs_request', this.state.qs_request)}>qs_request <i className={this.state.qs_request ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('rsp_status', this.state.rsp_status)}>rsp_status <i className={this.state.rsp_status ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('rsp_size', this.state.rsp_size)}>rsp_size <i className={this.state.rsp_size ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('created_at', this.state.created_at)}>Нэвтэрсэн огноо <i className={this.state.created_at ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('system_id', this.state.system_id)}>Системийн ID <i className={this.state.system_id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('wms_id', this.state.wms_id)}>WMS ID <i className={this.state.wms_id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
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
                            sort_name = {this.state.sort_name}
                            />
                    </div>
                </div>
            </div>
        )
    }
}
