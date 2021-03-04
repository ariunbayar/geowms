
import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"
// import {EmployeeTable} from './EmployeeTable'
// import { service } from "./service"
// import { NavLink } from "react-router-dom"


export class EmployeeForm extends Component {

    constructor(props) {
        super(props)

        this.state={
            refresh: false,
            жагсаалтын_холбоос: `/gov/api/role/employee/`,
            нэмэх_товч: `/gov/perm/employee/add/`,
            custom_query: {},
            талбарууд: [
                {'field': 'org_id', "title": 'Нэр', 'has_action': true},
                {'field': 'token', "title": 'Цахим шуудан'},
                {'field': 'position', "title": 'Албан тушаал'},
                {'field': 'user_id', "title": 'Role'},
                {'field': 'is_admin', "title": 'Админ', 'has_action': true, "is_center": true},
            ],
            хувьсах_талбарууд: [
                {"field": "org_id", "action": (values) => this.go_link(values)},
                {"field": "token",  "text": ""},
                {"field": "position",  "text": ""},
                {"field": "user_id",  "text": ""},
                {"field": "is_admin",  "action": (values) => this.set_icon(values) , "action_type": true, "is_center": true},
            ],
        }
    }

    set_icon(value) {
        var icon
        if (value) {icon = "fa fa-check-circle-o text-success fa-lg"}
        else {icon = "fa fa-times-circle-o text-danger fa-lg"}

        return icon
    }

    go_link(values) {
        this.props.history.push(`/gov/perm/employee/${values.id}/detail/`)
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
        return (
            <div className="card">
                <div className="card-body">
                    <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'bg-dark'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэх_товч={нэмэх_товч}
                            custom_query={custom_query}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
