import React, { Component } from "react"
import {NavLink} from "react-router-dom"

export class LogFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {
                total_amount,
                description,
                created_at,
                is_success,
                success_at,
                user_id,
                user_firstname,
                user_lastname,
                bank_unique_number,
                data_id,
                code,
                message,
                failed_at,
                geo_unique_number
            } = this.props.values
        return (
            <tr>
                <td>{total_amount}</td>
                <td>{description}</td>
                <td>{created_at}</td>
                <td>{is_success}</td>
                <td>{success_at}</td>
                <td>
                    <NavLink to={`/back/user/${user_id}/дэлгэрэнгүй/`}>
                        <strong>{user_lastname.charAt(0).toUpperCase()}.{user_firstname}</strong>
                    </NavLink>
                </td>
                <td>{bank_unique_number}</td>
                <td>{data_id}</td>
                <td>{code}</td>
                <td>{message}</td>
                <td>{failed_at}</td>
                <td>{geo_unique_number}</td>
            </tr>
        )

    }

}