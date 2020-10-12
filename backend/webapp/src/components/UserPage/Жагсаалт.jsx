import React, { Component } from "react"
import "./style.css"
import {service} from './service'
import User from './User'
import { toSize } from "ol/size"
import { Pagination } from "../../../../../src/components/Pagination/index"

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)
        this.too = 0
        this.state = {
            user_list: [],
            user_length:null,
            currentPage:1,
            usersPerPage:10,
            searchQuery: '',
            query_min: false,
            search_load: false,
            }
        this.paginate = this.paginate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.addNotif = this.addNotif.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.usersPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query)
                .then(page => {
                    this.setState({user_list: page.items , user_length:page.items.length})
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
        const { user_list, user_length, usersPerPage } = this.state
        return (
            <div className="row">
                <div className="col-md-12">
                <button type="button" className="btn btn-danger" onClick={(e) => this.addNotif(e)}></button>
                    <div className="card">
                        <div className="card-body">
                            <div className="col-md-4 float-right">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchQuery"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch('searchQuery', e)}
                                    value={this.state.searchQuery}
                                />
                            </div>
                            <div className="my-4">
                                <div className="p-3">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">№</th>
                                                    <th scope="col">Нэр</th>
                                                    <th scope="col">Цахим шуудан</th>
                                                    <th scope="col">Хэрэглэгчийн эрх</th>
                                                    <th scope="col">Идэвхтэй эсэх</th>
                                                    <th scope="col">ДАН системээр баталгаажсан эсэх</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {user_length === 0 ?
                                                    <tr><td>Хэрэглэгч бүртгэлгүй байна </td></tr>:
                                                    user_list.map((values,index) =>
                                                        <User
                                                            key={values.id}
                                                            values={values}
                                                            idx={(this.state.currentPage*usersPerPage)-usersPerPage+index+1}
                                                        />
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="pl-4">
                                <Pagination
                                    paginate = { this.paginate }
                                    searchQuery = { this.state.searchQuery }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}