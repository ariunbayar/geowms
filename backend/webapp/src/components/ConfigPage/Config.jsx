import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from "../Modal"
import ModalAlert from "../ModalAlert"

export default class Config extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_modal_delete_open: false,
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)

    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({is_modal_delete_open: true})
    }

    modalClose(){
        this.setState({is_modal_delete_open: false})
        this.props.modalClose()
    }

    render() {

        const {id, name, value, updated_at} = this.props.values
        const {is_modal_delete_open} = this.state

        return (
            <tr>
                <th> {id} </th>
                <td> {name} </td>
                <td> {value} </td>
                <td className="text-nowrap"> {updated_at} </td>
                <td>
                    <NavLink exact to={`/back/тохиргоо/${id}/засах/`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    {is_modal_delete_open &&
                        <>
                            <Modal
                                modalAction={this.props.handleRemove}
                                text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                                title="Тохиргоог устгах"
                                model_type_icon="success"
                            />
                            {
                                this.props.modal_alert_check &&
                                <ModalAlert
                                    title="Амжилттай устгалаа"
                                    model_type_icon = "success"
                                    modalClose = {() => this.modalClose}
                                />
                            }
                        </>
                    }
                </td>
            </tr>
        )
    }
}
``