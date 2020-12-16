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
        if (prevProps.values !== this.props.values) {
            this.setState({ is_modal_delete_open: false })
        }

    }

    render() {
        const { idx, prefix } = this.props
        const { id, last_name, first_name, email, position, is_admin } = this.props.values

        const last_name_conv = last_name.charAt(0).toUpperCase()
        const firt_name_conv = first_name.charAt(0).toUpperCase() + first_name.slice(1)
        const full_name = last_name_conv + '. ' + firt_name_conv

        return (
            <tr>
                <th>
                    {idx}
                </th>
                <td>
                <NavLink to={`${prefix}/${id}/detail/`}>
                    <strong>{full_name}</strong>
                </NavLink>
                </td>
                <td>
                    {email}
                </td>
                <td>
                    {position}
                </td>
                <td className="text-center">
                    <i className={`fa ` +
                        (is_admin
                            ? `fa-check-circle-o text-success`
                            : `fa-times-circle-o text-danger`
                        ) +
                            ` fa-lg`
                        }
                        aria-hidden="true"
                    ></i>
                </td>
                <td className="text-center">
                    <NavLink to={`${prefix}/${id}/edit/`}>
                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td className="text-center">
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
