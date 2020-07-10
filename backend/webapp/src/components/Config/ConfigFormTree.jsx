import React, { Component } from "react"


export default class ConfigFormTree extends Component {

    render() {
        const {id, name, value, updated_at} = this.props.values
        return (
            <tr>
                <th>
                    {id}
                </th>

                <td>
                    {name}
                </td>

                <td>
                    {value}
                </td>
                <td>
                    {updated_at}
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
