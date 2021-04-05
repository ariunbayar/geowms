import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"


export class UserTable extends Component {


    constructor(props) {

        super(props)

        this.state = {
            refresh: false,
            жагсаалтын_холбоос: `/back/api/org/level-${props.match.params.level}/${props.match.params.id}/employeeList/`,
            нэмэх_товч: `/back/байгууллага/түвшин/${props.match.params.level}/${props.match.params.id}/хэрэглэгч/нэмэх/`,
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
            is_user: true,
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

    go_link(values) {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/${values.id}/дэлгэрэнгүй/`)
    }

    handleListChange(is_user, drop_name) {
        this.setState({ is_user, drop_name })
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            custom_query,
            нэмэх_товч,
            is_user,
        } = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <div className="d-flex flex-row-reverse mb-2">
                        <div className="dropdown-menu-right show">
                            <a className="btn-sm dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.drop_name}
                            </a>

                            <div className="dropdown-menu mr-2" aria-labelledby="dropdownMenuLink">
                                <button className="dropdown-item" onClick={() => this.handleListChange(true, 'Хэрэглэгч')}>Хэрэглэгч</button>
                                <button className="dropdown-item" onClick={() => this.handleListChange(false, 'Бүх ажилчид')}>Бүх ажилчид</button>
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
                            нэмэх_товч={нэмэх_товч}
                            custom_query={custom_query}
                            is_user={is_user}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
