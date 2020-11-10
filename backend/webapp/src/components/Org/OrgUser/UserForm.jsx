import React, { Component } from "react"
import {UserFormTable} from './UserFormTable'
import {service} from '../service'
import {NavLink} from "react-router-dom"
import { Pagination } from "../../../../../../src/components/Pagination/index"
import ModalAlert from "../../ModalAlert"

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
            load: 0,
            modal_alert_status: "closed",
            timer: null,
        }
        this.paginate = this.paginate.bind(this)
        this.handleGovorgDelete = this.handleGovorgDelete.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.modalCloseTime=this.modalCloseTime.bind(this)
        this.modalClose=this.modalClose.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.employeesPerPage
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.setState({ currentPage: page })
            return service
                .employee_list(page, perpage, query, org_level, org_id)
                .then(page => {
                    this.setState({ employees: page.items, employees_length: page.items.length })
                    return page
                })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
    }

    handleGovorgDelete(id) {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const { load, searchQuery } = this.state
        service.employee_remove(org_level, org_id, id).then(({ success }) => {
            if (success) {
                var a = load
                a ++
                this.setState({ load: a })
                this.paginate(1, searchQuery)
                this.setState({modal_alert_status: "open"})
            }
        })
        this.modalCloseTime()
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000);
    }

    modalClose(){
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
    }

    render() {
        const {employees, currentPage, employeesPerPage, employees_length} = this.state
        const id=this.props.values
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="my-4">
                <div className="row">

                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="float-sm-left search-bar">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="searchQuery small-input"
                                        placeholder="Хайх"
                                        onChange={(e) => this.handleSearch('searchQuery', e)}
                                        value={this.state.searchQuery}
                                    />
                                    <a><i className="icon-magnifier"></i></a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="float-sm-right">
                                    <NavLink className="btn gp-btn-primary waves-effect waves-light btn-sm" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/нэмэх/`}>
                                        Нэмэх
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive table_wrapper my-2">
                            <table className="table table_wrapper_table">
                                <thead>
                                    <tr>
                                        <th scope="col"> №</th>
                                        <th scope="col"> Нэр</th>
                                        <th scope="col"> Цахим шуудан </th>
                                        <th scope="col"> ДАН систем </th>
                                        <th scope="col"> Албан тушаал</th>
                                        <th scope="col"> Үүссэн </th>
                                        <th scope="col"> Зассан </th>
                                        <th scope="col"> </th>
                                        <th scope="col"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { employees_length === 0 ?
                                    <tr><td>Ажилтан бүртгэлгүй байна</td></tr>:
                                    employees.map((employe, idx) =>
                                        <UserFormTable
                                            org_level={org_level}
                                            org_id={org_id}
                                            key = {idx}
                                            idx = {(currentPage*employeesPerPage)-employeesPerPage+idx+1}
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
                <Pagination
                    paginate = { this.paginate }
                    searchQuery = { this.state.searchQuery }
                    load = { this.state.load }
                />
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title="Амжилттай устгалаа"
                    model_type_icon = "success"
                />
            </div>
        )
    }
}
