import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import './style.css'
import {Roles} from './Roles'

export class OrgRole extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Switch>
                <Route exact path={"/back/байгууллага/түвшин/:level/:id/org-role/"} component={Roles}/>
            </Switch>
        )

    }

}
