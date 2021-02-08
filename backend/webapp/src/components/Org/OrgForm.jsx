import React, { Component } from "react"
import {OrgFormTable} from './OrgFormTable'
import {NavLink} from "react-router-dom"
import {service} from "./service"
import { Pagination } from "@utils/Pagination"
import ModalAlert from "../ModalAlert"

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
            modal_alert_status: 'closed',
            timer: null,
        }
        this.paginate = this.paginate.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.modalClose = this.modalClose.bind(this)
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
    componentDidUpdate(prevProp){
        if(this.props.match.params.level !== prevProp.match.params.level ){
            this.setState({ level: this.props.match.params.level })
            const level = this.props.match.params.level
            this.paginate(1, "", level)
        }
    }

    paginate (page, query, level, org_id, sort_name) {
        const perpage = this.state.orgPerPage
        this.setState({ currentPage: page })
            return service
                .orgList(page, perpage, query, level, org_id, sort_name)
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

    modalClose() {
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
    }

    render() {
        const {orgs, currentPage, org_length, msg, style} = this.state
        return (
            <div className="main-content">
                <div className="page-container">
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
                                <a><i className="icon-magnifier"></i></a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="float-sm-right">
                                <NavLink className="btn gp-btn-primary waves-effect waves-light btn-sm" to={`/back/байгууллага/түвшин/${this.state.level}/нэмэх/`}>
                                    Нэмэх
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="mb-2 mt-2">
                        <div className="table-responsive table_wrapper">
                            <table className="table example table_wrapper_table" id="example">
                                <thead>
                                    <tr>
                                        <th><a>№</a></th>
                                        <th><a onClick={() => this.handleSort('name', this.state.name)}>Байгууллага нэр <i className={this.state.name ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                        <th scope="col">Албан хаагчид</th>
                                        <th scope="col">Систем</th>
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
                                            >
                                            </OrgFormTable>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination
                        paginate = {this.paginate}
                        searchQuery = {this.state.searchQuery}
                        org_level = {this.props.match.params.level}
                        load = { this.state.load }
                        sort_name = {this.state.sort_name}
                    />
                </div>
                <ModalAlert
                    title={msg}
                    model_type_icon={style}
                    status={this.state.modal_alert_status}
                    modalAction={() => this.modalClose()}
                />
            </div>
        )

    }

}
