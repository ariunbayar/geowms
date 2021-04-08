import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class RoleTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: 'closed',
        }

        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.values !== this.props.values) this.setState({ modal_status: 'closed' })

    }

    handleModalDeleteOpen(event) {
        event.preventDefault()
        this.modalClose(
            'fa fa-exclamation-circle',
            "warning",
            'Та устгахдаа итгэлтэй байна уу?',
            '',
            true
        )
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title, text, has_button) {
        this.setState({
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
        })
        this.handleModalOpen()

    }

    render() {
        const { role_id, role_name } = this.props.values
        const { index } = this.props
        const { is_admin, username } = this.props.employee
        return (
            <tr>
                <th>
                    {index}
                </th>
                <th>
                <NavLink
                    to={`/gov/perm/role/${role_id}/detail/`}
                >
                    {role_name}
                </NavLink>
                </th>
                {is_admin &&
                <th>
                    <NavLink
                        to={`/gov/perm/role/${role_id}/edit/`}
                    >
                        <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                    </NavLink>
                </th>
                }
                {is_admin &&
                <th>
                    <a href="delete" onClick={this.handleModalDeleteOpen}>
                        <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                    </a>
                    <Modal
                        modal_status={this.state.modal_status}
                        modal_icon={this.state.modal_icon}
                        icon_color={this.state.icon_color}
                        title={this.state.title}
                        has_button={this.state.has_button}
                        text={this.state.text}
                        modalAction={this.props.handleRemove}
                        actionNameDelete="Устгах"
                    />
                </th>
                }
            </tr>
        )
    }
}
