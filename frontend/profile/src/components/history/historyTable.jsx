import React, { Component } from "react"

export class HistoryTable extends Component {

    render() {
        const idx = this.props.idx
        const {number,amount,description,created_at,is_success,success_at,user_id}
        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    {user_id}
                </td>
                <td>
                    {number}
                </td>
                <td>
                    {amount}
                </td>
                <td>
                    {description}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    {is_success}
                </td>
                <td>
                    {success_at}
                </td>
            </tr>
        )

    }

}
