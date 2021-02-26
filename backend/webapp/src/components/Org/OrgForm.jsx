import React, { Component } from "react"
import {service} from "./service"
import ModalAlert from "../ModalAlert"
import { PortalDataTable } from "@utils/DataTable"
import BackButton from "@utils/Button/BackButton"
import Modal from "../Modal"
import Loader from "@utils/Loader"


export class OrgForm extends Component {

    constructor(props) {
        super(props)

        this.initials = {
            currentPage: 1,
        }

        this.state = {
            level: props.match.params.level || 1,

            жагсаалтын_холбоос: `/back/api/org/level-${props.match.params.level}/org-list/`,
            талбарууд: [
                {'field': 'name', "title": 'Байгууллага нэр', 'has_action': true},
                {'field': 'num_employees', "title": 'Албан хаагчид',},
                {'field': 'num_systems', "title": 'Систем'},
            ],
            хувьсах_талбарууд: [
                {
                    "field": "name",
                    "text": "",
                    "action": (values) => this.go_link(values),
                    "action_type": false,
                },
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.go_edit_link(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemoveAction(values),
                }
            ],
            нэмэх_товч: `/back/байгууллага/түвшин/${props.match.params.level}/нэмэх/`,
            уншиж_байх_үед_зурвас: "Уншиж байна",
            refresh: true,
            values: {},
            modal_status: 'closed',
            action_modal_status: 'closed',
            is_loading: false
        }

        this.modalClose = this.modalClose.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.go_link = this.go_link.bind(this)
        this.go_edit_link = this.go_edit_link.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.handleRemove = this.handleRemove.bind(this)

    }

    handleRemoveAction(values){
        this.setState({values})
        this.modalOpen('action_modal_status')
    }

    go_link(values){
        const {level} = this.state
        this.props.history.push(`/back/байгууллага/түвшин/${level}/${values.id}/хэрэглэгч/`)
    }

    go_edit_link(values){
        const {level} = this.state
        this.props.history.push(`/back/байгууллага/түвшин/${level}/${values.id}/засах`)
    }

    modalClose(name) {
        this.setState({[name]: "closed", msg: '', style: ''})
    }

    modalOpen(name) {
        this.setState({[name]: "open"})
    }

    handleRemove() {
        this.setState({is_loading: true})
        const { load, values } = this.state
        const level = this.props.match.params.level
        service.org_remove(level, values.id).then(({ success }) => {
            var a = load
            a++
            if (success) {
                this.setState({ is_loading: false, load: a, msg: "Амжилттай устлаа.", style: 'success', modal_status: 'open', refresh: !this.state.refresh})
            }else{
                this.setState({ is_loading: false, load: a, msg: "Амжилтгүй устлаа.", style: 'danger', modal_status: 'open', refresh: !this.state.refresh})
            }
        }).catch(() => {
            this.setState({is_loading: false})
        })
    }

    render() {
        const { msg, style, modal_status,
            талбарууд, жагсаалтын_холбоос,
            хувьсах_талбарууд, нэмэлт_талбарууд, refresh,
            нэмэх_товч, уншиж_байх_үед_зурвас,
            action_modal_status, values, is_loading
        } = this.state
        return (
            <div className="main-content">
                <div className="page-container">
                    <PortalDataTable
                        талбарууд={талбарууд}
                        жагсаалтын_холбоос={жагсаалтын_холбоос}
                        хувьсах_талбарууд={хувьсах_талбарууд}
                        нэмэлт_талбарууд={нэмэлт_талбарууд}

                        refresh={refresh}
                        уншиж_байх_үед_зурвас={уншиж_байх_үед_зурвас}
                        нэмэх_товч={нэмэх_товч}
                    />
                </div>
                <Modal
                    modalAction={() => this.modalClose('action_modal_status')}
                    text={`Та "${values.name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`}
                    title="Байгууллага устгах"
                    model_type_icon = "success"
                    status={action_modal_status}
                    modalClose={() => this.handleRemove()}
                />
                <ModalAlert
                    title={msg}
                    model_type_icon={style}
                    status={modal_status}
                    modalAction={() => this.modalClose('modal_status')}
                />
                <Loader is_loading={is_loading}/>
            </div>
        )

    }

}
