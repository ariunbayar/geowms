import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import { Form } from './Form'

export class Profile extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/profile/" component={Form} />
            </Switch>
        )
    }

}
