import React, { Component } from "react"

export class EmployeeTable extends Component {
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
                    {username}
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
            </tr>
        )

    }

}
