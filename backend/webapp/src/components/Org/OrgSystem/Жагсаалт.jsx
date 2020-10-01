import React, { Component } from "react"

import {service} from './service'
import GovorgForm from './GovorgForm'
import Govorg from './Govorg'
import {NavLink} from "react-router-dom"
import { Pagination } from '../../../../../../src/components/Pagination/index'

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
        }

        this.state = {
            govorg_list: [],
            govorg_length:null,
            currentPage:1,
            govorgPerPage:20,
            load: 0,
            searchQuery: '',
        }
        this.paginate = this.paginate.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.govorgPerPage
        const org_id = this.props.match.params.id
        this.setState({ currentPage: page })
            return service
                .govorgList(page, perpage, query, org_id)
                .then(page => {
                    this.setState({ govorg_list: page.items, govorg_length: page.items.length })
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
        const { load, searchQuery }=this.state
        service.remove(id).then(({success}) => {
            if (success) {
                var a = load
                a ++
                this.setState({ load: a })
                this.paginate(1, searchQuery)
            }
        })

    }

    render() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const {currentPage, govorgPerPage, govorg_list, govorg_length}=this.state
        return (
            <div  className="my-4">
                <div className="row">

                    <div className="col-md-12">

                        {!this.state.is_form_open &&
                            <>
                                <div className="text-right">
                                    <NavLink className="btn gp-btn-primary float-right" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/үүсгэх/`}>
                                        Нэмэх
                                    </NavLink>
                                    <input
                                        type="text"
                                        className="form-control flaot-left col-md-4  mb-1"
                                        id="searchQuery"
                                        placeholder="Хайх"
                                        onChange={(e) => this.handleSearch('searchQuery', e)}
                                        value={this.state.searchQuery}
                                   />
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"> # </th>
                                                <th scope="col"> Системүүдийн нэр</th>
                                                <th scope="col"> Токен </th>
                                                <th scope="col"> Үүсгэсэн огноо </th>
                                                <th scope="col"> </th>
                                                <th scope="col"> </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { govorg_length === 0 ?
                                                <tr><td>Систем бүртгэлгүй байна </td></tr>:
                                                govorg_list.map((values,index) =>
                                                    <Govorg
                                                        org_level={org_level}
                                                        org_id={org_id}
                                                        key={values.id}
                                                        idx={(currentPage*govorgPerPage)-govorgPerPage+index+1}
                                                        values={values}
                                                        handleRemove={() => this.handleRemove(values.id)}
                                                        handleEdit={() => this.handleEdit(values)}
                                                    />
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    paginate = {this.paginate}
                                    searchQuery = {this.state.searchQuery}
                                    load = {this.state.load}
                                />
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
