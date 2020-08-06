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
            employees_length:null,
            currentPage:1,
            employeesPerPage:20

        }
        this.handleGovorgDelete = this.handleGovorgDelete.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
    }

    componentDidMount() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.handleGetAll(org_level, org_id)
    }

    handleGovorgDelete(id) {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        service.employee_remove(org_level, org_id, id).then(({ success }) => {
            if (success) {this.handleGetAll(org_level, org_id)}
        })

    }
    handleGetAll(org_level, org_id){
        service.employeesGetAll(org_level, org_id).then(({ employees }) => {
            if (employees) {
                this.setState({ employees , employees_length:employees.length})
            }
        })
    }
    prevPage(){
        if(this.state.currentPage >1){
            this.setState({
                currentPage:this.state.currentPage-1
            })
        }
    }
    nextPage(){
        if(this.state.currentPage<Math.ceil(this.state.employees_length/this.state.employeesPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
        }
    }
    render() {
        const {employees, currentPage, employeesPerPage, employees_length} = this.state
        const id=this.props.values
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const lastIndex=currentPage*employeesPerPage
        const firtsIndex=lastIndex-employeesPerPage 
        const totalPages=Math.ceil( employees_length/employeesPerPage)
        const currentEmployees= employees.slice(firtsIndex,lastIndex)
        return (
            <div className="container my-4">
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-left">
                            <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                <p className="btn btn-outline-primary">
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </p>
                            </NavLink>
                        </div>
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
                                    <th scope="col"> Засах</th>
                                    <th scope="col"> Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                { employees_length === 0 ? 
                                <tr><td>Ажилчин бүртгэлгүй байна</td></tr>:
                                currentEmployees.map((employe, idx) =>
                                    <UserFormTable 
                                        org_level={org_level}
                                        org_id={org_id}
                                        key = {idx} 
                                        idx = {(currentPage*20)-20+idx+1} 
                                        values={employe} 
                                        handleGovorgDelete={() => this.handleGovorgDelete(employe.id)}
                                    >
                                    </UserFormTable>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="float-left">
                            <strong>Хуудас {currentPage}-{totalPages}</strong>
                        </div>
                        <div className="float-right">
                            <button
                            type=" button" 
                            className="btn btn-outline-primary" 
                            onClick={this.prevPage}
                            > &laquo; өмнөх
                            </button>
                            <button 
                            type="button"
                            className="btn btn-outline-primary "
                            onClick={this.nextPage
                            } >
                            дараах &raquo;
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
