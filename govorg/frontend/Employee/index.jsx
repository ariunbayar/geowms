import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {EmployeeAdd} from './EmployeeAdd'
import {EmployeeForm} from './EmployeeForm'
import {EmployeeEdit} from './EmployeeEdit'
import {EmployeeDetail} from './EmployeeDetail'

export default class GovEmp extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Switch>
                <Route exact path={"/gov/role/employees/"} component={EmployeeForm}/>
                <Route exact path={"/gov/role/employees/add/"} component={EmployeeAdd}/>
                <Route exact path={"/gov/role/employees/edit/"} component={EmployeeEdit}/>
                <Route exact path={"/gov/role/employees/detail/"} component={EmployeeDetail}/>
            </Switch>
        )

    }

}
