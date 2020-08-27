import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {LogForm} from './LogForm'


export class Log extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Switch>
                <Route exact path={"/back/log/"} component={LogForm}/>
            </Switch>
        )

    }

}
