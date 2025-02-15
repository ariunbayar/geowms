import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"
import {NavLink} from "react-router-dom"


export class EmployeeForm extends Component {

    constructor(props) {
        super(props)

        this.state={
            refresh: false,
            жагсаалтын_холбоос: `/gov/api/role/employee/`,
            нэмэх_товч: `/gov/perm/employee/add/`,
            custom_query: {"user__is_user": true},
            талбарууд: [
                {'field': 'user__first_name', "title": 'Нэр', 'has_action': true},
                {'field': 'user__email', "title": 'Цахим шуудан'},
                {'field': 'user_state', "title": 'Төлөв', 'has_action': true},
                {'field': 'position', "title": 'Албан тушаал'},
                {'field': 'role_name', "title": 'Role', "is_sort": true},
                {'field': 'is_admin', "title": 'Админ', 'has_action': true, "is_center": true},
            ],
            хувьсах_талбарууд: [
                {"field": "user__first_name", "action": (values) => this.go_link(values)},
                {"field": "user__email",  "text": ""},
                {"field": "user_state",  "action": this.setStateColor, "action_type": true},
                {"field": "position",  "text": ""},
                {"field": "is_admin",  "action": (values) => this.set_icon(values) , "action_type": true, "is_center": true},
            ],
            drop_name: 'Хэрэглэгч',

        }

        this.handleListChange = this.handleListChange.bind(this)
    }

    set_icon(value) {
        var icon
        if (value) {icon = "fa fa-check-circle-o text-success fa-lg"}
        else {icon = "fa fa-times-circle-o text-danger fa-lg"}

        return icon
    }

    setStateColor(user_state){
        var color
        if(user_state == 'Ажиллаж байгаа'){
            color = "text-success"
        }
        else if(user_state == 'Чөлөөтэй'){
            color = "text-secondary"
        }
        else if(user_state == 'Чөлөөлөгдсөн'){
            color = "text-danger"
        } else {
            color = "text-warning"
        }
        return color

    }

    go_link(values) {
        this.props.history.push(`/gov/perm/employee/${values.id}/detail/`)
    }

    handleListChange(drop_name, custom_query) {
        this.setState({ drop_name, custom_query })
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            custom_query,
            нэмэх_товч,
            нэмэлт_талбарууд,
        } = this.state
        const { is_admin } = this.props.employee
        return (
            <div className="card">
                <div className="card-body">
                    <div className="d-flex flex-row-reverse mb-2">
                        <div className="dropdown-menu-right show">
                            <a className="btn-sm dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.drop_name}
                            </a>

                            <div className="dropdown-menu mr-2" aria-labelledby="dropdownMenuLink">
                                <button className="dropdown-item" onClick={() => this.handleListChange('Хэрэглэгч', {'user__is_user': true})}>Хэрэглэгч</button>
                                <button className="dropdown-item" onClick={() => this.handleListChange('Бүх ажилчид', {})}>Бүх ажилчид</button>
                                <button className="dropdown-item" onClick={() => this.handleListChange('Чөлөөлөгдсөн ажилчид', {'state':3})}>Чөлөөлөгдсөн ажилчид</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'bg-dark'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэх_товч={is_admin ? нэмэх_товч : null}
                            custom_query={custom_query}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
