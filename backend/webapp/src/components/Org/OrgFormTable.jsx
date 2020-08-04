import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export class OrgFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
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
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org.id}/засах`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.props.handleUserDelete}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )

    }

}
