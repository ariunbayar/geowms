import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import RevokeRequestForm from './RevokeRequestForm'

export default class RevokeRequest extends Component {

    render() {
        return (
            <Switch>
                <Route exact path="/gov/revoke-request/" component={RevokeRequestForm} />
            </Switch>
        )
    }
}
