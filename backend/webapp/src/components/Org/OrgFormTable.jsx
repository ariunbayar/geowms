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
        const { } = this.props.values
        const org_level = this.props.org_level
        const org_id = this.props.org_id
        return (
            <tr>
                <td>
                    <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/`}>
                        {"Хэрэглэгчийн нэр"}
                    </NavLink>
                </td>
                <td>{"Админ болсон огноо"}</td>
                <td>{"Админ эрх олгосон хэрэглэгч"}</td>
                <td>{"Харьяат байгууллага"}</td>
                <td> 
                    <a href="#" onClick={this.props.handleUserDelete}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )

    }

}
