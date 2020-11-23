import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Log} from './Form'

export class Login extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/gov/admin/login/"} component={Log}/>
            </Switch>
        )
    }
}