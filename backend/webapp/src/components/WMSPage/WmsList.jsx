import React, { Component } from "react"
import {service} from './service'
import { PortalDataTable } from "@utils/DataTable"

export class WmsList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            жагсаалтын_холбоос: '/back/wms/paginatedList/',
            талбарууд: [
                {'field': 'name', "title": 'Нэр'},
                {'field': 'url', "title": 'url',},
                {'field': 'created_at', "title": 'Огноо'},
                {'field': 'is_active', "title": 'ИДЭВХТЭЙ ЭСЭХ', 'has_action': true}
            ],
            хувьсах_талбарууд: [
                {
                    "field": "is_active",
                    "text": "",
                    "action": this.set_active_color,
                    "action_type": true,
                },
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.go_link(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemove(values),
                }
            ],
            refresh: true
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.go_link = this.go_link.bind(this)

    }

    set_active_color(boolean){
        let color = "text-danger fa fa-times"
        if(boolean) color = "text-success fa fa-check"
        return color
    }

    go_link(values){
        this.props.history.push(`/back/wms/${values.id}/засах/`)
    }

    handleRemove(values) {
        service.remove(values.id).then(({success}) => {
            if (success) {
                this.setState({refresh: !this.state.refresh})
            }
        })
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh } = this.state
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
                                нэмэх_товч={'/back/wms/үүсгэх/'}
                                refresh={refresh}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
