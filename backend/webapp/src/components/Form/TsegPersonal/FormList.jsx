import React, { Component } from "react"
import FormTable from './FormTable'
import {NavLink} from "react-router-dom"
import {service} from '../service'
import { Pagination } from "../../pagination/pagination"

export class FormList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            tseg_personal: [],
            length:null,
            currentPage:1,
            PerPage:50,
            searchQuery: 'g109',
            query_min: false,
            error: false,
            error_msg: [],
        }

        this.paginate = this.paginate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.PerPage
        this.setState({ currentPage: page })
            return service
                .tsegPersonalList(page, perpage, query)
                .then(page => {
                    this.setState({ tseg_personal: page.items, length: page.items.length })
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

    handleRemove(id) {
        service.tsegPersonalRemove(id).then(({success}) => {
            if (success) this.paginate(1, this.state.searchQuery)
        })
    }

    handleSuccess(point_type, objectid, point_class) {
        service.tsegPersonalSuccess(point_type, objectid, point_class).then(({success, msg}) => {
            if(success){
                this.paginate(1, this.state.searchQuery)
                this.setState({ error: !success, error_msg: msg })
                setTimeout(() => {
                    this.setState({ error: false, error_msg: [] })
                }, 1500);
            }
            else
            {
                this.setState({ error: !success, error_msg: msg })
                setTimeout(() => {
                    this.setState({ error: false, error_msg: [] })
                }, 1500);
                
            }
            
        })
    }

    render() {
        const { error, error_msg } = this.state
        const error_bn = Object.keys(error_msg).length > 0
        return (
            <div  className="container my-4">
                <div className="row">
                    <div className="col-md-12">
                        {
                            error && error_bn
                            ?
                            <div className="text-left">
                                <div className="text-danger">{error_msg}</div>
                            </div>
                            :
                            <div className="text-left">
                                <div className="text-success">{error_msg}</div>
                            </div>
                        }
                        <div className="text-right">
                            <NavLink className="btn gp-btn-primary" to={`/back/froms/tseg-personal/add/`}>
                                Нэмэх
                            </NavLink>
                        </div>
                        <div className="form-row text-right">
                        <div className="form-group col-md-8">
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
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col">Цэгийн нэр</th>
                                    <th scope="col">Цэгийн дугаар</th>
                                    <th scope="col">Полигон дугаар</th>
                                    <th scope="col">Төвийн төрөл</th>
                                    <th scope="col">Цэгийн төрөл</th>
                                    <th scope="col">Аймаг</th>
                                    <th scope="col">Сум</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                    <th scope="col">Баталгаажуулах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tseg_personal.map((values, idx) =>
                                    <FormTable
                                        key={idx}
                                        idx = {idx}
                                        values={values}
                                        handleRemove={() => this.handleRemove(values.id)}
                                        handleMove={this.handleMove}
                                        handleSuccess = {() => this.handleSuccess(values.point_type, values.objectid, values.point_class)}
                                    />
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
        )
    }
}