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
        const org_level = this.props.org_level
        return (
            <tr>
                <td>
                <NavLink className="text-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/дэлгэрэнгүй/`}>
                    {"Хэрэглэгчийн нэр"}
                </NavLink>
                </td>
                <td>{"Админ болсон огноо"}</td>
                <td>{"Админ эрх олгосон хэрэглэгч"}</td>
                <td>{"Харьяат байгууллага"}</td>
                <button type="button" onClick={this.handleProceed} className="btn gp-bg-primary text-white">Устгах</button>
            </tr>
        )

    }

}
