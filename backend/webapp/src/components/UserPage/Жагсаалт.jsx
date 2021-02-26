import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable"
import BackButton from "@utils/Button/BackButton"


export class Жагсаалт extends Component {

    constructor(props) {

        super(props)
        this.state = {
            жагсаалтын_холбоос: '/back/api/user/paginatedList/',
            талбарууд: [
                {'field': 'first_name', "title": 'Нэр', 'has_action': true},
                {'field': 'email', "title": 'Цахим шуудан',},
                {'field': 'roles', "title": 'roles'},
                {'field': 'is_active', "title": 'Идэвхтэй эсэх', 'has_action': true},
                {'field': 'is_sso', "title": 'ДАН системээр баталгаажсан эсэх', 'has_action': true}
            ],
            хувьсах_талбарууд: [
                {
                    "field": "first_name",
                    "text": "",
                    "action": (values) => this.go_link(values),
                    "action_type": false,
                },
                {
                    "field": "is_active",
                    "text": "",
                    "action": this.set_active_color,
                    "action_type": true,
                },
                {
                    "field": "is_sso",
                    "text": "",
                    "component": this.dan_img,
                    "action_type": false,
                },

            ],
            refresh: true,
        }

        this.go_link = this.go_link.bind(this)

    }

    dan_img({values}){

        if(values.is_sso){
            return(
                <img className="dan-logo-icon" src="/static/assets/image/logo/dan-logo2.png"/>
            )
        }else{
            return(
                <p></p>
            )
        }
    }

    set_active_color(boolean){
        let color = "text-danger fa fa-times"
        if(boolean) color = "text-success fa fa-check"
        return color
    }

    go_link(values){
        this.props.history.push(`/back/user/${values.id}/дэлгэрэнгүй/`)
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh} = this.state
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <PortalDataTable
                                талбарууд={талбарууд}
                                жагсаалтын_холбоос={жагсаалтын_холбоос}
                                уншиж_байх_үед_зурвас={"Уншиж байна"}
                                хувьсах_талбарууд={хувьсах_талбарууд}
                                нэмэлт_талбарууд={нэмэлт_талбарууд}
                                refresh={refresh}
                            />
                        </div>
                    </div>
                </div>
                <BackButton {...this.props} name={'Буцах'}></BackButton>
            </div>
        )
    }
}
