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
            employeesPerPage:20,
            searchQuery: '',
            query_min: false,
            search_load: false,

        }
        this.handleGovorgDelete = this.handleGovorgDelete.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleListCal=this.handleListCal.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
    }

    componentDidMount() {
        const currentPage=this.state.currentPage
        this.handleListCal(currentPage)
    }

    handleListCal(currentPage){
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const employeesPerPage=this.state.employeesPerPage
        const lastIndex=currentPage*employeesPerPage
        const firtsIndex=lastIndex-employeesPerPage
        this.handleGetAll(org_level,org_id,lastIndex,firtsIndex)
    }

    handleGovorgDelete(id) {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const currentPage=this.state.currentPage
        service.employee_remove(org_level, org_id, id).then(({ success }) => {
            if (success) {this.handleListCal(currentPage)}
        })

    }
    handleGetAll(org_level, org_id, lastIndex,firtsIndex){
        service.employeesGetAll(org_level, org_id,lastIndex, firtsIndex).then(({ employees ,len}) => {
            if (employees) {
                this.setState({ employees , employees_length:len})
            }
        })
    }
    prevPage(){
        if(this.state.currentPage >1){
            this.setState({
                currentPage:this.state.currentPage-1
            })
            this.handleListCal(this.state.currentPage-1)
        }
    }
    nextPage(){
        if(this.state.currentPage<Math.ceil(this.state.employees_length/this.state.employeesPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
            this.handleListCal(this.state.currentPage+1)
        }
    }
    handleSearch(field, e) {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        if(e.target.value.length > 0)
        {
            this.setState({ [field]: e.target.value, search_load:true})
            service.EmployeeSearch(org_level,org_id,e.target.value).then(({ employees }) => {
                if(employees){
                    this.setState({employees, employees_length:employees.length, search_load:false})
                }
            })
        }
        else
        {
            this.setState({ [field]: e.target.value })
            const {currentPage}=this.state.currentPage
            this.handleListCal(currentPage)
        }
    }
    render() {
        const {employees, currentPage, employeesPerPage, employees_length} = this.state
        const id=this.props.values
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id

        const totalPages=Math.ceil( employees_length/employeesPerPage)

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
                            <NavLink className="btn gp-bg-primary float-right" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/нэмэх/`}>
                                Нэмэх
                            </NavLink>     
                               <input
                                type="text"
                                className="form-control col-md-4  mb-1 float-left"
                                id="searchQuery"
                                placeholder="Хайх"
                                onChange={(e) => this.handleSearch('searchQuery', e)}
                                value={this.state.searchQuery}
                            />
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
                                employees.map((employe, idx) =>
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
