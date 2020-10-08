import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../../Modal"

export default class Govorg extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: "closed"
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)

        this.handleRemove = this.handleRemove.bind(this);
    }

    handleModalDeleteOpen(){
        this.setState({modal_status: 'open'})
    }

    handleModalDeleteClose(){
        this.setState({modal_status: 'closed'})
    }

    handleRemove(){
        const {id} = this.props.values
        service.remove(id).then(({success}) => {
            success && this.props.handleUpdated()
        })
    }

    modalClose(){
        this.props.handleRemove()
        this.setState({modal_status: 'closed'})
    }

    render() {
        const {id, name, token, created_at} = this.props.values
        const org_level = this.props.org_level
        const org_id = this.props.org_id
        const idx=this.props.idx
        return (
            <tr>

                <th scope="col">
                    {idx}
                </th>

                <td>
                    <NavLink  className="text-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${id}/дэлгэрэнгүй/`}>
                        {name}
                    </NavLink>
                </td>

                <td>
                    {token}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${id}/засах/`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>

                <td>
                    <a href="#" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    <Modal
                        text={`Та "${name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                        title="Тохиргоог устгах"
                        model_type_icon = "success"
                        status={this.state.modal_status}
                        modalClose={this.handleModalDeleteClose}
                        modalAction={() => this.modalClose()}
                    />
                </td>
            </tr>
        )
    }
}
