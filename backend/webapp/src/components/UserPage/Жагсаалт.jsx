import React, { Component } from "react"
import "./style.css"
import {service} from './service'
import User from './User'
import { toSize } from "ol/size"
import { Pagination } from "../../../../../src/components/Pagination/index"

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)
        this.state = {
            user_list: [],
            user_length:null,
            currentPage:1,
            usersPerPage:20,
            searchQuery: '',
            query_min: false,
            search_load: false,
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
        const perpage = this.state.usersPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query, sort_name)
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
                    <div className="card">
                        <div className="card-body">
                            <div className="float-right search-bar mr-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchQuery"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch('searchQuery', e)}
                                    value={this.state.searchQuery}
                                />
                                <a><i className="icon-magnifier"></i></a>
                            </div>
                            <div className="my-4">
                                <div className="p-3">
                                    <div className="table-responsive table_wrapper">
                                        <table className="table table_wrapper_table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">№</th>
                                                    <th><a onClick={() => this.handleSort('first_name', this.state.first_name)}>Нэр <i className={this.state.first_name ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                                    <th><a onClick={() => this.handleSort('email', this.state.email)}>Цахим шуудан <i className={this.state.email ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
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
                                    sort_name = {this.state.sort_name}
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