import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import Modal from '../../Modal'


export class UserTableItem extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const org_id = this.props.org_id
        const idx = this.props.idx
        const org_level = this.props.org_level
        const employee = this.props.values

        return (
            <tr>
                <td>{idx}</td>
                <td className="position-relative">
                    <NavLink
                        to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${employee.id}/дэлгэрэнгүй/`}
                        className="stretched-link"
                    >
                        { employee.last_name + ". " + employee.first_name }
                    </NavLink>
                </td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>
                    {
                        employee.is_admin ?
                        <div className="text-center">
                            <i className="fa fa-check-circle-o text-success fa-lg" aria-hidden="true"></i>
                        </div>
                        :
                        null
                    }
                </td>
                <td>{employee.created_at}</td>
                <td>{employee.updated_at}</td>
            </tr>
        )
    }

}
