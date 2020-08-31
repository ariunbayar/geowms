import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"
import {CrudEvenLogTable} from './CrudEvenLogTable'
import { Pagination } from "../../pagination/pagination"


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
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3">Үйлдлийн төрлөөр</h5>
                            <RadarChart></RadarChart>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>
                    <h5 className="mb-3">Хийгдсэн үйлдлийн мэдээлэл</h5>
                    <div className="form-row text-right">
                        <div className="form-group col-md-8">
                            <label htmlFor="searchQuery">Хайх:</label>
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
                    <div className="row rounded">
                        <div className="col-md-12">
                            <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Үйлдэл</th>
                                        <th scope="col">Хийгдсэн хүснэгт</th >
                                        <th scope="col">Хэрэглэгчийн нэр</th >
                                        <th scope="col">Огноо</th >
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