import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { Password } from './Password'
import { Profile } from './Profile'

export class User extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/profile/" component={Profile} />
                <Route exact path="/gov/profile/password/" component={Password} />
            </Switch>
        )
    }

}
