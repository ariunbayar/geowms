import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { List } from './List'
import { RoleEdit } from "./RoleEdit"
import { RoleAdd } from './RoleAdd'
import { RoleDetail } from './RoleDetail'

export class Role extends Component {

    render() {
        return (
            <Switch>
                <Route exact path="/gov/perm/role/" component={List} />
                <Route exact path="/gov/perm/role/:id/edit/" component={RoleEdit} />
                <Route exact path="/gov/perm/role/add/" component={RoleAdd} />
                <Route exact path="/gov/perm/role/:id/detail/" component={RoleDetail} />
            </Switch>
        )
    }

}
