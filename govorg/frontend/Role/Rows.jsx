import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import Modal from "@utils/Modal/Modal"


export default class RoleTable extends Component {

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
                    {this.state.is_modal_delete_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.props.handleRemove}
                            text={`Та устгахдаа итгэлтэй байна уу?`}
                            role_name="Тохиргоог устгах"
                            model_type_icon="success"
                        />
                    }
                </th>
                }
            </tr>
        )
    }
}
