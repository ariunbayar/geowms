import React, { Component } from "react"
import { NavLink } from "react-router-dom"


export class EmployeeTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modal_status: "closed",
            action_type: '',
            text: '',
            title: '',
            action_name: ''
        }
    }


    render() {
        const { idx, prefix } = this.props
        const { id, last_name, first_name, email, position, is_admin, role_name } = this.props.values

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
		        <td>
                    {role_name}
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
            </tr>
        )

    }

}
