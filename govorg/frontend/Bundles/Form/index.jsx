import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {Bar} from './Tseg-Personal/Bar'
export class Forms extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="">
                <Switch>
                    <Route path="/gov/froms/tseg-info/" component={Bar}/>
                </Switch>
            </div>
        )
    }
}
