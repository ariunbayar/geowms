import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"
import {CrudEvenLogTable} from './CrudEvenLogTable'
import { Pagination } from "../../../../../../src/components/Pagination/index"


export class CrudEvenLog extends Component {


    constructor(props) {
        super(props)
        this.state = {
            crud_event_display: [],
            crud_length:null,
            currentPage:1,
            crudPerPage:20,
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
        const perpage = this.state.crudPerPage
        this.setState({ currentPage: page })
            return service
                .crudList(page, perpage, query, sort_name)
                .then(page => {
                    this.setState({ crud_event_display: page.items, crud_length: page.items.length })
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
        const { crud_event_display, currentPage, crud_length, crudPerPage } = this.state
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-6">
                            <h5 className="text-uppercase text-center">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                        <div className="col-lg-6">
                            <h5 className="text-uppercase text-center">Үйлдлийн төрлөөр</h5>
                            <RadarChart></RadarChart>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 ">
                            <hr />
                        </div>
                    </div>
                    <h5 className="text-center text-uppercase">Лог</h5>
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
                                        <th><a onClick={() => this.handleSort('event_type', this.state.event_type)}>Үйлдэл <i className={this.state.event_type ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a onClick={() => this.handleSort('object_id', this.state.object_id)}>Хийгдсэн хүснэгт <i className={this.state.object_id ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th><a >Хэрэглэгчийн нэр</a></th>
                                        <th><a onClick={() => this.handleSort('datetime', this.state.datetime)}>Огноо <i className={this.state.datetime ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { crud_length === 0 ?
                                        <tr><td>Гаралтын хандалт байхгүй байна </td></tr>:
                                        crud_event_display.map((logout, idx) =>
                                            <CrudEvenLogTable
                                                key = {idx}
                                                idx = {(currentPage*crudPerPage)-crudPerPage+idx+1}
                                                values={logout}>
                                            </CrudEvenLogTable>
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