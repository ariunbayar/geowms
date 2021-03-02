import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import { PortalDataTable } from "@utils/DataTable/index"


export class CrudEvenLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/back/api/log/crud-list/',
            custom_query: {},
            талбарууд: [
                {'field': 'event_type', "title": 'Үйлдэл', 'has_action': true},
                {'field': 'content_type_id', "title": 'Хийгдсэн үйлдэл'},
                {'field': 'username', "title": 'Хэрэглэгч', 'has_action': true},
                {'field': 'datetime', "title": 'Огноо'},
            ],
            хувьсах_талбарууд: [
                {"field": "event_type", "action": (values) => this.make_state_color(values) , "action_type": true},
                {"field": "content_type_id"},
                {"field": "username", "action": (values) => this.go_link(values)},
                {"field": "datetime",  "text": ""},
            ],

        }
    }

    make_state_color(state){
        let color
        if  (state == 'ШИНЭ') color = 'text-primary'
        else if (state == "ЗАССАН") color = 'text-success'
        else if (state == "УСТГАСАН") color = 'text-danger'
        else if (state == "Many-to-Many Change") color = 'text-primary'
        else if (state == "Reverse Many-to-Many Change") color = 'text-primary'

        return color
    }

    go_link(values){
        this.props.history.push(`/back/user/${values.id}/дэлгэрэнгүй/`)
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
                    <div className="row">
                        <div className="col-lg-6">
                            <h5 className="text-uppercase text-center">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                        <div className="col-lg-6">
                            <h5 className="text-uppercase text-center">Үйлдлийн төрлөөр</h5>
                            <RadarChart></RadarChart>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 ">
                            <hr />
                        </div>
                    </div>
                    <h5 className="text-center text-uppercase">Лог</h5>
                    <div className="row">
                        <div className="col-md-12 ">
                            <hr />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <PortalDataTable
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
