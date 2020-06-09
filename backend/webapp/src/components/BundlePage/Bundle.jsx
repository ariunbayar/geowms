import React, { Component } from "react"
import "./styles.css";


export default class Bundle extends Component {

    render() {
        const {id, name, price, is_removeable, icon, wms_list} = this.props.values
        return (
            <tr>

                <th scope="col">
                    {id}
                </th>

                <td>
                    <img className="img" src={icon}/>
                    {name}
                </td>

                <td>
                    <ul>
                        {wms_list.map((wms_name, idx) =>
                            <li key={idx}>{wms_name}</li>
                        )}
                    </ul>
                </td>

                <td>
                    <a href="#" onClick={this.props.handleEdit}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </a>
                </td>

                <td>
                    {is_removeable &&
                        <a href="#" onClick={this.props.handleRemove}>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </a>
                    }
                </td>
            </tr>
        )
    }
}
