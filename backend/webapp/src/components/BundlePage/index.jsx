import React, { Component } from "react"

import {service} from './service'
import BundleForm from './BundleForm'
import Bundle from './Bundle'


export class BundlePage extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
            id: null,
            name: '',
            price: 0,
            layers: [],
        }

        this.state = {
            bundle_list: [],
            form_options: {},
            is_form_open: false,
            form_values: {...this.initial_form_values},
        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleFormCancel = this.handleFormCancel.bind(this)

    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {

        service.getAll().then(({bundle_list, form_options}) => {
            this.setState({bundle_list, form_options})
        })

    }

    handleSaveSuccess() {
        this.handleListUpdated()
        this.setState({is_form_open: false})
    }

    handleSave(values) {

        if (values.id) {

            service.update(values).then(({success, item}) => {
                if (success) this.handleSaveSuccess()
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

    handleEdit(form_values) {
        this.setState({form_values, is_form_open: true})
    }

    handleAdd() {
        const form_values = this.initial_form_values
        this.setState({form_values, is_form_open: true})
    }

    handleFormCancel() {
        this.setState({is_form_open: false})
    }

    render() {
        return (
            <div className="container my-4">
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
                                            <th scope="col"> Сангийн нэр </th>
                                            <th scope="col"> WMS сервис </th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.bundle_list.map((values) =>
                                            <Bundle
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
                            <BundleForm
                                handleSave={this.handleSave}
                                handleCancel={this.handleFormCancel}
                                formOptions={this.state.form_options}
                                values={this.state.form_values}
                            />
                        }

                    </div>
                </div>
            </div>
        )
    }
}
