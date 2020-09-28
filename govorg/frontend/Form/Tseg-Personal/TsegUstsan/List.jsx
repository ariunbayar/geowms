import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import ListTable from "./ListTable"
import {service} from './service'
import {Pagination} from '../../../Components/pagination/pagination'

export class List extends Component {


    constructor(props) {

        super(props)

        this.state = {
            currentPage: 1,
            TsegPerPage: 20,
            searchQuery: '',
            list: [],
            list_length: null,
        }
        this.paginate = this.paginate.bind(this)
        this.handleTsegSuccess = this.handleTsegSuccess.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.TsegPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query)
                .then(page => {
                    this.setState({ list: page.items, list_length: page.items.length})
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

    handleTsegSuccess(id){
        service.tseg_success(id).then(({ success }) => {
            if (success) {
                this.paginate(1,"")
            }
        })
    }

    handleRemove(id){
        service.tseg_remove(id).then(({ success }) => {
            if (success) {
                this.paginate(1,"")
            }
            else {
                alert("Aldaa")
            }
        })
    }

    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.props.perms
        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12">
                          <NavLink className="btn gp-btn-primary float-right" to={"/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/add/"}>
                            Нэмэх
                        </NavLink>
                        <input
                            type="text"
                            className="form-control col-md-4  mb-1 float-left"
                            id="searchQuery"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={this.state.searchQuery}
                        />
                        <table className="table table-fluid">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Email </th>
                                    <th scope="col">Байгууллага</th>
                                    <th scope="col">Албан тушаал</th>
                                    <th scope="col">Цэгийн дугаар</th>
                                    {perm_create && perm_view && perm_remove ? <th>Засах</th> :null}
                                    {perm_approve ? <th>Баталгаажуулах</th> :null}
                                    {perm_remove ? <th>Устгах</th> :null}
                                </tr>
                               </thead>
                             <tbody>
                            {
                                this.state.list_length == 0
                                ?
                                    <tr><td>"Бүртгэл байхгүй байна"</td></tr>
                                :
                                (this.state.list.map((tseg, idx) =>
                                    <ListTable
                                        key={idx}
                                        idx={idx}
                                        perms={this.props.perms}
                                        values={tseg}
                                        handleTsegSuccess={() => this.handleTsegSuccess(tseg.id)}
                                        handleRemove={() => this.handleRemove(tseg.id)}
                                    />
                                ))
                            }
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