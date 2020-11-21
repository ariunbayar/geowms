import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Form} from './Form'

export class Login extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/gov/admin/login/"} component={Form}/>
            </Switch>
        )
    }
}