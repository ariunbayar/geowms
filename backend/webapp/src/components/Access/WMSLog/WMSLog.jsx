import React, { Component } from "react"
import { service } from "../service"

import { PortalDataTable } from "@utils/DataTable/index"
import {Charts} from './Chart'
import { Card_body } from "@utils/Card_template/Card_body"


export default class WMSLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/back/api/log/wms_log_list/',
            custom_query: {},
            fields :[],
            талбарууд: [
                {'field': 'qs_request', "title": 'qs_request'},
                {'field': 'rsp_status', "title": 'rsp[_status'},
                {'field': 'rsp_size', "title": 'rsp_size'},
                {'field': 'created_at', "title": 'Нэвтрэсэн огноо'},
                {'field': 'system_id', "title": 'Системийн ID'},
                {'field': 'wms_id', "title": 'WMS ID'},
                {'field': 'qs_all', "title": 'qs_all'},
            ],
            cards: [
                {
                    'name': 'Response Max Size',
                    'color': 'gradient-quepal',
                    'icon': 'ti-files',
                    'text_color': 'text-success',
                    'value': '',
                    'border_color':'border-success',
                    'col_size': 'col-12 col-lg-6 col-xl-6 '
                },
                {
                    'name': ' Response Min Size',
                    'color': 'gradient-quepal',
                    'icon': 'ti-file',
                    'text_color': 'text-success',
                    'value': '',
                    'border_color':'border-success',
                    'col_size': 'col-12 col-lg-6 col-xl-6 '
                },
                {
                    'name': ' RSP 200  ',
                    'color': 'gradient-quepal',
                    'icon': 'fa fa-check',
                    'text_color': 'text-success',
                    'value': '',
                    'border_color':'border-success',
                },
                {
                    'name': 'RSP 301 ',
                    'color': 'gradient-blooker',
                    'icon': 'fa fa-repeat',
                    'text_color': 'text-warning',
                    'value': '',
                    'border_color':'border-warning',
                },
                {
                    'name': 'RSP 404',
                    'color': 'gradient-bloody',
                    'icon': 'zmdi zmdi-alert-circle',
                    'text_color': 'text-danger',
                    'value': '',
                    'border_color':'border-danger',
                },
                {
                    'name': ' RSP 500',
                    'color': 'gradient-ibiza',
                    'icon': 'zmdi zmdi-alert-triangle',
                    'text_color': 'text-danger',
                    'value': '',
                    'border_color':'border-danger',
                },
            ]
        }
    }
    componentDidMount(){
        this.getRspStatus()
    }

    getRspStatus() {
        service
            .get_rsp_status()
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
                            col_size={field.col_size}
                        />
                    )}
                    </div>
                    <h5 className="mb-3 text-center text-uppercase">WMS url ашиглан хандалт хийсэн логийн тэмдэглэл</h5>
                    <div className="col-md-12">
                        <PortalDataTable
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
