import React, { Component } from "react"

export class HistoryTable extends Component {
    render() {
        const idx = this.props.idx
        const {amount,description,created_at,is_success,success_at,user_id,geo_unique_number,bank_unique_number,id}=this.props.values
        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    {id}
                </td>
                <td>
                    {geo_unique_number}
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
                <td>
                    {bank_unique_number}
                </td>
            </tr>
        )

    }

}
