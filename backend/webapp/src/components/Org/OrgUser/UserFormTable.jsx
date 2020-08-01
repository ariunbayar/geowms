import React, { Component } from "react"
import {NavLink} from "react-router-dom"



export class UserFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const { } = this.props.values
        return (
            <tr>
                <td>
                <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/1/0/дэлгэрэнгүй/`}>
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
