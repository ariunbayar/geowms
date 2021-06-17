import React, { Component } from 'react'
import { PortalDataTable } from "@utils/DataTable/index"
import Modal from "@utils/Modal/Modal"
import { service } from "./service"

class PositionList extends Component {

    constructor(props) {
        super(props)

        this.state={
            refresh: false,
            жагсаалтын_холбоос: `/gov/api/role/position/`,
            нэмэх_товч: props.is_backend ? `/back/байгууллага/түвшин/${props.match.params.level}/${props.match.params.id}/position/add/`: `/gov/perm/position/add/`,
            custom_query: {'org_id': props.match.params.id},
            талбарууд: [
                {'field': 'name', "title": 'Албан тушаал'},
            ],
            хувьсах_талбарууд: [
                {"field": "name", "text": ""},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleAsk(values),
                    "width": "100px"
                }
            ],
            prefix: `/gov/api/role/position/`,
            is_user: true,
            icon: "",
            modal_status: 'closed',
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.handleAsk = this.handleAsk.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    handleAsk(values){
        this.modalChange(
            "fa fa-exclamation-circle",
            null,
            "warning",
            "Албан тушаал устгах",
            `Та "${values.name}" нэртэй албан тушаалыг устгахдаа итгэлтэй байна уу?`,
            true,
            "Үгүй",
            "Тийм",
            () => this.handleRemove(values),
            null
        )
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    handleRemove(values) {
        const { prefix } = this.state
        var remove_link = prefix + values.id + "/" + "delete/"
        service.getRequest(remove_link)
            .then(({success, data, error}) => {
                if (success) {
                    this.setState({refresh: !this.state.refresh})
                    this.modalChange(
                        "fa fa-check-circle",
                        null,
                        "success",
                        data,
                        "",
                        false,
                        "",
                        "",
                        null,
                        null
                    )
                }
                else {
                    this.modalChange(
                        "fa fa-exclamation-circle",
                        null,
                        "danger",
                        "Устгах боломжгүй",
                        error,
                        false,
                        "",
                        "",
                        null,
                        null
                    )
                }
            })
            .catch(() => {
                this.props.history.goBack()
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
            is_user,
            body,
        } = this.state

        return (
            <div className={`${!this.props.is_backend && "card"}`}>
                <div className={`${!this.props.is_backend && "card-body"}`}>
                    <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'bg-dark'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэх_товч={нэмэх_товч ? нэмэх_товч : null}
                            custom_query={custom_query}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                            body={body}
                        />
                    </div>
                </div>
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    text={ this.state.text }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
            </div>
        )
    }
}

export default PositionList
