import React, { Component } from "react"


export default class User extends Component {

    render() {
        const {id, last_name, first_name, gender, is_sso} = this.props.values

        return (
            <tr>
                <th scope="col">
                    {this.props.index}
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
                <td>
                    { is_sso && 
                        <img class="dan-logo-icon" src='/static/assets/image/logo/dan-logo2.png' />
                    }
                </td>
            </tr>
        )
    }
}
