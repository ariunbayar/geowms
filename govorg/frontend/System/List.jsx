
import React, { Component } from "react";
import { PortalDataTable } from "@utils/DataTable/index"


export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/gov/api/system/',
            custom_query: {},
            талбарууд: [
                {'field': 'name', "title": 'Нэр', 'has_action': true},
                {'field': 'token', "title": 'Токен'},
                {'field': 'created_at', "title": 'Огноо'},
            ],
            хувьсах_талбарууд: [
                {"field": "name", "action": (values) => this.go_link(values)},
            ],
        }
    }

    go_link(values){
        this.props.history.push(`/gov/system/${values.id}/дэлгэрэнгүй/`)
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
                    <PortalDataTable
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        per_page={20}
                        уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        color={'primary'}
                    />
                </div>
            </div>
        );
    }
}
