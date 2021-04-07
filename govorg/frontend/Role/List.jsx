import React, { Component } from "react"
import {service} from './Role/service'
import { PortalDataTable } from "@utils/DataTable/index"
import Modal from "@utils/Modal/Modal"


export class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            perms: props.perms,
            refresh: false,
            жагсаалтын_холбоос: '/gov/api/role/role-list/',
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
            icon: "",
            modal_status: 'closed'
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)

        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
    }

    handleRemoveAction(values){
        this.setState({values})
        this.handleModalOpen(values)
    }

    handleModalOpen(values){
        this.modalChange(
            'fa fa-exclamation-circle',
            "warning",
            'Тохиргоог устгах',
            `Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`,
            true
        )
    }

    modalChange(modal_icon, icon_color, title, text, has_button) {
        this.setState({
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
        })
        this.modalOpen()
    }

    modalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
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
            if (success) {
                this.setState({refresh: !this.state.refresh})
                this.modalChange(
                    'fa fa-check-circle',
                    "success",
                    'Амжилттай устгалаа',
                    '',
                    false
                )
            } else {
                this.modalChange(
                    'fa fa-times-circle',
                    "danger",
                    'Усгахад алдаа гарлаа',
                    '',
                    false
                )
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
            values,
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
                    modal_status={this.state.modal_status}
                    modal_icon={this.state.modal_icon}
                    icon_color={this.state.icon_color}
                    title={this.state.title}
                    has_button={this.state.has_button}
                    text={this.state.text}
                    modalAction={this.handleRemove}
                    actionNameDelete="Устгах"
                />
            </div>
        );
    }
}
