import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import CancelRequestForm from './CancelRequestForm'

export class CancelRequest extends Component {

    render() {
        return (
            <Switch>
                <Route exact path="/gov/cancel-request/" component={CancelRequestForm} />
            </Switch>
        )
    }
}
