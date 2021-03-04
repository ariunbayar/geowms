import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import './style.css'
import {List} from './List'
import {Forms} from './Forms'
import {Roles} from './Roles'

export default class OrgRole extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Switch>
                <Route exact path={"/back/org-role/"} component={List}/>
                <Route exact path={"/back/org-role/add/"} component={Forms}/>
                <Route exact path={"/back/org-role/update/:id/"} component={Roles}/>
            </Switch>
        )

    }

}
