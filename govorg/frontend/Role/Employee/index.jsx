import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import { EmployeeForm } from "./EmployeeForm"
import { EmployeeAdd } from "./EmployeeAdd"
import { EmployeeEdit } from "./EmployeeEdit"
import { EmployeeDetail } from "./EmployeeDetail"

export class Employee extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { org_roles } = this.props
        return (
            <Switch>
                <Route exact path="/gov/perm/employee/" component={EmployeeForm} />
                <Route exact path="/gov/perm/employee/:id/edit/" component={(props) => <EmployeeEdit {...props} org_roles={org_roles} />} />
                <Route exact path="/gov/perm/employee/add/" component={ (props) => <EmployeeAdd {...props} org_roles={org_roles}/>} />
                <Route exact path="/gov/perm/employee/:id/detail/" component={EmployeeDetail} />
            </Switch>
        )
    }

}
