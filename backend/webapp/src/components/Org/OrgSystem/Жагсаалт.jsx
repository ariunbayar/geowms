import React, { Component } from "react"

import {service} from './service'
import GovorgForm from './GovorgForm'
import Govorg from './Govorg'
import {NavLink} from "react-router-dom"
import { Pagination } from '../../../../../../src/components/Pagination/index'
import ModalAlert from "../../ModalAlert";

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
            modal_alert_status: "closed",
            timer: null
        }
        this.paginate = this.paginate.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
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
                this.setState({modal_alert_status: 'open'})
            }
        })
        this.modalCloseTime()
    }

    handleTokenRefresh(id) {
        const { load, searchQuery }=this.state
        service.tokenRefresh(id).then(({success}) => {
            if (success) {
                var a = load
                a ++
                this.setState({ load: a })
                this.paginate(1, searchQuery)
                this.setState({modal_alert_status: 'open'})
            }
        })
        this.modalCloseTime()
    }

    modalClose(){
        this.setState({modal_alert_status: "closed"})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
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
                                            <NavLink className="btn gp-btn-primary waves-effect waves-light btn-sm" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/үүсгэх/`}>
                                                Нэмэх
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive table_wrapper my-2">
                                    <table className="table table_wrapper_table">
                                        <thead>
                                            <tr>
                                                <th scope="col"> # </th>
                                                <th scope="col"> Системүүдийн нэр</th>
                                                <th scope="col"> Токен </th>
                                                <th scope="col"> Токен шинэчлэх</th>
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
                                                        handleTokenRefresh={() => this.handleTokenRefresh(values.id)}
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
                                <ModalAlert
                                    modalAction={() => this.modalClose()}
                                    status={this.state.modal_alert_status}
                                    title="Амжилттай хадгаллаа"
                                    model_type_icon = "success"
                                />
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
