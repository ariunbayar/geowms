import React, { Component } from "react"
import {NavLink} from "react-router-dom"



export class List extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className="card">
                <NavLink to={`/back/org-role/add/`}>
                    <p className="btn gp-outline-primary">
                        <i className="fa fa-angle-double-left"></i> Add
                    </p>
                </NavLink>
                fsdsdfsdf
                fsdsdfsdf
                fsdsdfsdf
                fsdsdfsdf
                fsdsdfsdf
                fsdsdfsdf
                fsdsdfsdf
            </div>
        )

    }

}
