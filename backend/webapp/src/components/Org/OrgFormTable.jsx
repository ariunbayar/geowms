import React, { Component } from "react"
import {OrgMenu} from './OrgMenu'
import {NavLink} from "react-router-dom"


export class OrgFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const org = this.props.org
        const org_level = this.props.org_level
        return (
            <tr>
                <td>
                    {org.id}
                </td>
                <td>
                    <NavLink className="text-primary" to={`/back/байгууллага/түвшин/${org_level}/${org.id}/эрх/`}>
                        {org.name}
                    </NavLink>
                </td>
                <td>{org.level_display}</td>
                <td>
                    <a href="#" onClick={this.props.handleUserDelete}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )

    }

}
