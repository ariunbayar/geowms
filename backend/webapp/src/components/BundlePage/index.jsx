import React, { Component } from "react"

import {service} from './service'
import BundleForm from './BundleForm'
import Bundle from './Bundle'
import BundleAdminRights from './BundleAdminRights'
import Modal from "../Modal"

export class BundlePage extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
            id: null,
            name: '',
            price: 0,
            icon: '',
            icon_url: '',
            layers: [],
        }

        this.state = {
            bundle_list: [],
            form_options: {},
            form_options_role: {},
            is_form_open: false,
            form_values: {...this.initial_form_values},
            showModal: 'closed',
            modalTitle: null,
            modalText: null,
            modalId: null,

        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleMove = this.handleMove.bind(this)
        this.handleFormCancel = this.handleFormCancel.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getAll().then(({bundle_list, form_options, form_options_role}) => {
            this.setState({bundle_list, form_options, form_options_role})
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
    modalClose() {
        this.setState({showModal: 'closed'})
    }

    handleRemove() {
        const id = this.state.modalId
        //alert(id)
        service.remove(id).then(({success}) => {
            if (success) this.handleSaveSuccess()
        })
        this.modalClose()
    }

    modalTrue(id, text) {
        //alert(id)
        //list vvsgeh vydee showModal-iig "open" bolgoh heregtei
        this.setState({showModal: 'open', modalText: text, modalTitle: "Та итгэлтэй байна уу? ", modalId: id})
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

    handleMove(event, id, direction) {
        event.preventDefault()
        service.move(id, direction).then(({bundle_list, success}) => {
            if (success) this.setState({bundle_list})
        })
    }

    render() {
        const {showModal, modalText, modalTitle} = this.state
        return (
            <div  className={this.state.is_form_open ? "container my-4" : "container my-4 shadow-lg p-3 mb-5 bg-white rounded" } >
                <div className="row">
                
                <Modal 
                    showModal={showModal} 
                    modalClose={() => this.modalClose()}
                    modalAction={() => this.handleRemove()}
                    text={modalText}
                    title={modalTitle}
                    >
                </Modal>
    
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
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.bundle_list.map((values) =>
                                            <Bundle
                                                key={values.id}
                                                values={values}
                                                handleRemove={() => this.modalTrue(values.id, values.name)}
                                                handleEdit={() => this.handleEdit(values)}
                                                handleMove={this.handleMove}
                                            />
                                        )}
                                    </tbody>
                                </table>
                            </>
                        }

                        {this.state.is_form_open &&
                            <div className="row">
                                <div className="col-4">
                                <BundleForm
                                    handleSave={this.handleSave}
                                    handleCancel={this.handleFormCancel}
                                    formOptions={this.state.form_options}
                                    values={this.state.form_values}
                                />
                                </div>
                                <div className="col-8">
                                <BundleAdminRights
                                    handleSave={this.handleSave}
                                    handleCancel={this.handleFormCancel}
                                    formOptions={this.state.form_options}
                                    formOptionsRole={this.state.form_options_role}
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
