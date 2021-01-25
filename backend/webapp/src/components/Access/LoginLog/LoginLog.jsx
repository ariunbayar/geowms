import React, { Component } from "react"
import {Charts} from './Chart'
import {service} from "../service"
import {LoginLogTable} from './LoginLogTable'
import { Pagination } from "@utils/Pagination"


export class LoginLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login_log_all: [],
            login_length:null,
            currentPage:1,
            loginPerPage:20,
            searchQuery: '',
            query_min: false,
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
        const perpage = this.state.loginPerPage
        this.setState({ currentPage: page })
            return service
                .loginList(page, perpage, query, sort_name)
                .then(page => {
                    this.setState({ login_log_all: page.items, login_length: page.items.length })
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
        const { login_log_all,currentPage, login_length, loginPerPage } = this.state
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
            <h5 className="mb-3 text-center text-uppercase">Хэрэглэгчийн оролт гаралтын тэмдэглэл</h5>
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
            <div className="row my-2">
                <div className="col-lg-12">
                    <div className="table-responsive table_wrapper">
                        <table className="table table_wrapper_table">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th><a onClick={() => this.handleSort('username', this.state.username)}>Хэрэглэгчийн нэр <i className={this.state.username ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                    <th><a onClick={() => this.handleSort('login_type', this.state.login_type)}>Хэрэглэгчийн үйлдэл <i className={this.state.login_type ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                    <th><a onClick={() => this.handleSort('user_id', this.state.user_id)}>Хэрэглэгчийн дугаар <i className={this.state.user_id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                    <th><a onClick={() => this.handleSort('remote_ip', this.state.remote_ip)}>IP Хаяг <i className={this.state.remote_ip ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                    <th><a onClick={() => this.handleSort('datetime', this.state.datetime)}>Нэвтэрсэн огноо <i className={this.state.datetime ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                </tr>
                            </thead>
                            <tbody>
                                { login_length === 0 ?
                                <tr><td>Нэвтрэлтийн хандалд байхгүй байна </td></tr>:
                                login_log_all.map((login, idx) =>

                                    <LoginLogTable
                                        key = {idx}
                                        idx = {(currentPage*loginPerPage)-loginPerPage+idx+1}
                                        values={login}>
                                    </LoginLogTable>
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
