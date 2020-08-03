import React, { Component } from "react"
import {UserFormTable} from './UserFormTable'
import {service} from '../service'
import {NavLink} from "react-router-dom"
export class UserForm extends Component {


    constructor(props) {

        super(props)

        this.state = {
            govorg_list: [{},{}],
            employees: [],

        }
        this.handleGovorgDelete = this.handleGovorgDelete.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
    }

    componentDidMount() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.handleGetAll(org_level, org_id)
    }

    handleGovorgDelete(id) {
        alert(id)
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        service.employee_remove(org_level, org_id, id).then(({ success }) => {
            if (success) {this.handleGetAll(org_level, org_id)}
        })

    }
    handleGetAll(org_level, org_id){
        service.employeesGetAll(org_level, org_id).then(({ employees }) => {
            if (employees) {
                this.setState({ employees })
            }
        })
    }
    render() {
        const {employees} = this.state
        const id=this.props.values
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/нэмэх/`}>
                                Нэмэх
                            </NavLink>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> №</th>
                                    <th scope="col"> Нэр</th>
                                    <th scope="col"> Цахим шуудан </th>
                                    <th scope="col"> is_sso </th>
                                    <th scope="col"> Албан тушаал</th>
                                    <th scope="col"> Үүссэн огноо</th>
                                    <th scope="col"> Зассан огноо</th>
                                    <th scope="col"> Устгах</th>
                                    <th scope="col"> Засах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employe, idx) =>
                                    <UserFormTable 
                                        org_level={org_level}
                                        org_id={org_id}
                                        key = {idx} 
                                        values={employe} 
                                        handleGovorgDelete={() => this.handleGovorgDelete(employe.id)}
                                    >
                                    </UserFormTable>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
