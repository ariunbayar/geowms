import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import { Pagination } from "../../../../../src/components/Pagination/index"
import {service} from "./service"
import {ListTable} from "./ListTable"



export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list_data: [],
            list_length:null,
            current_page:1,
            page_len:20,
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
            this.paginate(this.state.current_page, this.state.searchQuery, sort_name)
        }else{
            this.setState({[sort_name]: true, sort_name: '-'+sort_name})
            this.paginate(this.state.current_page, this.state.searchQuery, '-'+sort_name)
        }
    }

    paginate (page, query, sort_name) {
        const perpage = this.state.page_len
        this.setState({ current_page: page })
            return service
                .paginatedList(page, perpage, query, sort_name)
                .then(page => {
                    this.setState({ list_data: page.items, list_length: page.items.length })
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
        const { list_data,current_page, list_length, page_len } = this.state
        return (
            <div className="my-2 card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="float-sm-left search-bar">
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
                        <div className="col-md-6">
                            <div className="float-sm-right">
                                <NavLink className="btn gp-btn-primary waves-effect waves-light btn-sm mr-2" to={`/back/org-role/add/`}>
                                    Нэмэх
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-lg-12">
                            <div className="table-responsive table_wrapper">
                                <table className="table table_wrapper_table">
                                    <thead>
                                        <tr>
                                            <th><a onClick={() => this.handleSort('id', this.state.id)}>№ <i class={this.state.id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                            <th><a onClick={() => this.handleSort('name', this.state.name)}>Эрхийн нэр <i class={this.state.name ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                            <th><a onClick={() => this.handleSort('description', this.state.description)}>Тайлбар <i class={this.state.description ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                            <th><a onClick={() => this.handleSort('created_by', this.state.created_by)}>Үүсгэсэн <i class={this.state.created_by ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { list_length === 0 ?
                                        <tr><td>Нэвтрэлтийн хандалд байхгүй байна </td></tr>:
                                        list_data.map((data, idx) =>
                                            <ListTable
                                                key = {idx}
                                                idx = {(current_page*page_len)-page_len+idx+1}
                                                values={data}>
                                            </ListTable>
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
            </div>
        )
    }
}