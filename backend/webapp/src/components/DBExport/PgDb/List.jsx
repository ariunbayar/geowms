import React, { Component } from "react"
import {service} from '../service'
import { PortalDataTable } from "@utils/DataTable"
import Modal from "@utils/Modal/Modal"
import BackButton from "@utils/Button/BackButton"

export default class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            жагсаалтын_холбоос: `/back/another-database/pg/tables/${props.match.params.id}/all/`,
            талбарууд: [
                {'field': 'feature_code', "title": 'Feature-ийн нэр'},
                {'field': 'table_name', "title": 'Хүснэгтийн нэр'},
                {'field': 'created_at', "title": 'Үүссэн'},
                {'field': 'updated_at', "title": 'Зассан'},
            ],
            нэмэлт_талбарууд: [
                {
                    "title": 'Бааз шинэчлэх',
                    "text": '',
                    "icon": 'fa fa-car text-danger',
                    "action": (values) => this.handleExportAction(values),
                },
                {
                    "title": 'Засах',
                    "text": '', "icon":
                    'fa fa-pencil-square-o text-success',
                    "action": (values) => this.goLink(values),
                },
                {
                    "title": 'Устгах',
                    "text": '',
                    "icon": 'fa fa-trash-o text-danger',
                    "action": (values) => this.handleRemoveAction(values),
                },

            ],
            refresh: true,
            modal_status: "closed",
            values: {}
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.goLink = this.goLink.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleRemoveAction = this.handleRemoveAction.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.refreshTable = this.refreshTable.bind(this)
    }

    goLink(values){
        this.props.history.push(`/back/db-export/connection/pg/${values.another_database_id}/${values.id}/update/`)
    }

    handleRemove() {
        const {values, id} = this.state
        service.pg_config.removeTable(id, values.id).then(({success}) => {
            if (success) {
                this.setState({refresh: !this.state.refresh})
            }
        })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handleRemoveAction(values){
        this.setState({values})
        this.modalChange(
            'fa fa-exclamation-triangle',
            null,
            'warning',
            'Тохиргоог устгах',
            `Та "${values.table_name}" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?`,
            true,
            '',
            '',
            (values) => this.handleRemove(values),
            null
        )
    }

    handleExportAction(values){
        this.setState({values})
            this.modalChange(
                'fa fa-check-circle',
                null,
                'success',
                'Бааз шинэчлэх',
                `Та "${values.table_name}" нэртэй хүснэгтийн ****  итгэлтэй байна уу?`,
                true,
                '',
                'Тийм',
                (values) => this.refreshTable(values),
                null
            )
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
    refreshTable(){
        const {values, id} = this.state
        service.pg_config.refreshOneTable(id, values.id).then(({success, info, table_info}) => {
            if (success) {
                this.setState({is_loading: false})
                var table_res = table_info.join("\n")
                this.modalChange(
                    'fa fa-check-circle',
                    null,
                    'success',
                    'Амжилттай',
                    `${table_res}`,
                    false,
                    '',
                    '',
                    null,
                    null
                )
            }else{
                this.setState({is_loading: false})
                this.modalChange(
                    'fa fa-times-circle',
                    null,
                    'danger',
                    'Алдаа гарлаа',
                    info,
                    false,
                    '',
                    '',
                    null,
                    null
                )
            }

        })
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, values, modal_status, id } = this.state
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
                                нэмэх_товч={`/back/db-export/connection/pg/${id}/create/`}
                                refresh={refresh}
                            />
                        </div>
                    </div>
                </div>
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    text={ this.state.text }
                    title={ this.state.title }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
                <BackButton
                    {...this.props}
                    name={'Буцах'}
                    navlink_url={`/back/db-export/`}
                />
            </div>
        )
    }
}
