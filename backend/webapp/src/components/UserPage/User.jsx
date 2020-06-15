import React, { Component } from "react"


export default class User extends Component {

    render() {
        const {id, last_name, first_name, gender, } = this.props.values
        return (
            <tr>

                <th scope="col">
                    {id}
                </th>

                <td>
                    {last_name}
                </td>

                <td>
                     {first_name}
                </td>

                <td>
                    {gender}
                </td>
            </tr>
        )
    }
}
