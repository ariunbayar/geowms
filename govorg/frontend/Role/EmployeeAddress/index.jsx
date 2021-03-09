import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import Erguuleg from './Erguuleg'
import UsersAddress from './UsersAddress'

export default class Addresses extends Component {
    render() {
        const { employee } = this.props
        return (
            <Switch>
                <Route path="/gov/perm/addresses/" component={(props) => <UsersAddress {...props} employee={employee}/> }/>
                <Route exact path="/gov/perm/erguuleg/" component={(props) => <Erguuleg {...props} employee={employee}/> }/>
            </Switch>
        )
    }
}
