import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "@utils/Modal/Modal"
import {GPIcon} from "@utils/Tools"

export class StyleTableList extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        const { value, idx } = this.props
        return (
            <tr key={idx}>
                <td>
                    {idx}
                </td>
                <td>
                    {value}
                </td>
                <td>
                    <NavLink className="text-primary" to={`/back/gp-geoserver/style/${value}/edit/`}>
                        <GPIcon icon={"fa fa-pencil-square-o text-primary"}/>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.props.handleRemove}>
                        <GPIcon icon={"fa fa-trash-o text-danger"}/>
                    </a>
                </td>
            </tr>
        )
    }
}
