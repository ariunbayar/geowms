import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

import { EmployeeForm } from "./EmployeeForm"
import { EmployeeAdd } from "./EmployeeAdd"
import { EmployeeEdit } from "./EmployeeEdit"
import { Detail } from './Detail'
import { service } from './service'

export default class Employee extends Component {
    constructor(props) {
        super(props)

        this.state = {
            positions: [],
            states: [],
            pro_classes: [],
        }
        this.getSelectValue = this.getSelectValue.bind(this)
    }

    componentDidMount() {
        this.getSelectValue()
    }

    getSelectValue() {
        service
            .getSelectValue()
            .then(({ success, positions, states, pro_classes }) => {
                if (success) {
                    this.setState({ positions, states, pro_classes })
                }
            })
    }

    render() {
        const { org_roles, getEmpRoles, employee } = this.props
        const { is_admin, username } = this.props.employee
        return (
            <Switch>
                <Route exact path="/gov/perm/employee/" component={ (props) => <EmployeeForm {...props} employee={employee}/>}/>
                <Route exact path="/gov/perm/employee/:id/edit/" component={(props) =>
                    <EmployeeEdit
                        {...props}
                        org_roles={org_roles}
                        getEmpRoles={getEmpRoles}
                        employee={employee}
                        states={this.state.states}
                        pro_classes={this.state.pro_classes}
                        positions={this.state.positions}
                    />
                }
                />
                {is_admin
                    &&
                    <Route exact path="/gov/perm/employee/add/" component={ (props) =>
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
                }
                <Route exact path="/gov/perm/employee/:id/detail/" component={ (props) => <Detail {...props} org_roles={org_roles} employee={employee}/>}/>
            </Switch>
        )
    }

}
