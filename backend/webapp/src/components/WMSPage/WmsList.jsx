import React, { Component } from "react"

import {service} from './service'
import WMSForm from './WMSForm'
import WMS from './WMS'
import Modal from "../Modal"
import {NavLink} from "react-router-dom"
import { Pagination } from "../../../../../src/components/Pagination/index"

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
            firstIndexForSearch: 0
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
    }

    paginate (page, query) {
        const perpage = this.state.wmsPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query)
                .then(page => {
                    this.setState({ wms_list: page.items})
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
                    const currentPage=this.state.currentPage
                    this.handleListCal(currentPage)
                }
            })

        } else {

            service.create(values).then(({success, item}) => {
                if (success){
                    const currentPage=this.state.currentPage
                    this.handleListCal(currentPage)}
            })

        }

    }

    modalClose() {
        this.setState({showModal: false})
    }

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) {
                const currentPage=this.state.currentPage
                this.handleListCal(currentPage)
            }
        })
        this.modalClose()
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

    render() {
        const {wms_list, wms_length }=this.state
        return (
            <div className={this.state.is_form_open ? "container my-4" : "container my-4 shadow-lg p-3 mb-5 bg-white rounded" } >
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-btn-primary" to={`/back/wms/үүсгэх/`}>
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
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> # </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col"> Огноо</th>
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
                />
            </div>
        )
    }
}
