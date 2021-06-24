import React, { Component } from "react"

import { PortalDataTable } from "@utils/DataTable/index"
import {service} from './service'
export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.state = {
            org_level: this.props.match.params.level,
            org_id: this.props.match.params.id,

            refresh: false,
            нэмэх_товч: `/back/байгууллага/түвшин/${props.match.params.level}/${props.match.params.id}/систем/үүсгэх/`,
            жагсаалтын_холбоос: `/back/api/систем/govorgList/${props.match.params.id}/`,
            custom_query: {},
            талбарууд: [
                {'field': 'name', "title": 'Системийн нэрүүд', 'has_action': true},
                {'field': 'token', "title": 'Токен'},
                {'field': 'created_at', "title": 'Үүсгэсэн огноо'},
            ],
            хувьсах_талбарууд: [
                {"field": "name", "action": (values) => this.goLink(values)},
                {"field": "token",  "text": ""},
                {"field": "created_at",  "text": ""},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.goDetail(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleModalOpen(values),
                }
            ],

            values: {},
            modal_status: 'closed'
        }

        this.goLink = this.goLink.bind(this)
        this.goDetail = this.goDetail.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    setModal(modal_icon, icon_color, title, text, has_button, action) {
        const modal = {
            modal_status: "open",
            modal_icon: modal_icon,
            modal_bg: '',
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: 'Буцах',
            actionNameDelete: '',
            modalAction: action,
            modalClose: this.modalClose,
        }
        global.MODAL(modal)
    }

    goLink(values) {
        const { org_level, org_id } = this.state
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${values.id}/дэлгэрэнгүй/`)
    }

    goDetail(values) {
        const {org_level, org_id} = this.state
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${values.id}/засах/`)
    }

    handleModalOpen(values){
        if (values) {
            this.setModal(
                'fa fa-exclamation-circle',
                "warning",
                'Систем устгах',
                `Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`,
                true,
                () => this.handleRemove(values),
            )
        }
    }

    handleRemove(values) {
        service.remove(values.id).then(({ success }) => {
            if (success) {
                global.refreshSystemCount()
                this.setModal('fa fa-check-circle', "success", 'Амжилттай устгалаа', '', false)
                this.setState({
                    refresh: !this.state.refresh
                })
            }
        })
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            custom_query,
            нэмэх_товч,
            нэмэлт_талбарууд,
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
                            нэмэх_товч={нэмэх_товч}
                            custom_query={custom_query}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
