import React, { Component } from "react"
import { service } from "../service"

import { PortalDataTable } from "@utils/DataTable/index"
import {Charts} from './Chart'
import {PieChart} from './PieChart'
import { Card_body } from "@utils/Card_template/Card_body"



export class PageLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/back/api/log/page-list/',
            fields:[],
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
            cards: [
                {
                    'name': 'GET хандалт',
                    'color': 'gradient-quepal',
                    'icon': 'zmdi zmdi-check',
                    'value':'',
                    'text_color': 'text-success',
                    'border_color':'border-success',
                },
                {
                    'name': 'POST хандалт',
                    'color': 'gradient-bloody',
                    'icon': 'zmdi zmdi-check',
                    'value':'',
                    'text_color': 'text-danger',
                    'border_color':'border-danger',
                },
            ]
        }
    }

    componentDidMount() {
        this.get_post_detail()
    }

    get_post_detail() {
        service
            .get_post_detail()
            .then(({ success, fields }) => {
                if (success) {
                    this.setState({ fields })
                    for (var i in fields) {
                        this.state.cards[i].value= fields[i].value;
                    }
                    this.setState({ cards:  this.state.cards })
                }
            })
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            fields,
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
                <div className="row">
                    {this.state.cards.map((field, idx) =>
                        <Card_body
                            key={idx}
                            name={field.name}
                            color={field.color}
                            value={field.value}
                            icon={field.icon}
                            text_color={field.text_color}
                            border_color={field.border_color}
                        />
                    )}
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
