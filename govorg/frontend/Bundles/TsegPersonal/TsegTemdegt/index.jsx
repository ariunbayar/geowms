import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"

export default class TsegTemdegt extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='card-body'>
                <h1>hello</h1>
                <NavLink className="btn btn-block btn-primary" to={`/gov/tseg-personal/add/`}>nemeh</NavLink>
            </div>
        )
    }
}
