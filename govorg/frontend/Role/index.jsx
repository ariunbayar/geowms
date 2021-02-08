import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import { List } from './List'
import { RoleEdit } from "./RoleEdit"
import { RoleAdd } from './RoleAdd'
import { RoleDetail } from './RoleDetail'

export class Role extends Component {

    render() {
        const { org_roles, employee } = this.props
        const { is_admin, username } = this.props.employee
        return (
            <Switch>
                <Route exact path="/gov/perm/role/" component={(props) => <List {...props} employee={employee}/> } />
                {is_admin && <Route exact path="/gov/perm/role/:id/edit/" component={(props) => <RoleEdit {...props} org_roles={org_roles} employee={employee}/> } />}
                {is_admin && <Route exact path="/gov/perm/role/add/" component={(props) => <RoleAdd {...props} org_roles={org_roles} employee={employee}/> } />}
                <Route exact path="/gov/perm/role/:id/detail/" component={(props) => <RoleDetail {...props} org_roles={org_roles} employee={employee}/> } />
            </Switch>
        )
    }

}
