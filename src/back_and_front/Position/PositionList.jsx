import React, { Component } from 'react'
import { PortalDataTable } from "@utils/DataTable/index"

class PositionList extends Component {

    constructor(props) {
        super(props)

        this.state={
            refresh: false,
            жагсаалтын_холбоос: `/gov/api/role/position/`,
            нэмэх_товч: `/gov/perm/employee/add/`,
            custom_query: {},
            талбарууд: [
                {'field': 'name', "title": 'Албан тушаал', 'has_action': true},
                // {'field': 'user__email', "title": 'Цахим шуудан'},
                // {'field': 'position', "title": 'Албан тушаал'},
                // {'field': 'role_name', "title": 'Role', "is_sort": true},
                // {'field': 'is_admin', "title": 'Админ', 'has_action': true, "is_center": true},
            ],
            хувьсах_талбарууд: [
                // {"field": "user__first_name", "action": (values) => this.go_link(values)},
                // {"field": "user__email",  "text": ""},
                // {"field": "position",  "text": ""},
                // {"field": "is_admin",  "action": (values) => this.set_icon(values) , "action_type": true, "is_center": true},
            ],
            is_user: true,
            drop_name: 'Хэрэглэгч',
        }
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
            is_user,
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
                            нэмэх_товч={is_admin ? нэмэх_товч : null}
                            custom_query={custom_query}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                            is_user={is_user}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PositionList
