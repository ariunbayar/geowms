import React, { Component } from "react"
import {NavLink} from "react-router-dom"
export class Useradd extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        alert("jsafe")

        return (
            <div>
                <NavLink className="btn gp-bg-primary" to={`back/байгууллага/түвшин/:level/:id/Дэлгэрэнгүй/`}>
                    delgerengvi
                </NavLink>
            </div>
        )

    }

}
