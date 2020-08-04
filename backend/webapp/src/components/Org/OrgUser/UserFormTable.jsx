import React, { Component } from "react"
import {NavLink} from "react-router-dom"



export class UserFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const org_id = this.props.org_id
        const idx = this.props.idx
        const org_level = this.props.org_level
        const employee = this.props.values
        return (
            <tr>
                <td>{idx + 1}</td>
                <td>{employee.last_name + ". " + employee.first_name}</td>
                <td>{employee.email}</td>
                <td>{employee.is_sso}</td>
                <td>{employee.position}</td>
                <td>{employee.created_at}</td>
                <td>{employee.updated_at}</td>
                <td>
                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${employee.id}/засах/`}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </NavLink>
                </td>
                <td>
                    <a href="#" onClick={this.props.handleGovorgDelete}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )
    }

}
