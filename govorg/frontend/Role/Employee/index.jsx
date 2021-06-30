import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import { EmployeeForm } from "./EmployeeForm"
import { EmployeeAdd } from "./EmployeeAdd"
import { EmployeeEdit } from "./EmployeeEdit"
import { Detail } from './Detail'

export default class Employee extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        const { org_roles, employee } = this.props
        const { is_admin, username } = this.props.employee
        return (
            <Switch>
                <Route exact path="/gov/perm/employee/" render={(props) => <EmployeeForm {...props} employee={employee}/>}/>
                <Route path="/gov/perm/employee/:id/detail/" render={(props) => <Detail {...props} org_roles={org_roles} employee={employee}/>}/>
                {
                    is_admin
                    &&
                        <>
                            <Route path="/gov/perm/employee/:id/edit/" render={(props) =>
                                <EmployeeEdit
                                    {...props}
                                    org_roles={org_roles}
                                    employee={employee}
                                    states={this.state.states}
                                    pro_classes={this.state.pro_classes}
                                    positions={this.state.positions}
                                />
                            }
                            />
                            <Route path="/gov/perm/employee/add/" render={(props) =>
                                <EmployeeAdd
                                    {...props}
                                    org_roles={org_roles}
                                    employee={employee}
                                    states={this.state.states}
                                    pro_classes={this.state.pro_classes}
                                    positions={this.state.positions}
                                />
                            }
                            />
                        </>

                }
            </Switch>
        )
    }

}
