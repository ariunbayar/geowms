import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import Modal from "../../components/helpers/Modal"

export class EmployeeTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_modal_delete_open: false,
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.setState({ is_modal_delete_open: true })
    }

    handleModalDeleteClose() {
        this.setState({ is_modal_delete_open: false })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.values !== this.props.values) this.setState({ is_modal_delete_open: false })

    }
    
    render() {
        const idx = this.props.idx
        const {id, last_name, username,first_name, email, register, gender, position, created_at} = this.props.values
        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    {id}
                </td>
                <td>
                    {last_name}
                </td>
                <td>
                    {first_name}
                </td>
                <td>
                <NavLink to={`/gov/role/employees/detail/`}>
                    {username}
                </NavLink>
                </td>
                <td>
                    {email}
                </td>
                <td>
                    {register}
                </td>
                <td>
                    {gender}
                </td>
                <td>
                    {position}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    <NavLink to={`/gov/role/employees/edit/`}>
                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="delete" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    {this.state.is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та устгахдаа итгэлтэй байна уу?`}
                            title="Тохиргоог устгах"
                            model_type_icon="success"
                        />
                    }
                </td>
            </tr>
        )

    }

}
