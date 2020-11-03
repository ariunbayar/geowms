import React, { Component } from "react"
import {Charts} from './Chart'
import {service} from "../service"
import {LoginLogTable} from './LoginLogTable'
import { Pagination } from "../../../../../../src/components/Pagination/index"


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
    }

    paginate (page, query) {
        const perpage = this.state.loginPerPage
        this.setState({ currentPage: page })
            return service
                .loginList(page, perpage, query)
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
                <div className="col-sm-6">
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
                    <div className="table-responsive table_wrapper">
                        <table className="table table_wrapper_table">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Хэрэглэгчийн нэр</th>
                                    <th scope="col">Хэрэглэгчийн үйлдэл</th>
                                    <th scope="col">Хэрэглэгчийн дугаар</th>
                                    <th scope="col">IP Хаяг</th>
                                    <th scope="col">Нэвтэрсэн огноо</th >
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
                    />
                </div>
            </div>

           </div>
        )

    }
}