import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable"


export class ErguulDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            талбарууд: [
                {'field': 'fullname', "title": 'Хэрэглэгчийн овог, нэр', 'has_action': true},
                {'field': 'part_time', "title": 'Ээлж', 'has_action': true},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'date_start', "title": 'Эхлэх огноо'},
                {'field': 'date_end', "title": 'Дуусах огноо'},
            ],
            жагсаалтын_холбоос: '/gov/api/role/employee/erguul-list/',
            хувьсах_талбарууд: [
                {   "field": "fullname",
                    "action": (values) => this.goLink(values)
                },
                {
                    "field": "part_time",
                    "action": this.getPartTime,
                    "action_type": true
                },
                {
                    "field": "state",
                    "action": this.getState,
                    "action_type": true
                }
            ]
        }

        this.goLink = this.goLink.bind(this)
    }

    goLink(values) {
        this.props.history.push(`/gov/perm/erguuleg/${values.id}/details/`)
    }

    getState(key){
        let obj = {"Гараагүй": "text-danger", "Гарсан": "text-success", "Гарч байгаа": "text-warning"}
        return obj[key]
    }

    getPartTime(key){
        let obj = {"Үдээс хойш": "text-dark", "Үдээс өмнө": "text-warning"}
        return obj[key]
    }

    render() {
        const { refresh, талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд } = this.state
        return (
           <div>
                <div className="row">
                    <div className="col-lg-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'bg-dark'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={100}
                            уншиж_байх_үед_зурвас={"Уншиж байна"}
                            хоосон_байх_үед_зурвас={"Хоосон байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                        />
                    </div>
                </div>
           </div>
        )

    }
}
