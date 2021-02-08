import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import Modal from "../Modal"
import ModalAlert from "../ModalAlert"

export class OrgFormTable extends Component {

    constructor(props) {
        super(props)
        this.state={
        }
    }

    render() {

        const org = this.props.org
        const idx = this.props.idx
        const org_level = this.props.org_level

        return (
            <tr>
                <td>
                    {idx}
                </td>
                <td>
                    <NavLink className="text-primary" to={`/back/байгууллага/түвшин/${org_level}/${org.id}/эрх/`}>
                        {org.name}
                    </NavLink>
                </td>
                <td>{ org.num_employees }</td>
                <td>{ org.num_systems }</td>
            </tr>
        )

    }

}
