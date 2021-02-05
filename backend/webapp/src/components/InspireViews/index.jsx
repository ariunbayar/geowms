import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {List} from './List'

export class InspireViews extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return (
                <div>
                    <Switch>
                        <Route path={"/back/inspire-views/"} component={List}/>
                    </Switch>
                </div>
            )
        }
    }
