import React, { Component } from "react"
import {NavLink} from "react-router-dom"

export default class TsegUstsan extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>hi</h1>
                <NavLink className="btn btn-block btn-primary" to={`/gov/tseg-personal/add/`}>nemeh</NavLink>
            </div>
        )
    }
}
