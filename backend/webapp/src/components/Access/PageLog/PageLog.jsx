import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"
import {Charts} from './Chart'
import {PieChart} from './PieChart'


export class PageLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/back/api/log/page-list/',
            custom_query: {},
            талбарууд: [
                {'field': 'url', "title": 'Хаяг'},
                {'field': 'method', "title": 'Method'},
                {'field': 'remote_ip', "title": 'IP хаяг'},
                {'field': 'id', "title": 'Хэрэглэгчийн дугаар'},
                {'field': 'datetime', "title": 'Огноо'},
            ],
            хувьсах_талбарууд: [
                {"field": "url", "text": ""},
                {"field": "method",  "text": ""},
                {"field": "remote_ip",  "text": ""},
                {"field": "id",  "text": ""},
                {"field": "datetime",  "text": ""},
            ],
        }
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
                    <div className="col-md-6">
                        <h5 className="text-uppercase text-center">
                            Хандалтын тоогоор
                        </h5>
                        <Charts></Charts>
                    </div>
                    <div className="col-md-6">
                        <h5 className="text-uppercase text-center">Хандалтын төхөөрөмжийн тоогоор</h5>
                        <PieChart></PieChart>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <hr />
                    </div>
                </div>
                <h5 className="mb-3 text-center text-uppercase">Нэвтэрч орсон мэдээлэл</h5>
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
