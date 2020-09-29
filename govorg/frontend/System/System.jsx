import React, { Component } from "react"
import {NavLink} from "react-router-dom"

export default class System extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        const {id, name, token, created_at} = this.props.values
        const idx=this.props.idx
        return (
            <tr>
                <th scope="col">
                    {idx}
                </th>
                <td>
                    <NavLink  className="text-primary" to={`/gov/system/${id}/дэлгэрэнгүй/`}>
                        {name}
                    </NavLink>
                </td>
                <td>
                    {token}
                </td>
                <td>
                    {created_at}
                </td>
            </tr>
        )
    }
}
