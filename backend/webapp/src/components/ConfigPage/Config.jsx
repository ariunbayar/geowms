import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from "../Modal"

export default class Config extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: "closed",
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)

    }

    handleModalDeleteOpen() {
        this.setState({modal_status: "open"})
    }

    handleModalDeleteClose(){
        this.setState({modal_status: "closed"})
    }

    modalClose(){
        this.props.handleRemove()
        this.setState({modal_status: 'closed'})
    }

    render() {

        const {id, name, value, updated_at} = this.props.values

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
                    <Modal
                        modalAction={() => this.modalClose()}
                        text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        title="Тохиргоог устгах"
                        model_type_icon="success"
                        status={this.state.modal_status}
                        modalClose = {() => this.handleModalDeleteClose()}
                    />
                </td>
            </tr>
        )
    }
}
``