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
    }

    paginate (page, query) {
        const perpage = this.state.crudPerPage
        this.setState({ currentPage: page })
            return service
                .crudList(page, perpage, query)
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
                           <div className="table-responsive">
                            <table className="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Үйлдэл</th>
                                        <th scope="col">Хийгдсэн хүснэгт</th>
                                        <th scope="col">Хэрэглэгчийн нэр</th>
                                        <th scope="col">Огноо</th>
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
                            />
                        </div>
                    </div>
            </div>
        </div>
        )

    }
}