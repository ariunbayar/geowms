import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"


export class LogForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/back/payment/payment-list/',
            custom_query: {},
            талбарууд: [
                {'field': 'user_firstname', "title": 'Хэрэглэгч', 'has_action': true},
                {'field': 'is_success', "title": 'Төлөв'},
                {'field': 'total_amount', "title": 'Нийт дүн'},
                {'field': 'description', "title": 'Тодорхойлолт'},
                {'field': 'code', "title": 'Код'},
                {'field': 'message', "title": 'Мэдэгдэл'},
                {'field': 'data_id', "title": 'Дата ID'},
                {'field': 'bank_unique_number', "title": 'Банкны дугаар'},
                {'field': 'geo_unique_number', "title": 'Гео дугаар'},
                {'field': 'created_at', "title": 'Огноо'},
            ],
            хувьсах_талбарууд: [
                {"field": "user_firstname", "action": (values) => this.go_link(values)},
                {"field": "is_success",  "text": ""},
                {"field": "total_amount",  "text": ""},
                {"field": "description",  "text": ""},
                {"field": "code",  "text": ""},
                {"field": "message",  "text": ""},
                {"field": "data_id",  "text": ""},
                {"field": "bank_unique_number",  "text": ""},
                {"field": "geo_unique_number",  "text": ""},
                {"field": "created_at",  "text": ""},
            ],
        }
    }

    go_link(values){
        this.props.history.push(`/back/user/${values.user_id}/дэлгэрэнгүй/`)
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
