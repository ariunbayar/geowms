import React, { Component } from "react"

import {service} from './service'
import GovorgForm from './GovorgForm'
import Govorg from './Govorg'


export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
        }

        this.state = {
            govorg_list: [],
            is_form_open: false,
        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleDetail = this.handleDetail.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getAll().then(({govorg_list}) => {
            this.setState({govorg_list})
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

    handleDetail() {
        const form_values = this.initial_form_values
        this.setState({form_values, is_form_open: true})
    }

    render() {
        return (
            <div  className={this.state.is_form_open ? "container my-4" : "container my-4 shadow-lg p-3 mb-5 bg-white rounded" } >
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
                                            <th scope="col"> Байгууллагын нэр</th>
                                            <th scope="col"> Токен </th>
                                            <th scope="col"> Үүсгэсэн огноо </th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.govorg_list.map((values) =>
                                            <Govorg
                                                key={values.id}
                                                values={values}
                                                handleRemove={() => this.handleRemove(values.id)}
                                                handleEdit={() => this.handleEdit(values)}
                                                handleDetail={() => this.handleDetail(values)}
                                            />
                                        )}
                                    </tbody>
                                </table>
                            </>
                        }

                        {this.state.is_form_open &&
                            <div className="row">
                                <div className="col-4">
                                <GovorgForm
                                    handleSave={this.handleSave}
                                    handleCancel={this.handleFormCancel}
                                    formOptions={this.state.form_options}
                                    values={this.state.form_values}
                                />
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        )
    }
}
