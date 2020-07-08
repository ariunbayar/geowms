import React, { Component } from "react"


export default class User extends Component {

    render() {
        const {id, last_name, first_name, is_superuser, email, is_active, is_sso} = this.props.values

        return (
            <tr>
                <td scope="col">
                    {this.props.index}
                </td>
                <td scope="col">
                    #{id}
                </td>
                <td scope="col">
                    {last_name.charAt(0).toUpperCase()}.{first_name}
                </td>
                <td>
                    {email}
                </td>
                <td>
                    {is_superuser ? 'Тийм' : 'Үгүй'}
                </td>
                <td>
                    {is_active ? 'Тийм' : 'Үгүй'}
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
