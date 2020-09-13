import React, { Component } from "react"
import {OrgFormTable} from './OrgFormTable'
import {NavLink} from "react-router-dom"
import {service} from "./service"
import { Pagination } from "../../../../../src/components/Pagination/index"

export class OrgForm extends Component {

    constructor(props) {
        super(props)

        this.initials = {
            currentPage: 1,
        }

        this.state = {
            level: this.props.match.params.level || 1,
            orgs: [],
            org_length:null,
            currentPage: this.initials.currentPage,
            orgPerPage:20,
            searchQuery: '',
            query_min: false,
            search_load: false,
            load: 0,
        }
        this.paginate = this.paginate.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    componentDidUpdate(prevProp){
        if(this.props.match.params.level !== prevProp.match.params.level ){
            this.setState({ level: this.props.match.params.level })
            const level = this.props.match.params.level
            this.paginate(1, "", level)
        }
    }

    paginate (page, query, level, org_id) {
        const perpage = this.state.orgPerPage
        this.setState({ currentPage: page })
            return service
                .orgList(page, perpage, query, level, org_id)
                .then(page => {
                    this.setState({ orgs: page.items, org_length: page.items.length })
                    return page
                })
    }

    handleSearch(field, e) {
        const level = this.props.match.params.level
        const org_id = this.props.match.params.org_id
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value, level, org_id)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value, level, org_id)
        }
    }

    handleUserDelete(id){
        const { load, searchQuery } = this.state
        const level = this.props.match.params.level
        const org_id = this.props.match.params.org_id
        service.org_remove(this.state.level,id).then(({ success }) => {
            if (success) {
                var a = load
                a++
                this.setState({ load: a })
                this.paginate(1, searchQuery, level, org_id)
            }
        })
    }

    render() {
        const {orgs,currentPage,org_length} = this.state
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="text-right">
                        <NavLink className="btn gp-btn-primary float-right" to={`/back/байгууллага/түвшин/${this.state.level}/нэмэх/`}>
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
                    </div>
                    <div className="mb-3 mt-3">
                        <table className="table example" id="example">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Байгууллага нэр</th>
                                    <th scope="col">Түвшин</th>
                                    <th scope="col"></th >
                                    <th scope="col"></th >
                                </tr>
                            </thead>
                            <tbody>
                                { org_length ===0 ?
                                    <tr><td>Байгууллага бүртгэлгүй байна</td></tr> :
                                    orgs.map((org, idx) =>
                                        <OrgFormTable
                                            key={idx}
                                            idx={(currentPage*20)-20+idx+1}
                                            org_level={this.state.level}
                                            org={org}
                                            handleUserDelete={() => this.handleUserDelete(org.id)}>
                                        </OrgFormTable>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination 
                        paginate = {this.paginate}
                        searchQuery = {this.state.searchQuery}
                        org_level = {this.props.match.params.level}
                        load = { this.state.load }
                    />
                </div>
            </div>
        )

    }

}