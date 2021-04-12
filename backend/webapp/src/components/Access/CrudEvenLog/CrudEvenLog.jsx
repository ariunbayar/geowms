import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import { PortalDataTable } from "@utils/DataTable/index"
import { service } from "../service"
import Card_body from "../../../../../../src/components/Card_template/Card_body"


export class CrudEvenLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fields:[],
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
            cards: [
                {
                    'name': ' Шинэчилсэн үйлдэл',
                    'color': 'gradient-quepal',
                    'icon': 'zmdi zmdi-check',
                    'value': '',
                    'text_color': 'text-success',
                    'border_color':'border-success',
                },
                {
                    'name': 'Зассан үйлдэл',
                    'color': 'gradient-blooker',
                    'icon': 'fa fa-refresh',
                    'value': '',
                    'text_color': 'text-warning',
                    'border_color':'border-warning',
                },
                {
                    'name': ' Устгасан үйлдэл',
                    'color': 'gradient-bloody',
                    'icon': 'fa fa-trash',
                    'value': '',
                    'text_color': 'text-danger',
                    'border_color':'border-danger',
                },
            ],

        }
        this.getCrudEvent = this.getCrudEvent.bind(this)
    }


    componentDidMount() {
        this.getCrudEvent()
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

    getCrudEvent() {
        service
            .get_crud_events()
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
            fields,
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
