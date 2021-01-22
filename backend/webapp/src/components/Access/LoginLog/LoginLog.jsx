import React, { Component } from "react"
import {Charts} from './Chart'
import { PortalDataTable } from "@utils/DataTable"


export class LoginLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            талбарууд: [
                {'field': 'username', "title": 'Хэрэглэгчийн нэр'},
                {'field': 'login_type', "title": 'Хэрэглэгчийн үйлдэл'},
                {'field': 'user_id', "title": 'Хэрэглэгчийн дугаар'},
                {'field': 'remote_ip', "title": 'IP Хаяг'},
                {'field': 'datetime', "title": 'Нэвтэрсэн огноо'},
            ],
            жагсаалтын_холбоос: '/back/api/log/login-list/',
            хувьсах_талбарууд: [{"field": "login_type", "action": this.get_login_type}]
        }
    }

    get_login_type(key){
        let obj = {"Системээс гарсан": "text-danger", "Нэвтэрсэн": "text-success"}
        return obj[key]
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд } = this.state
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
