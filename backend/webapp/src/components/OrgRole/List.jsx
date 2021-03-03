import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"


export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            жагсаалтын_холбоос: '/back/api/org/perm-get-list/',
            custom_query: {},
            талбарууд: [
                {'field': 'name', "title": 'Эрхийн нэр', 'has_action': true},
                {'field': 'description', "title": 'Тайлбар'},
                {'field': 'created_by', "title": 'Үүсгэсэн'},
            ],
            хувьсах_талбарууд: [
                {"field": "name", "action": (values) => this.go_link(values)},
            ],
        }
    }

    go_link(values){
        this.props.history.push(`/back/org-role/update/${values.id}/`)
    }

    render() {
        const {
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
        } = this.state

        return (
            <div className="my-2 card">
                <div className="card-body">
                    <PortalDataTable
                        color={'bg-dark'}
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        per_page={20}
                        уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        нэмэх_товч={"/back/org-role/add/"}
                    />
                </div>
            </div>
        )
    }
}
