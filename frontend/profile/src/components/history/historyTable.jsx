import React, { Component } from "react"

export class HistoryTable extends Component {
    render() {
        const idx = this.props.idx
        const {id, geo_unique_number, total_amount, description, created_at, is_success, success_at, bank_unique_number}=this.props.values
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
                    {total_amount}
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
