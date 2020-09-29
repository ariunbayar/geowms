import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"

import {Detail} from './Detail'
import {Form} from './Form'

export class System extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path="/gov/system/" component={Form} />
                <Route exact path={"/gov/system/:system_id/дэлгэрэнгүй/"} component={Detail}/>
            </Switch>
        )
    }

}
