import React, { Component } from "react"


export default class WMS extends Component {

    render() {
        const {id, name, url, public_url, created_at} = this.props.values
        return (
            <tr>
                <th>
                    {id}
                </th>
                <td>
                    {name}
                </td>
                <td>
                    {url}
                </td>
                <td>
                    {public_url}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    <a href="#" onClick={this.props.handleEdit}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a href="#" onClick={this.props.handleRemove}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )
    }
}
