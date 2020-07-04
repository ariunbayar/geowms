import React, { Component } from "react"

import {service} from './service'
import WMSForm from './WMSForm'
import WMS from './WMS'


export class WMSPage extends Component {

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
        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleFormCancel = this.handleFormCancel.bind(this)
        this.handleWmsLayerRefresh = this.handleWmsLayerRefresh.bind(this)

    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {

        service.getAll().then(({wms_list}) => {
            this.setState({wms_list})
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
            const wmsId = values.id
            const name = values.name
            const url = values.url
            service.update(wmsId, name, url).then(({success, item}) => {
                if (success) this.handleSaveSuccess(values.id)
            })

        } else {

            service.create(values).then(({success, item}) => {
                if (success) this.handleSaveSuccess()
            })

        }

    }

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) this.handleSaveSuccess()
        })
    }
    
    handleWmsLayerRefresh(id) {
        service.wmsLayerall(id).then(({layers_all}) => {
            if (layers_all) 
            {
                this.setState({layers_all})
            }
        })
    }

    handleEdit(form_values) {
        service.wmsLayerall(form_values.id).then(({layers_all}) => {
            if (layers_all) 
            {
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
        return (
            <div className={this.state.is_form_open ? "container my-4" : "container my-4 shadow-lg p-3 mb-5 bg-white rounded" } >
                <div className="row">
                    <div className="col-md-12">

                        {!this.state.is_form_open &&
                            <>
                                <div className="text-right">
                                    <button className="btn gp-bg-primary" onClick={this.handleAdd} >
                                        Нэмэх
                                    </button>
                                </div>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"> # </th>
                                            <th scope="col"> Нэр </th>
                                            <th scope="col"> Url </th>
                                            <th scope="col"> Endpoint </th>
                                            <th scope="col"> Огноо</th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.wms_list.map((values) =>
                                            <WMS
                                                key={values.id}
                                                values={values}
                                                handleRemove={() => this.handleRemove(values.id)}
                                                handleEdit={() => this.handleEdit(values)}
                                            />
                                        )}
                                    </tbody>
                                </table>
                            </>
                        }

                        {this.state.is_form_open &&
                                <WMSForm
                                    handleSave={this.handleSave}
                                    handleCancel={this.handleFormCancel}
                                    values={this.state.form_values}
                                    layers_all={this.state.layers_all}
                                    handleWmsLayerRefresh={this.handleWmsLayerRefresh}
                                />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
