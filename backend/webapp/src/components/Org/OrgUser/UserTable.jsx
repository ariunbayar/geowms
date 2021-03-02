import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"


export class UserTable extends Component {


    constructor(props) {

        super(props)

        this.state = {
            refresh: false,
            жагсаалтын_холбоос: `/back/api/org/level-${props.match.params.level}/${props.match.params.id}/employeeList/`,
            custom_query: {},
            талбарууд: [
                {'field': 'first_name', "title": 'Нэр', 'has_action': true},
                {'field': 'email', "title": 'Цахим шуудан'},
                {'field': 'position', "title": 'Албан тушаал'},
                {'field': 'is_admin', "title": 'Админ', 'has_action': true, "is_center": true},
                {'field': 'created_at', "title": 'Үүссэн'},
                {'field': 'updated_at', "title": 'Зассан'},
            ],
            хувьсах_талбарууд: [
                {"field": "first_name", "action": (values) => this.go_link(values)},
                {"field": "email",  "text": ""},
                {"field": "position",  "text": ""},
                {"field": "is_admin",  "action": (values) => this.set_icon(values) , "action_type": true, "is_center": true},
                {"field": "created_at",  "text": ""},
                {"field": "updated_at",  "text": ""},
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
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${values.id}/дэлгэрэнгүй/`)
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
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
                        />
                    </div>
                </div>
            </div>
        )
    }
}
