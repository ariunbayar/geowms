import React, { Component } from "react"
import {service} from './Role/service'
import ModalAlert from "@utils/Modal/ModalAlert"
import { PortalDataTable } from "@utils/DataTable/index"
import Modal from "@utils/Modal/Modal"


export class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            perms: props.perms,
            modal_status: "closed",
            alert_modal_status: "closed",
            refresh: false,
            жагсаалтын_холбоос: '/gov/api/role/',
            нэмэх_товч: '/gov/perm/role/add/',
            custom_query: {},
            талбарууд: [
                {'field': 'name', "title": 'Нэр', 'has_action': true},
            ],
            хувьсах_талбарууд: [
                {"field": "name", "action": (values) => this.detai_go_link(values)},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.go_link(values),
                    "width": "100px"
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemoveAction(values),
                    "width": "100px"
                }
            ],
            values: {},
            title: "",
            icon: ""
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
    }

    modalClose(){
        this.setState({alert_modal_status: 'closed'})
    }

    modalOpen(title, icon){
        this.setState({alert_modal_status: 'open', title, icon})
    }

    handleRemoveAction(values){
        this.setState({values})
        this.handleModalOpen()
    }

    handleModalOpen(){
        this.setState({modal_status: 'open'})
    }

    handleModalClose(){
        this.setState({modal_status: 'closed'})
    }

    detai_go_link(values){
        this.props.history.push(`/gov/perm/role/${values.id}/detail/`)
    }

    go_link(values){
        this.props.history.push(`/gov/perm/role/${values.id}/edit/`)
    }

    handleRemove() {
        const { id } = this.state.values
        service.deleteRole(id).then(({ success }) => {
            if(success){
                this.setState({refresh: !this.state.refresh})
                this.modalOpen("Амжилттай устлаа", "success")
            }else{
                this.modalOpen("Алдаа гарлаа", "danger")
            }
        })
    }

    render() {
        const {
            refresh,
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            нэмэх_товч,
            нэмэлт_талбарууд,
            modal_status,
            values,
            alert_modal_status,
            title, icon
        } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <PortalDataTable
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        per_page={20}
                        уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        нэмэх_товч={нэмэх_товч}
                        нэмэлт_талбарууд={нэмэлт_талбарууд}
                        color={'primary'}
                        refresh={refresh}
                    />
                </div>
                <Modal
                    text={`Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                    title={'Тохиргоог устгах'}
                    model_type_icon={'success'}
                    status={modal_status}
                    modalClose={this.handleModalClose}
                    modalAction={this.handleRemove}
                />
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={alert_modal_status}
                    title={title}
                    model_type_icon={icon}
                />
            </div>
        );
    }
}
