import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import UsersAddress from './UsersAddress'

export class Addresses extends Component {
    render() {
        return (
            <Switch>
                <Route path="/back/байгууллага/түвшин/:level/:id/addresses/" component={UsersAddress}/>
            </Switch>
        )
    }
}
