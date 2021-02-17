import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import UsersAddress from './UsersAddress'

export class Addresses extends Component {
    render() {
        const { employee } = this.props
        return (
            <Switch>
                <Route path="/gov/perm/addresses/" component={(props) => <UsersAddress {...props} employee={employee}/> }/>
            </Switch>
        )
    }
}
