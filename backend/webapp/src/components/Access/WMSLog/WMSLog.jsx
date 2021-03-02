import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"
import {Charts} from './Chart'


export default class WMSLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/back/api/log/wms_log_list/',
            custom_query: {},
            талбарууд: [
                {'field': 'qs_request', "title": 'qs_request'},
                {'field': 'rsp_status', "title": 'rsp[_status'},
                {'field': 'rsp_size', "title": 'rsp_size'},
                {'field': 'created_at', "title": 'Нэвтрэсэн огноо'},
                {'field': 'system_id', "title": 'Системийн ID'},
                {'field': 'wms_id', "title": 'WMS ID'},
                {'field': 'qs_all', "title": 'qs_all'},
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
