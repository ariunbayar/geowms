import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {List} from './List'
import {DanForm} from './DanForm'

export class TsegUstsan extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/profile/tseg-ustsan/"} component={List}/>
                <Route exact path={"/profile/tseg-ustsan/add/"} component={DanForm}/>
                <Route exact path={"/profile/tseg-ustsan/:id/засах"} component={DanForm}/>
            </Switch>
        )

    }

}