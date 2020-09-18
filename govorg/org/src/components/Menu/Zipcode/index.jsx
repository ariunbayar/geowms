import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {Forms} from './Form'

export class ZipCode extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/gov/zip-code/"} component={Forms}/>
            </Switch>
        )

    }

}