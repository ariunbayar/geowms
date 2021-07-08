import React, { Component } from 'react'
import { Switch, Route } from "react-router-dom"
import { Info } from './info'
import { EmailUpdate } from './EmailUpdate'

export default class index extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/profile/api/information/" component={Info} />
                <Route exact path="/profile/api/information/updateEmail/" component={EmailUpdate} />
            </Switch>
        )
    }
}
