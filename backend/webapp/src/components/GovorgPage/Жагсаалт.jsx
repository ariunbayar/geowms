import React, { Component } from "react"

import {service} from './service'
import GovorgForm from './GovorgForm'
import Govorg from './Govorg'
import {NavLink} from "react-router-dom"
import Modal from "../Modal"

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
        }

        this.state = {
            govorg_list: [],
            showModal: "closed",
            modalTitle: null,
            modalText: null,
            modalId: null,
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getAll().then(({govorg_list}) => {
            this.setState({govorg_list})
        })

    }
    modalClose() {
        this.setState({showModal: false})
    }

    handleRemove() {
        const id = this.state.modalId
        service.remove(id).then(({success}) => {
            if (success) this.handleListUpdated()
        })
        this.modalClose()

    }

    modalTrue(id, text) {
        this.setState({showModal: "open", modalText: text, modalTitle: "Та итгэлтэй байна уу? ", modalId: id})
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
                                    <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/үүсгэх/`}>
                                        Нэмэх
                                    </NavLink>
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
                                                handleRemove={() => this.modalTrue(values.id, values.name)}
                                                handleEdit={() => this.handleEdit(values)}
                                               />
                                        )}
                                    </tbody>
                                </table>
                            </>
                        }

                    </div>
                </div>
            </div>
        )
    }
}
