
import React, { Component } from "react"
import {EmployeeTable} from './EmployeeTable'
import { service } from "./service"
import { NavLink } from "react-router-dom"
import { Notif } from "@utils/Notification"


export class EmployeeForm extends Component {

    constructor(props) {
        super(props)

        this.too = 0;
        this.state={
            employees:[],
            prefix: '/gov/perm/employee',
        }
        this.getList = this.getList.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.addNotif = this.addNotif.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
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

    handleRemove(id) {
        service
            .deleteEmployee(id)
            .then(({ success }) => {
                if(success) {
                    this.addNotif('success', 'Амжилттай устгалаа', 'check')
                    this.getList()
                }
            })
    }

    handleTokenRefresh(id) {
        service
            .empTokenRefresh(id)
            .then(({ success, info }) => {
                if(success) {
                    this.addNotif('success', info, 'check')
                    this.getList()
                }
                else {
                    this.addNotif('danger', info, 'times')
                }
            })
    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style, msg, icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }

    render() {
        const { employees, prefix } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-right">
                                <NavLink className="btn gp-btn-primary waves-effect waves-light m-1" to={`${prefix}/add/`}>
                                    Нэмэх
                                </NavLink>
                            </div>
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
                                            <th className="text-center" scope="col">Токен шинэчлэх</th>
                                            <th className="text-center" scope="col">Засах</th>
                                            <th className="text-center" scope="col">Устгах</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((item, idx) =>
                                            <EmployeeTable key={idx}
                                                idx={idx + 1}
                                                values={item}
                                                prefix={prefix}
                                                handleRemove={() => this.handleRemove(item.id)}
                                                handleTokenRefresh={() => this.handleTokenRefresh(item.id)}
                                            />
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
            </div>
        )
    }
}
