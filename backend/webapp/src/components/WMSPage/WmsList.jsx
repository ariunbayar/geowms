import React, { Component } from "react"

import {service} from './service'
import WMSForm from './WMSForm'
import WMS from './WMS'
import Modal from "../Modal"
import {NavLink} from "react-router-dom"
import { Pagination } from "../../../../../src/components/Pagination/index"
import ModalAlert from "../ModalAlert"

export class WmsList extends Component {

    constructor(props) {

        super(props)

        this.initial_form_values = {
            id: null,
            name: '',
            url: '',
        }

        this.state = {
            is_form_open: false,
            wms_list: [],
            layers_all: [],
            form_values: {...this.initial_form_values},
            currentPage:1,
            wmsPerPage:20,
            wms_length:null,
            searchQuery: '',
            query_min: false,
            search_load: false,
            firstIndexForSearch: 0,
            modal_alert_check: 'closed',
            timer: null,
        }
        this.paginate = this.paginate.bind(this)
        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleFormCancel = this.handleFormCancel.bind(this)
        this.handleWmsLayerRefresh = this.handleWmsLayerRefresh.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.handleModalAlert=this.handleModalAlert.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
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
        const perpage = this.state.wmsPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query, sort_name)
                .then(page => {
                    this.setState({ wms_list: page.items, wms_length: page.items.length })
                    return page
                })
    }


    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
    }

    handleListUpdated(lastIndex,firtsIndex) {

        service.pagination(lastIndex,firtsIndex).then(({wms_list, len}) => {
            this.setState({wms_list, wms_length:len})
        })
    }

    handleSaveSuccess(id) {
        if(id)
        {
            this.handleListUpdated()
            this.handleWmsLayerRefresh(id)
        }else{
            this.handleListUpdated()
            this.setState({is_form_open:false})
        }
    }

    handleSave(values) {

        if (values.id) {
            service.update(values).then(({success, item}) => {
                if (success){
                    this.paginate(1, "")
                }
            })

        } else {

            service.create(values).then(({success, item}) => {
                if (success){
                    this.paginate(1, "")
            }
            })

        }
    }

    modalClose() {
        this.setState({showModal: false})
    }

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) {
                this.paginate(1, "")
                this.setState({modal_alert_check: 'open'})
            }
        })
        this.modalClose()
        this.modalCloseTime()
    }

    handleModalAlert(){
        this.setState({modal_alert_check: 'closed'})
        clearTimeout(this.state.timer)
    }

    handleWmsLayerRefresh(id) {
        service.wmsLayerall(id).then(({layers_all}) => {
            if (layers_all) {
                this.setState({layers_all})
            }
        })
    }

    handleEdit(form_values) {
        service.wmsLayerall(form_values.id).then(({layers_all}) => {
            if (layers_all) {
                this.setState({layers_all, form_values, is_form_open: true})
            }
        })
    }

    handleAdd() {
        const form_values = this.initial_form_values
        this.setState({form_values, is_form_open: true, layers_all: []})
    }

    handleFormCancel() {
        this.setState({is_form_open: false})
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_check: 'closed'})
        }, 2000)
    }

    render() {
        const {wms_list, wms_length }=this.state
        return (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
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
                                                <a><i className="icon-magnifier"></i></a>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="float-sm-right">
                                                <NavLink className="btn gp-btn-primary waves-effect waves-light btn-sm" to={`/back/wms/үүсгэх/`}>
                                                    Нэмэх
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row my-2">
                                        <div className="table-responsive table_wrapper">
                                            <table className="table align-items-center table-flush table_wrapper_table">
                                                <thead>
                                                    <tr>
                                                        <th><a>№</a></th>
                                                        <th><a onClick={() => this.handleSort('name', this.state.name)}>Нэр <i className={this.state.name ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                                        <th><a onClick={() => this.handleSort('created_at' ,this.state.created_at)}>Огноо <i className={this.state.created_at ? "fa fa-angle-up" : "fa fa-angle-down"} aria-hidden="true"></i></a></th>
                                                        <th scope="col"> Идэвхтэй эсэх</th>
                                                        <th scope="col"></th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {wms_length===0 ?
                                                    <tr><td>WMS бүртгэлгүй байна</td></tr>:
                                                    wms_list.map((values, index) =>
                                                        <WMS
                                                            key={values.id}
                                                            values={values}
                                                            idx={(this.state.currentPage*20)-20+index+1}
                                                            handleRemove={() => this.handleRemove(values.id)}
                                                            handleEdit={() => this.handleEdit(values)}
                                                        />
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <Pagination paginate={this.paginate}
                                        searchQuery = { this.state.searchQuery }
                                        sort_name = {this.state.sort_name}
                                    />
                            </div>
                            <ModalAlert
                                title="Амжилттай устгалаа"
                                model_type_icon = "success"
                                status={this.state.modal_alert_check}
                                modalAction={this.handleModalAlert}
                            />
                        </div>
                    </div>
                </div>
        )
    }
}