
import React, { Component } from "react"
import {EmployeeTable} from './EmployeeTable'
import { service } from "./service"
import { NavLink } from "react-router-dom"


export class EmployeeForm extends Component {

    constructor(props) {
        super(props)

        this.state={
            employees:[],
            prefix: '/gov/perm/employee',
        }
        this.getList = this.getList.bind(this)
    }

    getList() {
        service
            .getListEmployee()
            .then(({ success, employees }) => {
                if (success) {
			this.setState({ employees })
                }
            })
    }

    componentDidMount() {
        this.getList()
    }

    render() {
        const { employees, prefix } = this.state
        const { is_admin, username } = this.props.employee
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            {is_admin &&
                            <div className="text-right">
                                <NavLink className="btn gp-btn-primary waves-effect waves-light m-1" to={`${prefix}/add/`}>
                                    Нэмэх
                                </NavLink>
                            </div>
                            }
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">№</th>
                                            <th scope="col">Овог нэр</th>
                                            <th scope="col">Имэйл</th >
                                            <th scope="col">Албан тушаал</th >
					                        <th scope="col">Role</th>
                                            <th className="text-center" scope="col">Админ эсэх</th >
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((item, idx) =>
                                            <EmployeeTable key={idx}
                                                idx={idx + 1}
                                                values={item}
                                                prefix={prefix}
                                            />
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
