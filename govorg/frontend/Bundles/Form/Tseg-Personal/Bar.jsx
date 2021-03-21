import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {TsegPersonal} from './TsegPersonal'
import {TsegUstsan} from './TsegUstsan'

export class Bar extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/tseg-personal/" component={TsegPersonal}/>
                    <Route path="/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/" component={TsegUstsan}/>
                    <Route exact path="/gov/forms/"/>
                </Switch>
            </div>
        )
    }
}
