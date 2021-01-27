import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../Modal"
import ModalAlert from "../ModalAlert"

export class OrgFormTable extends Component {

    constructor(props) {
        super(props)
        this.state={
            modal_status: 'closed'
        }
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    handleModalDeleteOpen() {
        this.setState({modal_status: 'open'})
    }

    handleModalDeleteClose() {
        this.setState({modal_status: 'closed'})
    }

    modalClose(){
        this.props.handleUserDelete()
        this.setState({modal_status: 'closed'})
    }

    render() {

        const org = this.props.org
        const idx = this.props.idx
        const org_level = this.props.org_level

        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    <NavLink className="text-primary" to={`/back/байгууллага/түвшин/${org_level}/${org.id}/эрх/`}>
                        {org.name}
                    </NavLink>
                </td>
                <td>{ org.num_employees }</td>
                <td>{ org.num_systems }</td>
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org.id}/засах`}>
                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    <Modal
                        modalAction={() => this.modalClose()}
                        text={`Та "${org.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        title="Байгууллага устгах"
                        model_type_icon = "success"
                        status={this.state.modal_status}
                        modalClose={() => this.handleModalDeleteClose()}
                    />
                </td>
            </tr>
        )

    }

}
