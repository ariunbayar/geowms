import React, { Component } from "react"
import { service } from "../service"

import {Charts} from './Chart'
import { PortalDataTable } from "@utils/DataTable"
import { Card_body } from "@utils/Card_template/Card_body"


export class LoginLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fields :[],
            талбарууд: [
                {'field': 'username', "title": 'Хэрэглэгчийн нэр'},
                {'field': 'login_type', "title": 'Хэрэглэгчийн үйлдэл', 'has_action': true},
                {'field': 'user_id', "title": 'Хэрэглэгчийн дугаар'},
                {'field': 'remote_ip', "title": 'IP Хаяг'},
                {'field': 'datetime', "title": 'Нэвтэрсэн огноо'},
            ],
            жагсаалтын_холбоос: '/back/api/log/login-list/',
            хувьсах_талбарууд: [{"field": "login_type", "action": this.get_login_type, "action_type": true,}],
            cards: [
                {
                    'name': ' Нэвтэрсэн хэрэглэгчийн ',
                    'color': 'gradient-scooter',
                    'icon': 'icon-people',
                    'text_color': 'text-info',
                    'state': 'Өнөөдрийн байдлаар',
                    'border_color':'border-info',
                },
                {
                    'name': 'Нэвтэрсэн хэрэглэгч',
                    'color': 'gradient-quepal',
                    'icon': 'icon-login',
                    'text_color': 'text-success',
                    'state':'Өнөөдрийн байдлаар',
                    'border_color':'border-success',
                },
                {
                    'name': ' Системээс гарсан хэрэглэгч',
                    'color': 'gradient-bloody',
                    'icon': 'icon-logout',
                    'text_color': 'text-danger',
                    'state':'Өнөөдрийн байдлаар',
                    'border_color':'border-danger',
                },
            ]
        }
    }

    componentDidMount() {
        this.getCardField()
    }

    getCardField() {
        service
            .getCarField()
            .then(({ success, fields }) => {
                if (success) {
                    this.setState({ fields })
                }
                for (var i in fields) {
                    this.state.cards[i].value= fields[i].value;
                }
                this.setState({ cards:  this.state.cards })
            })
    }

    get_login_type(key){
        let obj = {"Системээс гарсан": "text-danger", "Нэвтэрсэн": "text-success"}
        return obj[key]
    }

    render() {
        const { fields, талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд} = this.state
        return (
           <div>
                <div className="row">
                    <div className="col-lg-12">
                        <h5 className="text-uppercase text-center">Хандалтын тоогоор</h5>
                        <div className="card-body">
                            <Charts/>
                        </div>
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
                        card_state={field.state}
                        border_color={field.border_color}
                    />
                )}
                </div>
                <h5 className="mb-3 text-center text-uppercase">Хэрэглэгчийн оролт гаралтын тэмдэглэл</h5>
                <div className="row my-2">
                    <div className="col-lg-12">
                        <PortalDataTable
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={100}
                            уншиж_байх_үед_зурвас={"Уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                        />
                    </div>
                </div>
           </div>
        )

    }
}
