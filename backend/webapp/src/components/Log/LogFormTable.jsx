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
            const idx = this.props.idx
        return (
            <tr>
                <td>{idx+1}</td>
                <td>
                    <NavLink to={`/back/user/${user_id}/дэлгэрэнгүй/`}>
                        <strong>{user_lastname.charAt(0).toUpperCase()}.{user_firstname}</strong>
                    </NavLink>
                </td>
                <td className='text-center'>{is_success ? <i className="fa fa-check-circle text-success" aria-hidden="true"></i>:<i className="fa fa-times-circle-o text-danger" aria-hidden="true"></i>}</td>
                <td>{total_amount}</td>
                <td>{description}</td>
                <td>{code}</td>
                <td>{message}</td>
                <td>{data_id}</td>
                <td>{bank_unique_number}</td>
                <td>{geo_unique_number}</td>
                <td>{is_success ? <a>{success_at}</a> : <a>{failed_at}</a> }</td>
            </tr>
        )

    }

}