import React, { Component } from "react"
import "./styles.css";


export default class Govorg extends Component {

    render() {
        const {id, name, token, created_at} = this.props.values
        return (
            <tr>

                <th scope="col">
                    {id}
                </th>

                <td>
                    {name}
                </td>

                <td>
                    {token}
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
                <td>
                    <a href="#" onClick={this.props.handleDetail}>
                        <i className="fa fa-chevron-up" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )
    }
}
