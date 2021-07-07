import React, { Component } from "react"
import { PortalDataTable } from "@utils/DataTable/index"
import { service } from './service'

export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refresh: false,
            жагсаалтын_холбоос: '/back/api/org/perm-get-list/',
            custom_query: {},
            талбарууд: [
                {'field': 'name', "title": 'Эрхийн нэр', 'has_action': true},
                {'field': 'description', "title": 'Тайлбар'},
                {'field': 'created_by', "title": 'Үүсгэсэн'},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": "Засах",
                    "text": "",
                    "icon": "fa fa-pencil-square-o text-success",
                    "action": (values) => this.editLink(values)
                },
                {
                    "title": "Устгах",
                    "text": "",
                    "icon": "fa fa-trash-o text-danger",
                    "action": (values) => this.handleRemoveModal(values)
                }
            ],
            хувьсах_талбарууд: [
                {"field": "name", "action": (values) => this.go_link(values)},
            ],
        }
        this.editLink = this.editLink.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleRemoveModal = this.handleRemoveModal.bind(this)
    }

    handleRemoveModal(values) {
        const modal = {
            modal_status: "open",
            modal_icon: "fa fa-exclamation-circle",
            modal_bg: '',
            icon_color: 'warning',
            title: 'Эрх устгах',
            text: `Та "${values.name}" нэртэй эрхийг устгах уу?`,
            has_button: true,
            actionNameBack: 'Үгүй',
            actionNameDelete: 'Тийм',
            modalAction: () => this.handleRemove(values),
            modalClose: null
        }
        global.MODAL(modal)
    }

    handleRemove(values) {
        service.remove(values.id)
            .then(({ success }) => {
                if (success) {
                    this.setState({ refresh: !this.state.refresh })
                    const modal = {
                        modal_status: "open",
                        modal_icon: "fa fa-check-circle",
                        modal_bg: '',
                        icon_color: 'success',
                        title: 'Амжилттай устгалаа',
                        text: '',
                        has_button: false,
                        actionNameBack: '',
                        actionNameDelete: '',
                        modalAction: null,
                        modalClose: null
                    }
                    global.MODAL(modal)
                }
            })
    }

    editLink(values) {
        this.props.history.push(`/back/org-role/add/${values.id}/`)
    }

    go_link(values) {
        this.props.history.push(`/back/org-role/update/${values.id}/`)
    }

    render() {
        const {
            талбарууд,
            жагсаалтын_холбоос,
            хувьсах_талбарууд,
            нэмэлт_талбарууд,
            refresh,
        } = this.state

        return (
            <div className="my-2 card">
                <div className="card-body">
                    <PortalDataTable
                        refresh={refresh}
                        color={'bg-dark'}
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        per_page={20}
                        уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        нэмэлт_талбарууд={нэмэлт_талбарууд}
                        нэмэх_товч={"/back/org-role/add/"}
                    />
                </div>
            </div>
        )
    }
}
