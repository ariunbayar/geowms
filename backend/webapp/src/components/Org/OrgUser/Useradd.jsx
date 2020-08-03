import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export class Useradd extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount(){
    }

    render() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div>
                <NavLink className="btn gp-bg-primary" to={`back/байгууллага/түвшин/${org_level}/${org_id}/Дэлгэрэнгүй/`}>
                </NavLink>
            </div>
        )

    }

}
