import React, { Component } from "react"

import { PortalDataTable } from "@utils/DataTable/index"
import Modal from "@utils/Modal/Modal"
import ModalAlert from "@utils/Modal/ModalAlert"
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
                {"field": "name", "action": (values) => this.go_link(values)},
                {"field": "token",  "text": ""},
                {"field": "created_at",  "text": ""},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.go_detial(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemoveAction(values),
                }
            ],

            modal_status: "closed",
            modal_alert_status: 'initial',
            values: {}
        }

        this.go_link = this.go_link.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    go_link(values) {
        const {org_level, org_id} = this.state
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${values.id}/дэлгэрэнгүй/`)
    }

    go_detial(values) {
        const {org_level, org_id} = this.state
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/${values.id}/засах/`)
    }

    handleRemoveAction(values){
        this.setState({values})
        this.handleModalOpen()
    }

    handleModalOpen(){
        this.setState({modal_status: 'open'})
    }

    handleModalClose(){
        this.setState({modal_status: 'closed',})
    }

    handleRemove() {
        const {values} = this.state
        service.remove(values.id).then(({success}) => {
            if (success) {
                this.setState({
                    refresh: !this.state.refresh,
                    modal_alert_status: success ? 'success' : 'fail'
                })
                this.handleModalClose()
            }
        })
    }

    modalAlertClose() {
        this.setState({modal_alert_status: 'closed'})
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
            values,
            modal_status,
            modal_alert_status,
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
                <Modal
                    text={`Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                    title={'Систем устгах'}
                    model_type_icon={'success'}
                    status={modal_status}
                    modalClose={this.handleModalClose}
                    modalAction={this.handleRemove}
                />
                <ModalAlert
                    status={ modal_alert_status == 'success' ? 'open' : 'closed' }
                    title="Системийг амжилттай устгалаа!"
                    model_type_icon="success"
                    modalAction={() => this.modalAlertClose()}
                />
            </div>
        )
    }
}
