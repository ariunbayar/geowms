import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export default class User extends Component {

    render() {

        const {id, last_name, first_name, roles, email, is_active, is_sso} = this.props.values

        const idx=this.props.idx
        return (
            <tr>
                <td scope="col">
                    {idx}
                </td>
                <td scope="col">
                    <NavLink to={`/back/user/${id}/дэлгэрэнгүй/`}>
                        <strong>{last_name.charAt(0).toUpperCase()}.{first_name}</strong>
                    </NavLink>
                </td>
                <td>
                    {email}
                </td>
                <td>
                    {roles.map(role=>role.name)}
                </td>
                <td>
                    {is_active ? <p className="text-primary">Идэвхтэй </p>: <p className="text-muted">Идэвхгүй</p>}
                </td>
                <td>
                    {is_sso &&
                        <img className="dan-logo-icon" src="/static/assets/image/logo/dan-logo2.png"/>
                    }
                </td>
            </tr>
        )
    }
}
