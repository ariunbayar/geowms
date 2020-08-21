import React, { Component } from "react"

export class LogFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {
                amount, 
                description, 
                created_at, 
                is_success, 
                success_at, 
                username, 
                bank_unique_number, 
                data_id, 
                error_code, 
                error_message, 
                failed_at, 
                geo_unique_number
            } = this.props.values
        return (
            <tr>
                <td>{amount}</td>
                <td>{description}</td>
                <td>{created_at}</td>
                <td>{is_success}</td>
                <td>{success_at}</td>
                <td>{username}</td>
                <td>{bank_unique_number}</td>
                <td>{data_id}</td>
                <td>{error_code}</td>
                <td>{error_message}</td>
                <td>{failed_at}</td>
                <td>{geo_unique_number}</td>
            </tr>
        )

    }

}
