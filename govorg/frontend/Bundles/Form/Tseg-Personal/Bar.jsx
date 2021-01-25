import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import {TsegPersonal} from './TsegPersonal/index'
import {TsegUstsan} from '../Tseg-Personal/TsegUstsan/index'

export class Bar extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" component={TsegPersonal}/>
                    <Route path="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" component={TsegUstsan}/>
                    <Route exact path="/gov/froms/"/>
                </Switch>
            </div>
        )
    }
}
